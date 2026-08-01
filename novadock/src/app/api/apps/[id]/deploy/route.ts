import { NextResponse } from "next/server";
import { deployApplication } from "@/lib/apps-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const result = await deployApplication(id);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Deploy failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
