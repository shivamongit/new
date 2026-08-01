import { NextResponse } from "next/server";
import { listApplications, createApplication } from "@/lib/apps-service";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().optional(),
  template: z.string().default("custom"),
  workDir: z.string().min(1),
  command: z.string().min(1),
  arguments: z.string().optional(),
  port: z.number().int().min(1).max(65535),
  healthUrl: z.string().optional(),
  envVars: z.record(z.string(), z.string()).optional(),
});

export async function GET() {
  const apps = await listApplications();
  return NextResponse.json(apps);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const app = await createApplication(data);
    return NextResponse.json(app, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
