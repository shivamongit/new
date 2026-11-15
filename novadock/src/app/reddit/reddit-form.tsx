"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/stitch/material-icon";
import type { RedditImage, RedditPostImages } from "@/lib/reddit/extract";

export function RedditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<RedditPostImages | null>(null);
  const [revealed, setRevealed] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a Reddit post link.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reddit/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await response.json()) as RedditPostImages & { error?: string };
      if (!response.ok) {
        const message = data.error || "Could not look up that post.";
        setError(message);
        setPost(null);
        toast.error(message);
        return;
      }
      setPost(data);
      setRevealed(!data.nsfw);
    } catch {
      const message = "Could not look up that post.";
      setError(message);
      setPost(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="glass-card rounded-xl p-6">
        <label htmlFor="reddit-url" className="mb-2 block text-sm font-medium text-white">
          Reddit post link
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="reddit-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.reddit.com/r/pics/comments/..."
            className="input-dark w-full rounded-xl px-4 py-3 text-sm"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading}
            className="cyan-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#00f5ff] px-6 py-3 font-bold text-[#006c71] transition-all hover:translate-y-[-1px] disabled:cursor-wait disabled:opacity-70"
          >
            <MaterialIcon name={loading ? "progress_activity" : "image_search"} />
            {loading ? "Looking up" : "Get images"}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#b9caca]">
          Paste a link to one public post. Galleries, single images, and share links
          on reddit.com are supported.
        </p>
        {error && (
          <p className="mt-3 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
      </form>

      {post && (
        <section className="glass-card rounded-xl p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#00dce5]">
                r/{post.subreddit} · u/{post.author}
              </p>
              <h2
                className="mt-2 text-2xl font-medium text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-[#b9caca]">
                {post.images.length === 0
                  ? "No images on this post."
                  : `${post.images.length} image${post.images.length === 1 ? "" : "s"}`}
                {post.nsfw ? " · marked NSFW" : ""}
              </p>
            </div>
            <a
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              <MaterialIcon name="open_in_new" className="text-base" />
              Open post
            </a>
          </div>

          {post.nsfw && !revealed && post.images.length > 0 && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Show NSFW images
            </button>
          )}

          {post.videoUrl && (
            <a
              href={post.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-4 flex items-center gap-2 text-sm text-[#00dce5] hover:underline"
            >
              <MaterialIcon name="play_circle" className="text-base" />
              This post includes a video
            </a>
          )}

          {post.images.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {post.images.map((image) => (
                <ImageCard
                  key={image.url}
                  image={image}
                  hidden={post.nsfw && !revealed}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ImageCard({ image, hidden }: { image: RedditImage; hidden: boolean }) {
  const downloadHref = image.trusted
    ? `/api/reddit/images/file?src=${encodeURIComponent(image.url)}`
    : null;

  return (
    <figure className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <div className={`relative aspect-[4/3] bg-black/40 ${hidden ? "blur-xl" : ""}`}>
        {/* Reddit image hosts do not send the dimensions Next/Image wants for remote patterns. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hidden ? undefined : image.url}
          alt={image.caption || "Image from the Reddit post"}
          className="h-full w-full object-contain"
        />
      </div>
      <figcaption className="flex flex-col gap-3 p-3">
        {image.caption && <p className="text-sm text-white">{image.caption}</p>}
        <div className="flex flex-wrap gap-2">
          <a
            href={image.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/10"
          >
            Open original
          </a>
          {downloadHref && (
            <a
              href={downloadHref}
              className="rounded-lg bg-[#00f5ff]/15 px-3 py-1.5 text-xs font-medium text-[#00dce5] hover:bg-[#00f5ff]/25"
            >
              Download
            </a>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
