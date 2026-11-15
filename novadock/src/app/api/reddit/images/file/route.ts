import { NextResponse } from "next/server";
import { fetchTrustedImage, ImageFetchError } from "@/lib/reddit/image-file";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src") ?? "";
  try {
    const image = await fetchTrustedImage(src);
    return new NextResponse(Buffer.from(image.bytes), {
      headers: {
        "Content-Type": image.contentType,
        "Content-Disposition": `attachment; filename="${image.filename}"`,
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof ImageFetchError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not download that image." }, { status: 500 });
  }
}
