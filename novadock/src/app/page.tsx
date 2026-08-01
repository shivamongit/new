import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { StitchAppShell } from "@/components/stitch/app-shell";
import { OrbitalGraphic } from "@/components/stitch/orbital-graphic";
import { MaterialIcon } from "@/components/stitch/material-icon";
import { getDashboardStats, listApplications } from "@/lib/apps-service";
import type { AppStatus } from "@/lib/types";

export default async function DashboardPage() {
  const [stats, apps] = await Promise.all([
    getDashboardStats(),
    listApplications(),
  ]);

  return (
    <StitchAppShell>
      <section className="mb-10 grid min-h-[320px] grid-cols-12 items-center gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f5ff]/20 bg-[#00f5ff]/10 px-3 py-1 text-xs font-medium text-[#00dce5]">
            <span className="pulse-running h-2 w-2 rounded-full bg-[#00f5ff]" />
            Windows application platform
          </div>
          <h1
            className="mb-6 bg-gradient-to-r from-[#00f5ff] via-[#571bc1] to-[#d0bcff] bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Ship applications with deployment confidence.
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[#b9caca]">
            NovaDock orchestrates Windows service deployments with health
            verification, bounded retries, and full operational history—so
            your team always knows what is running and why.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/apps/new"
              className="cyan-glow rounded-xl bg-[#00f5ff] px-8 py-3.5 font-bold text-[#006c71] transition-all hover:translate-y-[-2px]"
            >
              Deploy application
            </Link>
            <a
              href="https://github.com/shivamongit/novadock/blob/main/docs/README.md"
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-bold backdrop-blur-md transition-all hover:bg-white/10"
            >
              Documentation
            </a>
          </div>
        </div>
        <div className="relative col-span-12 min-h-[320px] lg:col-span-5">
          <OrbitalGraphic />
        </div>
      </section>

      <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        <KpiCard label="Total applications" value={stats.total} icon="apps" />
        <KpiCard
          label="Running"
          value={stats.running}
          tone="green"
          badge="HEALTHY"
        />
        <KpiCard
          label="Deploying"
          value={stats.deploying}
          tone="amber"
          badge="IN PROGRESS"
          pulse
        />
        <KpiCard
          label="Failed"
          value={stats.failed}
          tone="red"
          badge="ATTENTION"
        />
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2
            className="text-xl font-medium text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Application registry
          </h2>
          <span className="text-xs text-[#b9caca]">{apps.length} registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                {["Application", "Status", "Port", "Last updated", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#b9caca]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {apps.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-[#b9caca]"
                  >
                    No applications registered yet.{" "}
                    <Link
                      href="/apps/new"
                      className="text-[#00dce5] hover:underline"
                    >
                      Deploy your first application
                    </Link>
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr
                    key={app.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-5">
                      <Link
                        href={`/apps/${app.id}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-sm font-bold text-[#63f7ff]"
                        >
                          {app.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white transition-colors group-hover:text-[#00dce5]">
                            {app.name}
                          </div>
                          <div className="font-mono text-xs text-[#b9caca]">
                            {app.template} · {app.slug}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <StatusRow status={app.status as AppStatus} />
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-[#b9caca]">
                      {app.port}
                    </td>
                    <td className="px-6 py-5 text-sm text-[#b9caca]">
                      {formatDistanceToNow(app.updatedAt, {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/apps/${app.id}`}>
                        <MaterialIcon
                          name="arrow_forward"
                          className="text-[#b9caca] transition-colors group-hover:text-white"
                        />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StitchAppShell>
  );
}

function KpiCard({
  label,
  value,
  icon,
  tone,
  badge,
  pulse,
}: {
  label: string;
  value: number;
  icon?: string;
  tone?: "green" | "amber" | "red";
  badge?: string;
  pulse?: boolean;
}) {
  const dot =
    tone === "green"
      ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
      : tone === "amber"
        ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]"
        : tone === "red"
          ? "bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.5)]"
          : "";

  return (
    <div className="glass-card group relative overflow-hidden rounded-2xl p-4">
      {tone && (
        <div
          className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${
            tone === "green"
              ? "bg-green-500/5"
              : tone === "amber"
                ? "bg-amber-500/5"
                : "bg-red-500/5"
          }`}
        />
      )}
      <div className="mb-2 flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[#b9caca]">
          {label}
        </span>
        {icon ? (
          <MaterialIcon name={icon} className="text-[#b9caca]" />
        ) : dot ? (
          <span className={`h-2 w-2 rounded-full ${dot}`} />
        ) : null}
      </div>
      <div
        className="text-[32px] font-semibold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {value}
      </div>
      {badge && (
        <div
          className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
            tone === "green"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : tone === "amber"
                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                : "border-red-500/20 bg-red-500/10 text-[#ffb4ab]"
          }`}
        >
          {pulse && (
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          )}
          {badge}
        </div>
      )}
    </div>
  );
}

function StatusRow({ status }: { status: AppStatus }) {
  const map: Record<
    AppStatus,
    { label: string; dot: string; pulse?: boolean }
  > = {
    RUNNING: {
      label: "Running",
      dot: "bg-green-400 pulse-running",
    },
    DEPLOYING: {
      label: "Deploying",
      dot: "bg-amber-400 animate-pulse",
    },
    FAILED: { label: "Failed", dot: "bg-[#ffb4ab]" },
    STOPPED: { label: "Stopped", dot: "bg-[#849495]" },
    PENDING: { label: "Pending", dot: "bg-[#849495]" },
    UNHEALTHY: { label: "Unhealthy", dot: "bg-[#ffb4ab]" },
  };
  const s = map[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span className="text-sm font-medium">{s.label}</span>
    </div>
  );
}
