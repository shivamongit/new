import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { StitchAppShell } from "@/components/stitch/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { getApplication } from "@/lib/apps-service";
import { AppActions } from "./app-actions";
import type { AppStatus } from "@/lib/types";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) notFound();

  const latestRun = app.deployRuns[0];
  const healthUrl =
    app.healthUrl ?? `http://127.0.0.1:${app.port}/`;

  return (
    <StitchAppShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 border border-white/10 text-lg font-bold text-violet-200">
              {app.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {app.name}
              </h1>
              <p className="text-zinc-400">{app.description ?? app.slug}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={app.status as AppStatus} />
          <AppActions appId={app.id} status={app.status as AppStatus} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                <InfoItem label="Windows service" value={app.serviceName} mono />
                <InfoItem label="Template" value={app.template} />
                <InfoItem label="Port" value={String(app.port)} />
                <InfoItem label="PID" value={app.pid ? String(app.pid) : "—"} />
                <InfoItem label="Executable" value={app.command} mono />
                <InfoItem label="Arguments" value={app.arguments ?? "—"} mono />
                <InfoItem label="Working dir" value={app.workDir} mono className="sm:col-span-2" />
                <InfoItem label="Health URL" value={healthUrl} mono className="sm:col-span-2" />
              </dl>
              {app.status === "RUNNING" && (
                <Button variant="outline" className="mt-6" asChild>
                  <a href={healthUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open application
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deploy logs</CardTitle>
            </CardHeader>
            <CardContent>
              {latestRun?.logs ? (
                <pre className="max-h-80 overflow-auto rounded-lg bg-black/40 border border-white/10 p-4 text-xs font-mono text-zinc-300 leading-relaxed">
                  {latestRun.logs}
                </pre>
              ) : (
                <p className="text-sm text-zinc-500">No deploy logs yet.</p>
              )}
              {app.lastError && (
                <p className="mt-4 text-sm text-red-400">
                  Failure reason: {app.lastError}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deploy history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {app.deployRuns.length === 0 ? (
                <p className="text-sm text-zinc-500">No deploys yet</p>
              ) : (
                app.deployRuns.map((run) => (
                  <div
                    key={run.id}
                    className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className={run.success ? "text-emerald-400" : "text-red-400"}>
                        {run.success ? "Success" : "Failed"}
                      </span>
                      <span className="text-zinc-500">
                        {format(run.startedAt, "MMM d, HH:mm")}
                      </span>
                    </div>
                    <p className="mt-1 text-zinc-500">Phase: {run.phase}</p>
                    {run.haltReason && (
                      <p className="mt-1 text-red-400/80">{run.haltReason}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StitchAppShell>
  );
}

function InfoItem({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-zinc-500">{label}</dt>
      <dd className={`mt-1 text-zinc-200 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
