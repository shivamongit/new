"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StitchAppShell } from "@/components/stitch/app-shell";
import { MaterialIcon } from "@/components/stitch/material-icon";
import { APP_TEMPLATES } from "@/lib/templates";

export default function NewAppPage() {
  const router = useRouter();
  const [template, setTemplate] = useState("node");
  const [deploying, setDeploying] = useState(false);
  const [form, setForm] = useState({
    name: "",
    workDir: "C:\\NovaDock\\apps\\my-poc",
    command: "npm",
    arguments: "start",
    port: 3000,
    healthUrl: "",
  });

  const applyTemplate = (id: string) => {
    const t = APP_TEMPLATES.find((x) => x.id === id)!;
    setTemplate(id);
    setForm((f) => ({
      ...f,
      command: t.command,
      arguments: t.arguments.replace("{port}", String(t.port)),
      port: t.port,
      healthUrl: `http://127.0.0.1:${t.port}${t.healthPath}`,
    }));
  };

  const deploy = async () => {
    if (!form.name.trim()) {
      toast.error("Application name is required");
      return;
    }
    setDeploying(true);
    try {
      const createRes = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          template,
          port: Number(form.port),
          healthUrl:
            form.healthUrl || `http://127.0.0.1:${form.port}/`,
        }),
      });
      if (!createRes.ok) throw new Error("Failed to create app");
      const app = await createRes.json();
      const deployRes = await fetch(`/api/apps/${app.id}/deploy`, {
        method: "POST",
      });
      if (!deployRes.ok) throw new Error("Deploy failed");
      const result = await deployRes.json();
      toast.success(
        result.success ? "Deployed successfully" : "Deploy completed with issues",
      );
      router.push(`/apps/${app.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Deploy failed");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <StitchAppShell>
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Deploy application
        </h1>
        <p className="mt-2 text-[#b9caca]">
          One click — loop engineering handles install, NSSM, start, and health
          verification.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <section className="glass-card rounded-xl p-6">
            <div className="mb-6 flex items-center gap-3">
              <MaterialIcon name="widgets" className="text-[#00f5ff]" />
              <h3
                className="text-xl font-medium text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Choose template
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {APP_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t.id)}
                  className={`template-card glass-card flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl p-4 transition-all ${
                    template === t.id ? "selected border-[#00f5ff]/50" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f5ff]/20 bg-[#00f5ff]/10 transition-transform group-hover:scale-110">
                    <MaterialIcon name="terminal" className="text-[#00dce5]" />
                  </div>
                  <span className="text-sm font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-xl p-6">
            <div className="mb-6 flex items-center gap-3">
              <MaterialIcon name="description" className="text-[#00f5ff]" />
              <h3
                className="text-xl font-medium text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Application details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Application name">
                <input
                  className="input-dark w-full rounded px-4 py-2.5 text-sm"
                  placeholder="Customer POC Dashboard"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </Field>
              <Field label="Target port">
                <input
                  type="number"
                  className="input-dark w-full rounded px-4 py-2.5 text-sm"
                  value={form.port}
                  onChange={(e) =>
                    setForm({ ...form, port: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Working directory" className="md:col-span-2">
                <input
                  className="input-dark w-full rounded px-4 py-2.5 text-sm font-mono"
                  value={form.workDir}
                  onChange={(e) =>
                    setForm({ ...form, workDir: e.target.value })
                  }
                />
              </Field>
              <Field label="Executable">
                <input
                  className="input-dark w-full rounded px-4 py-2.5 text-sm"
                  value={form.command}
                  onChange={(e) =>
                    setForm({ ...form, command: e.target.value })
                  }
                />
              </Field>
              <Field label="Startup arguments">
                <input
                  className="input-dark w-full rounded px-4 py-2.5 text-sm"
                  value={form.arguments}
                  onChange={(e) =>
                    setForm({ ...form, arguments: e.target.value })
                  }
                />
              </Field>
              <Field label="Health check URL" className="md:col-span-2">
                <input
                  className="input-dark w-full rounded px-4 py-2.5 text-sm font-mono"
                  placeholder="http://127.0.0.1:3000/"
                  value={form.healthUrl}
                  onChange={(e) =>
                    setForm({ ...form, healthUrl: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={deploying}
                onClick={deploy}
                className="rounded-lg bg-gradient-to-r from-[#00f5ff] to-[#00a8ff] px-10 py-3 text-lg font-bold text-[#003739] shadow-[0_0_30px_-5px_rgba(0,245,255,0.4)] transition-all hover:shadow-[0_0_40px_-5px_rgba(0,245,255,0.6)] active:scale-95 disabled:opacity-60"
              >
                {deploying ? "Deploying…" : "Review & deploy"}
              </button>
            </div>
          </section>
        </div>

        <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
          <div className="glass-card relative overflow-hidden rounded-xl p-6">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00f5ff]/10 opacity-50 blur-[80px]" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MaterialIcon name="sync" className="text-[#00f5ff]" />
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#00f5ff]">
                  NSSM verification loop
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-[#e5e1e7]">
                NovaDock uses a{" "}
                <span className="font-medium text-[#00f5ff]">
                  Deploy → Verify → Retry
                </span>{" "}
                loop until your POC is healthy on Windows.
              </p>
              <div className="flex items-center justify-center gap-3 rounded-lg border border-white/5 bg-[#0e0e12]/50 py-6">
                {["upload", "rule", "published_with_changes"].map((icon, i) => (
                  <div key={icon} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#00f5ff]/30 bg-[#1f1f23]">
                      <MaterialIcon name={icon} className="text-[#00dce5]" />
                    </div>
                    {i < 2 && <div className="h-px w-6 bg-white/20" />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#b9caca]">
                Design generated via Google Stitch · project 1486094693945406754
              </p>
            </div>
          </div>
        </div>
      </div>
    </StitchAppShell>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label className="ml-1 text-xs font-medium text-[#b9caca]">{label}</label>
      {children}
    </div>
  );
}
