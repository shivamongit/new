import { imagesFromListing, type RedditPostImages } from "./extract";
import {
  REDDIT_USER_AGENT,
  isRedditPageHost,
  redditJsonEndpoint,
  resolveRedditPostUrl,
} from "./url";

export class RedditLookupError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RedditLookupError";
    this.status = status;
  }
}

export async function lookupRedditImages(
  input: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RedditPostImages> {
  let endpoint: string;
  try {
    const parsed = await resolveRedditPostUrl(input, fetchImpl);
    endpoint = redditJsonEndpoint(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Enter a Reddit post link.";
    throw new RedditLookupError(message, 400);
  }

  let response: Response;
  try {
    response = await fetchImpl(endpoint, {
      headers: {
        "User-Agent": REDDIT_USER_AGENT,
        Accept: "application/json",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new RedditLookupError("Could not reach Reddit.", 502);
  }

  if (response.url) {
    try {
      const host = new URL(response.url).hostname;
      if (!isRedditPageHost(host)) {
        throw new RedditLookupError("Reddit lookup was redirected off Reddit.", 502);
      }
    } catch (error) {
      if (error instanceof RedditLookupError) throw error;
    }
  }

  if (response.status === 404) {
    throw new RedditLookupError("Reddit could not find that post.", 404);
  }
  if (response.status === 403 || response.status === 429) {
    throw new RedditLookupError(
      "Reddit refused this lookup. Wait a moment and try the post link again.",
      502,
    );
  }
  if (!response.ok) {
    throw new RedditLookupError("Reddit did not return that post.", 502);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new RedditLookupError("Reddit returned an unexpected response.", 502);
  }

  try {
    return imagesFromListing(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reddit returned an unexpected response.";
    throw new RedditLookupError(message, 502);
  }
}
