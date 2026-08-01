import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus, ArrowUpRight, Server, CheckCircle2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardStats, listApplications } from "@/lib/apps-service";
import type { AppStatus } from "@/lib/types";

export default async function DashboardPage() {
  const [stats, apps] = await Promise.all([
    getDashboardStats(),
    listApplications(),
  ]);

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-zinc-400">
            One-click POC deployments with loop-engineered NSSM services
          </p>
        </div>
        <Button asChild>
          <Link href="/apps/new">
            <Plus className="h-4 w-4" />
            Deploy application
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total applications"
          value={stats.total}
          icon={<Server className="h-4 w-4 text-violet-400" />}
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

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applications</CardTitle>
          <span className="text-xs text-zinc-500">{apps.length} total</span>
        </CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
                <Server className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">
                No applications yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-zinc-400">
                Deploy your first POC in one click. LoopForge registers an NSSM
                service, starts it, and verifies health automatically.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/apps/new">Deploy your first app</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {apps.map((app) => (
                <Link
                  key={app.id}
                  href={`/apps/${app.id}`}
                  className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-4 transition-all hover:border-white/10 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 text-xs font-bold text-violet-300">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-violet-200 transition-colors">
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
                    <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
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
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">{label}</p>
          {icon}
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
