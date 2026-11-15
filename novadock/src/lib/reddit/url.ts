const REDDIT_PAGE_HOSTS = new Set([
  "reddit.com",
  "www.reddit.com",
  "old.reddit.com",
  "np.reddit.com",
  "m.reddit.com",
  "new.reddit.com",
]);

const TRUSTED_IMAGE_HOSTS = new Set([
  "i.redd.it",
  "preview.redd.it",
  "external-preview.redd.it",
  "i.imgur.com",
]);

const POST_ID = /^[a-z0-9]{3,12}$/i;
const SUBREDDIT = /^[a-z0-9_]{2,21}$/i;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;

export const REDDIT_USER_AGENT =
  "NovaDock/0.1 (public reddit post image lookup)";

export class RedditUrlError extends Error {
  constructor(
    message: string,
    readonly recoverable: boolean,
  ) {
    super(message);
    this.name = "RedditUrlError";
  }
}

export type ParsedRedditPost =
  | { kind: "permalink"; subreddit: string; id: string }
  | { kind: "id"; id: string };

export function isRedditPageHost(host: string): boolean {
  return REDDIT_PAGE_HOSTS.has(host.toLowerCase());
}

export function isTrustedImageUrl(raw: string): boolean {
  const url = parseHttpUrl(raw);
  if (!url) return false;
  return TRUSTED_IMAGE_HOSTS.has(url.hostname.toLowerCase());
}

export function isDirectImageUrl(raw: string): boolean {
  const url = parseHttpUrl(raw);
  if (!url) return false;
  if (TRUSTED_IMAGE_HOSTS.has(url.hostname.toLowerCase())) return true;
  return IMAGE_EXT.test(url.pathname);
}

export function parseRedditPostUrl(input: string): ParsedRedditPost {
  const url = parseInputUrl(input);
  const host = url.hostname.toLowerCase();

  if (host === "redd.it" || host === "www.redd.it") {
    const id = firstSegment(url.pathname);
    if (!POST_ID.test(id)) {
      throw new RedditUrlError(
        "That short link does not look like a Reddit post.",
        false,
      );
    }
    return { kind: "id", id };
  }

  if (!REDDIT_PAGE_HOSTS.has(host)) {
    throw new RedditUrlError("Only reddit.com post links are supported.", false);
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "r" && parts[2] === "comments" && parts[3]) {
    const subreddit = parts[1] ?? "";
    const id = parts[3];
    if (!SUBREDDIT.test(subreddit) || !POST_ID.test(id)) {
      throw new RedditUrlError(
        "That link does not look like a Reddit post.",
        false,
      );
    }
    return { kind: "permalink", subreddit, id };
  }

  if (parts[0] === "gallery" && parts[1] && POST_ID.test(parts[1])) {
    return { kind: "id", id: parts[1] };
  }

  if (parts[0] === "comments" && parts[1] && POST_ID.test(parts[1])) {
    return { kind: "id", id: parts[1] };
  }

  throw new RedditUrlError(
    "Paste a link to a single Reddit post, not a feed or profile.",
    true,
  );
}

export function redditJsonEndpoint(parsed: ParsedRedditPost): string {
  const path =
    parsed.kind === "permalink"
      ? `/r/${encodeURIComponent(parsed.subreddit)}/comments/${parsed.id}.json`
      : `/comments/${parsed.id}.json`;
  return `https://www.reddit.com${path}?raw_json=1`;
}

export async function resolveRedditPostUrl(
  input: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ParsedRedditPost> {
  try {
    return parseRedditPostUrl(input);
  } catch (error) {
    if (!(error instanceof RedditUrlError) || !error.recoverable) throw error;
    const landed = await followRedditRedirects(input, fetchImpl);
    return parseRedditPostUrl(landed);
  }
}

async function followRedditRedirects(
  input: string,
  fetchImpl: typeof fetch,
): Promise<string> {
  let current = parseInputUrl(input);
  if (!isRedditPageHost(current.hostname) && current.hostname !== "redd.it") {
    throw new RedditUrlError("Only reddit.com post links are supported.", false);
  }

  for (let hop = 0; hop < 5; hop++) {
    const response = await fetchImpl(current.toString(), {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": REDDIT_USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    });
    await response.body?.cancel();

    if (response.status < 300 || response.status >= 400) {
      break;
    }

    const location = response.headers.get("location");
    if (!location) break;
    const next = new URL(location, current);
    if (next.protocol !== "https:" && next.protocol !== "http:") {
      throw new RedditUrlError("Reddit redirected to an unsupported link.", false);
    }
    const host = next.hostname.toLowerCase();
    if (!isRedditPageHost(host) && host !== "redd.it" && host !== "www.redd.it") {
      throw new RedditUrlError("Reddit redirected away from Reddit.", false);
    }
    current = next;
    try {
      parseRedditPostUrl(current.toString());
      return current.toString();
    } catch (error) {
      if (!(error instanceof RedditUrlError)) throw error;
      if (!error.recoverable) throw error;
    }
  }

  throw new RedditUrlError(
    "That Reddit link did not resolve to a single post.",
    false,
  );
}

function parseInputUrl(input: string): URL {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new RedditUrlError("Enter a Reddit post link.", false);
  }
  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    throw new RedditUrlError("Enter a valid Reddit post link.", false);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new RedditUrlError("Enter a valid Reddit post link.", false);
  }
  if (url.username || url.password) {
    throw new RedditUrlError("Enter a valid Reddit post link.", false);
  }
  return url;
}

function parseHttpUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function firstSegment(pathname: string): string {
  return pathname.split("/").filter(Boolean)[0] ?? "";
}
