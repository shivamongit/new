import { isDirectImageUrl, isTrustedImageUrl } from "./url";

export type RedditImage = {
  url: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  trusted: boolean;
  role: "photo" | "thumbnail";
};

export type RedditPostImages = {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  permalink: string;
  nsfw: boolean;
  score: number;
  images: RedditImage[];
  videoUrl: string | null;
};

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
};

type Loose = Record<string, unknown>;

export function imagesFromListing(payload: unknown): RedditPostImages {
  const post = readListingPost(payload);
  return imagesFromPost(post);
}

export function imagesFromPost(post: Loose): RedditPostImages {
  const parent = firstCrosspost(post);
  const images = collectImages(post);
  const resolvedImages = images.length > 0 || !parent ? images : collectImages(parent);

  return {
    id: text(post.id),
    title: text(post.title) || "Reddit post",
    author: text(post.author) || "unknown",
    subreddit: text(post.subreddit) || "reddit",
    permalink: permalinkOf(post),
    nsfw: post.over_18 === true,
    score: typeof post.score === "number" ? post.score : 0,
    images: resolvedImages,
    videoUrl: videoUrlOf(post) ?? (parent ? videoUrlOf(parent) : null),
  };
}

function collectImages(post: Loose): RedditImage[] {
  const gallery = galleryImages(post);
  if (gallery.length > 0) return dedupe(gallery);

  const direct = directImage(post);
  if (direct) return [direct];

  const preview = previewImage(post, "photo");
  return preview ? [preview] : [];
}

function galleryImages(post: Loose): RedditImage[] {
  const metadata = asRecord(post.media_metadata);
  if (!metadata) return [];

  const items = galleryItems(post);
  const ids = items.length > 0 ? items.map((item) => item.id) : Object.keys(metadata);
  const captions = new Map(items.map((item) => [item.id, item.caption]));
  const images: RedditImage[] = [];

  for (const id of ids) {
    const media = asRecord(metadata[id]);
    if (!media || media.status === "failed" || media.e === "RedditVideo") continue;
    const source = asRecord(media.s);
    const mime = text(media.m);
    const original = galleryOriginal(id, mime);
    const fallback = text(source?.u) || text(source?.gif);
    const url = original || (fallback && isDirectImageUrl(fallback) ? fallback : "");
    if (!url) continue;
    images.push({
      url,
      width: numberOrNull(source?.x),
      height: numberOrNull(source?.y),
      caption: captions.get(id) ?? null,
      trusted: isTrustedImageUrl(url),
      role: "photo",
    });
  }

  return images;
}

function galleryItems(post: Loose): { id: string; caption: string | null }[] {
  const gallery = asRecord(post.gallery_data);
  const items = gallery?.items;
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const record = asRecord(item);
    const id = text(record?.media_id);
    if (!id) return [];
    const caption = text(record?.caption);
    return [{ id, caption: caption || null }];
  });
}

function galleryOriginal(id: string, mime: string): string | null {
  const ext = MIME_EXT[mime];
  if (!ext || !/^[a-z0-9]+$/i.test(id)) return null;
  return `https://i.redd.it/${id}.${ext}`;
}

function directImage(post: Loose): RedditImage | null {
  const dest = text(post.url_overridden_by_dest) || text(post.url);
  if (!dest || !isDirectImageUrl(dest)) return null;
  const preview = previewImage(post, "photo");
  return {
    url: dest,
    width: preview?.width ?? null,
    height: preview?.height ?? null,
    caption: null,
    trusted: isTrustedImageUrl(dest),
    role: "photo",
  };
}

function previewImage(post: Loose, role: "photo" | "thumbnail"): RedditImage | null {
  const preview = asRecord(post.preview);
  const images = preview?.images;
  if (!Array.isArray(images)) return null;
  const first = asRecord(images[0]);
  const source = asRecord(first?.source);
  const url = text(source?.url);
  if (!url || !isDirectImageUrl(url)) return null;
  return {
    url,
    width: numberOrNull(source?.width),
    height: numberOrNull(source?.height),
    caption: null,
    trusted: isTrustedImageUrl(url),
    role,
  };
}

function videoUrlOf(post: Loose): string | null {
  const media = asRecord(post.secure_media) ?? asRecord(post.media);
  const video = asRecord(media?.reddit_video);
  const fallback = text(video?.fallback_url);
  if (!fallback) return null;
  try {
    const url = new URL(fallback);
    if (url.protocol !== "https:" || url.hostname !== "v.redd.it") return null;
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

function readListingPost(payload: unknown): Loose {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("Reddit returned an unexpected response.");
  }
  const listing = asRecord(payload[0]);
  const data = asRecord(listing?.data);
  const children = data?.children;
  const first = Array.isArray(children) ? asRecord(children[0]) : null;
  const post = asRecord(first?.data);
  if (!post) throw new Error("Reddit returned an unexpected response.");
  return post;
}

function firstCrosspost(post: Loose): Loose | null {
  const list = post.crosspost_parent_list;
  if (!Array.isArray(list)) return null;
  return asRecord(list[0]);
}

function dedupe(images: RedditImage[]): RedditImage[] {
  const seen = new Set<string>();
  const unique: RedditImage[] = [];
  for (const image of images) {
    const key = image.url.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(image);
  }
  return unique;
}

function permalinkOf(post: Loose): string {
  const permalink = text(post.permalink);
  if (permalink.startsWith("/")) return `https://www.reddit.com${permalink}`;
  if (permalink.startsWith("https://")) return permalink;
  return "https://www.reddit.com/";
}

function asRecord(value: unknown): Loose | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Loose;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}
