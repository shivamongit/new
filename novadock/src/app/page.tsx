import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus, ArrowUpRight, Server, CheckCircle2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardStats, listApplications } from "@/lib/apps-service";
import type { AppStatus } from "@/lib/types";
import { DeployHeroGraphic } from "@/components/graphics/deploy-hero";
import { EmptyStateGraphic } from "@/components/graphics/deploy-hero";
import { DashboardMotion } from "./dashboard-motion";

export default async function DashboardPage() {
  const [stats, apps] = await Promise.all([
    getDashboardStats(),
    listApplications(),
  ]);

  return (
    <AppShell>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <DashboardMotion>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              Windows POC platform
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Your POCs,{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                live in seconds
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-zinc-400 leading-relaxed">
              NovaDock turns POC folders into self-healing Windows services with
              one click — NSSM, health checks, and loop-engineered deploys.
            </p>
            <Button className="mt-6 shadow-lg shadow-cyan-500/20" asChild>
              <Link href="/apps/new">
                <Plus className="h-4 w-4" />
                Deploy application
              </Link>
            </Button>
          </DashboardMotion>
        </div>
        <div className="hidden lg:block lg:w-[380px] opacity-90">
          <DeployHeroGraphic />
        </div>
      </div>

      <DashboardMotion delay={0.15}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total applications"
            value={stats.total}
            icon={<Server className="h-4 w-4 text-cyan-400" />}
          />
          <StatCard
            label="Running"
            value={stats.running}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            accent="emerald"
          />
          <StatCard
            label="Deploying"
            value={stats.deploying}
            icon={<ArrowUpRight className="h-4 w-4 text-amber-400" />}
            accent="amber"
          />
          <StatCard
            label="Failed"
            value={stats.failed}
            icon={<AlertCircle className="h-4 w-4 text-red-400" />}
            accent="red"
          />
        </div>
      </DashboardMotion>

      <Card className="mt-8 border-cyan-500/10 bg-white/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applications</CardTitle>
          <span className="text-xs text-zinc-500">{apps.length} total</span>
        </CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <EmptyStateGraphic />
              <h3 className="mt-6 text-lg font-medium text-white">
                No applications yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-zinc-400">
                Deploy your first POC in one click. NovaDock registers NSSM,
                starts the service, and verifies health automatically.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/apps/new">Deploy your first app</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {apps.map((app, i) => (
                <Link
                  key={app.id}
                  href={`/apps/${app.id}`}
                  className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-4 transition-all hover:border-cyan-500/20 hover:bg-cyan-500/[0.04]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-white/10 text-xs font-bold text-cyan-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10 transition-shadow">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-cyan-200 transition-colors">
                        {app.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Port {app.port} · {app.template} ·{" "}
                        {formatDistanceToNow(app.updatedAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={app.status as AppStatus} />
                    <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="overflow-hidden border-white/[0.06] hover:border-cyan-500/20 transition-colors group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">{label}</p>
          <div className="group-hover:scale-110 transition-transform">{icon}</div>
        </div>
        <p
          className={`mt-3 text-3xl font-semibold tracking-tight ${
            accent === "emerald"
              ? "text-emerald-400"
              : accent === "amber"
                ? "text-amber-400"
                : accent === "red"
                  ? "text-red-400"
                  : "text-white"
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
