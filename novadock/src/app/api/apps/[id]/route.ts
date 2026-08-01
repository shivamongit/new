import { NextResponse } from "next/server";
import {
  getApplication,
  deleteApplication,
} from "@/lib/apps-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(app);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deleteApplication(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
