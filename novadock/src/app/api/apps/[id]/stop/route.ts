import { NextResponse } from "next/server";
import { stopApplication } from "@/lib/apps-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await stopApplication(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stop failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
