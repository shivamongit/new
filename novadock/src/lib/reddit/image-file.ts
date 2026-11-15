import { REDDIT_USER_AGENT, isTrustedImageUrl } from "./url";

const MAX_BYTES = 20 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

export class ImageFetchError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ImageFetchError";
    this.status = status;
  }
}

export type FetchedImage = {
  bytes: Uint8Array;
  contentType: string;
  filename: string;
};

export async function fetchTrustedImage(
  src: string,
  fetchImpl: typeof fetch = fetch,
): Promise<FetchedImage> {
  let current = src;
  let response: Response | null = null;

  for (let hop = 0; hop < 4; hop++) {
    if (!isTrustedImageUrl(current)) {
      throw new ImageFetchError("That image host is not available for download.", 400);
    }
    let next: Response;
    try {
      next = await fetchImpl(current, {
        redirect: "manual",
        headers: { "User-Agent": REDDIT_USER_AGENT, Accept: "image/*" },
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new ImageFetchError("Could not download that image.", 502);
    }

    if (next.status >= 300 && next.status < 400) {
      const location = next.headers.get("location");
      await next.body?.cancel();
      if (!location) {
        throw new ImageFetchError("Could not download that image.", 502);
      }
      current = new URL(location, current).toString();
      continue;
    }

    response = next;
    break;
  }

  if (!response || !response.ok || !response.body) {
    throw new ImageFetchError("Could not download that image.", 502);
  }

  const contentType = (response.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!ALLOWED_TYPES.has(contentType)) {
    await response.body.cancel();
    throw new ImageFetchError("That file is not a supported image.", 415);
  }

  const advertised = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(advertised) && advertised > MAX_BYTES) {
    await response.body.cancel();
    throw new ImageFetchError("That image is too large to download.", 413);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new ImageFetchError("That image is too large to download.", 413);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    bytes,
    contentType: contentType === "image/jpg" ? "image/jpeg" : contentType,
    filename: filenameFor(current, contentType),
  };
}

function filenameFor(src: string, contentType: string): string {
  const ext =
    contentType === "image/png"
      ? "png"
      : contentType === "image/gif"
        ? "gif"
        : contentType === "image/webp"
          ? "webp"
          : contentType === "image/avif"
            ? "avif"
            : "jpg";
  try {
    const base = new URL(src).pathname.split("/").pop() ?? "";
    const clean = base.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 80);
    if (clean && /\.[a-z0-9]+$/i.test(clean)) return clean;
    if (clean) return `${clean}.${ext}`;
  } catch {
    // fall through
  }
  return `reddit-image.${ext}`;
}
