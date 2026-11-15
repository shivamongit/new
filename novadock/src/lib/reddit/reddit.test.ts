import { describe, expect, it, vi } from "vitest";
import { imagesFromListing } from "./extract";
import { fetchTrustedImage, ImageFetchError } from "./image-file";
import { lookupRedditImages, RedditLookupError } from "./load";
import { isTrustedImageUrl, parseRedditPostUrl, RedditUrlError } from "./url";

const listing = (post: Record<string, unknown>) => [
  { data: { children: [{ data: post }] } },
];

describe("parseRedditPostUrl", () => {
  it("accepts a post permalink and ignores query params", () => {
    expect(
      parseRedditPostUrl(
        "https://www.reddit.com/r/pics/comments/abc123/a_title/?utm_source=share",
      ),
    ).toEqual({ kind: "permalink", subreddit: "pics", id: "abc123" });
  });

  it("accepts old reddit, short links, and gallery links", () => {
    expect(
      parseRedditPostUrl("https://old.reddit.com/r/EarthPorn/comments/zz99/nice/"),
    ).toEqual({ kind: "permalink", subreddit: "EarthPorn", id: "zz99" });
    expect(parseRedditPostUrl("https://redd.it/abc123")).toEqual({
      kind: "id",
      id: "abc123",
    });
    expect(parseRedditPostUrl("www.reddit.com/gallery/abc123")).toEqual({
      kind: "id",
      id: "abc123",
    });
  });

  it("rejects feeds, profiles, and other sites", () => {
    expect(() => parseRedditPostUrl("https://www.reddit.com/r/pics/")).toThrow(
      RedditUrlError,
    );
    expect(() =>
      parseRedditPostUrl("https://www.reddit.com/user/spez"),
    ).toThrow(RedditUrlError);
    expect(() => parseRedditPostUrl("https://example.com/r/pics/comments/abc123")).toThrow(
      /reddit\.com/,
    );
    expect(() => parseRedditPostUrl("javascript:alert(1)")).toThrow(RedditUrlError);
  });
});

describe("imagesFromListing", () => {
  it("reads a single hosted image", () => {
    const result = imagesFromListing(
      listing({
        id: "abc123",
        title: "A bridge",
        author: "ada",
        subreddit: "pics",
        permalink: "/r/pics/comments/abc123/a_bridge/",
        over_18: false,
        score: 12,
        url: "https://i.redd.it/bridge.jpg",
        preview: { images: [{ source: { url: "https://preview.redd.it/bridge.jpg", width: 100, height: 80 } }] },
      }),
    );

    expect(result.title).toBe("A bridge");
    expect(result.permalink).toBe("https://www.reddit.com/r/pics/comments/abc123/a_bridge/");
    expect(result.images).toEqual([
      {
        url: "https://i.redd.it/bridge.jpg",
        width: 100,
        height: 80,
        caption: null,
        trusted: true,
        role: "photo",
      },
    ]);
  });

  it("keeps gallery order and builds original i.redd.it urls", () => {
    const result = imagesFromListing(
      listing({
        id: "gal1",
        title: "Gallery",
        author: "ada",
        subreddit: "pics",
        permalink: "/r/pics/comments/gal1/gallery/",
        is_gallery: true,
        gallery_data: {
          items: [
            { media_id: "secondid", caption: "Second" },
            { media_id: "firstid", caption: "" },
          ],
        },
        media_metadata: {
          firstid: {
            status: "valid",
            e: "Image",
            m: "image/png",
            s: { x: 10, y: 20, u: "https://preview.redd.it/firstid.png" },
          },
          secondid: {
            status: "valid",
            e: "Image",
            m: "image/jpeg",
            s: { x: 30, y: 40, u: "https://preview.redd.it/secondid.jpg" },
          },
          broken: { status: "failed", e: "Image", m: "image/jpeg", s: { u: "https://i.redd.it/nope.jpg" } },
        },
      }),
    );

    expect(result.images.map((image) => image.url)).toEqual([
      "https://i.redd.it/secondid.jpg",
      "https://i.redd.it/firstid.png",
    ]);
    expect(result.images[0]?.caption).toBe("Second");
    expect(result.images[1]?.caption).toBeNull();
  });

  it("uses the crosspost parent when the outer post has no image", () => {
    const result = imagesFromListing(
      listing({
        id: "cross",
        title: "Crosspost",
        author: "ada",
        subreddit: "all",
        permalink: "/r/all/comments/cross/crosspost/",
        url: "https://www.reddit.com/r/pics/comments/abc123/a_bridge/",
        crosspost_parent_list: [
          { url: "https://i.redd.it/from-parent.jpg", title: "Original" },
        ],
      }),
    );

    expect(result.images[0]?.url).toBe("https://i.redd.it/from-parent.jpg");
    expect(result.title).toBe("Crosspost");
  });

  it("returns no images for a text post and keeps a reddit video link", () => {
    const result = imagesFromListing(
      listing({
        id: "vid",
        title: "Clip",
        author: "ada",
        subreddit: "videos",
        permalink: "/r/videos/comments/vid/clip/",
        is_video: true,
        url: "https://v.redd.it/clip",
        secure_media: {
          reddit_video: { fallback_url: "https://v.redd.it/clip/DASH_720.mp4?source=fallback" },
        },
      }),
    );

    expect(result.images).toEqual([]);
    expect(result.videoUrl).toBe("https://v.redd.it/clip/DASH_720.mp4");
  });
});

describe("lookupRedditImages", () => {
  it("loads a post from the public json endpoint", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(
        JSON.stringify(
          listing({
            id: "abc123",
            title: "Loaded",
            author: "ada",
            subreddit: "pics",
            permalink: "/r/pics/comments/abc123/loaded/",
            url: "https://i.redd.it/loaded.jpg",
          }),
        ),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });

    const result = await lookupRedditImages(
      "https://www.reddit.com/r/pics/comments/abc123/loaded/",
      fetchImpl,
    );

    expect(result.images[0]?.url).toBe("https://i.redd.it/loaded.jpg");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://www.reddit.com/r/pics/comments/abc123.json?raw_json=1",
      expect.objectContaining({ redirect: "follow" }),
    );
  });

  it("follows a reddit share link back to the post", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/s/")) {
        return new Response(null, {
          status: 302,
          headers: {
            location: "https://www.reddit.com/r/pics/comments/abc123/loaded/",
          },
        });
      }
      return new Response(
        JSON.stringify(
          listing({
            id: "abc123",
            title: "Loaded",
            author: "ada",
            subreddit: "pics",
            permalink: "/r/pics/comments/abc123/loaded/",
            url: "https://i.imgur.com/loaded.png",
          }),
        ),
        { status: 200 },
      );
    });

    const result = await lookupRedditImages(
      "https://www.reddit.com/r/pics/s/sharecode",
      fetchImpl,
    );
    expect(result.images[0]?.url).toBe("https://i.imgur.com/loaded.png");
  });

  it("explains when Reddit refuses the lookup", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 403 }));
    await expect(
      lookupRedditImages("https://redd.it/abc123", fetchImpl),
    ).rejects.toMatchObject({
      status: 502,
      message: expect.stringMatching(/refused/i),
    });
  });

  it("does not request anything for a non-reddit link", async () => {
    const fetchImpl = vi.fn();
    await expect(
      lookupRedditImages("https://example.com/photo.jpg", fetchImpl),
    ).rejects.toBeInstanceOf(RedditLookupError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("fetchTrustedImage", () => {
  it("rejects hosts outside the reddit and imgur image allowlist", async () => {
    const fetchImpl = vi.fn();
    await expect(
      fetchTrustedImage("https://example.com/secret.jpg", fetchImpl),
    ).rejects.toBeInstanceOf(ImageFetchError);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(isTrustedImageUrl("http://i.redd.it/a.jpg")).toBe(false);
  });

  it("downloads an allowlisted image and stops following off-host redirects", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(null, {
        status: 302,
        headers: { location: "https://example.com/tracker.jpg" },
      });
    });

    await expect(
      fetchTrustedImage("https://i.redd.it/photo.jpg", fetchImpl),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("returns bytes for a jpeg on i.redd.it", async () => {
    const payload = new Uint8Array([1, 2, 3, 4]);
    const fetchImpl = vi.fn(async () => {
      return new Response(payload, {
        status: 200,
        headers: { "content-type": "image/jpeg" },
      });
    });

    const image = await fetchTrustedImage("https://i.redd.it/photo.jpg", fetchImpl);
    expect(Array.from(image.bytes)).toEqual([1, 2, 3, 4]);
    expect(image.filename).toBe("photo.jpg");
    expect(image.contentType).toBe("image/jpeg");
  });
});
