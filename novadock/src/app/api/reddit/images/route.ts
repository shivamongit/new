import { NextResponse } from "next/server";
import { z } from "zod";
import { lookupRedditImages, RedditLookupError } from "@/lib/reddit/load";

const bodySchema = z.object({
  url: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a Reddit post link." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a Reddit post link." }, { status: 400 });
  }

  try {
    const post = await lookupRedditImages(parsed.data.url);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof RedditLookupError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not look up that post." }, { status: 500 });
  }
}
