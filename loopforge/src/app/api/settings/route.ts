import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  nssmPath: z.string(),
  appsRoot: z.string(),
  simulateMode: z.boolean(),
});

export async function GET() {
  let settings = await prisma.settings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const body = settingsSchema.parse(await request.json());
    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      create: { id: "default", ...body },
      update: body,
    });
    return NextResponse.json(settings);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
