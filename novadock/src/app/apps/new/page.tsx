"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { APP_TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Rocket, CheckCircle2 } from "lucide-react";

const PHASES = ["Install", "Register", "Start", "Health check", "Complete"];

export default function NewAppPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const [deployPhase, setDeployPhase] = useState(0);
  const [template, setTemplate] = useState("node");
  const [form, setForm] = useState({
    name: "",
    description: "",
    workDir: "C:\\NovaDock\\apps\\my-poc",
    command: "npm",
    arguments: "start",
    port: 3000,
    healthUrl: "",
  });

  const selectedTemplate = APP_TEMPLATES.find((t) => t.id === template)!;

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

  const handleDeploy = async () => {
    if (!form.name.trim()) {
      toast.error("Application name is required");
      return;
    }
    setDeploying(true);
    setDeployPhase(0);

    const phaseInterval = setInterval(() => {
      setDeployPhase((p) => Math.min(p + 1, PHASES.length - 1));
    }, 700);

    try {
      const createRes = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          template,
          port: Number(form.port),
          healthUrl: form.healthUrl || `http://127.0.0.1:${form.port}/`,
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error ?? "Failed to create app");
      }
      const app = await createRes.json();

      const deployRes = await fetch(`/api/apps/${app.id}/deploy`, {
        method: "POST",
      });
      if (!deployRes.ok) {
        throw new Error("Deploy failed");
      }
      const result = await deployRes.json();

      clearInterval(phaseInterval);
      setDeployPhase(PHASES.length - 1);

      if (result.success) {
        toast.success("Application deployed successfully");
        setTimeout(() => router.push(`/apps/${app.id}`), 800);
      } else {
        toast.error("Deploy loop halted — check logs on detail page");
        router.push(`/apps/${app.id}`);
      }
    } catch (e) {
      clearInterval(phaseInterval);
      toast.error(e instanceof Error ? e.message : "Deploy failed");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Deploy application
        </h1>
        <p className="mt-1 text-zinc-400">
          One click — loop engineering handles install, NSSM, start, and health
          verification
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose template</CardTitle>
              <CardDescription>
                Pre-configured stacks for common POC patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {APP_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      template === t.id
                        ? "border-violet-500/50 bg-violet-500/10 ring-1 ring-violet-500/30"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20",
                    )}
                  >
                    <p className="font-medium text-white">{t.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{t.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Application details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Customer POC Dashboard"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={form.port}
                      onChange={(e) =>
                        setForm({ ...form, port: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workDir">Working directory</Label>
                  <Input
                    id="workDir"
                    value={form.workDir}
                    onChange={(e) =>
                      setForm({ ...form, workDir: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="command">Executable</Label>
                    <Input
                      id="command"
                      value={form.command}
                      onChange={(e) =>
                        setForm({ ...form, command: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="args">Arguments</Label>
                    <Input
                      id="args"
                      value={form.arguments}
                      onChange={(e) =>
                        setForm({ ...form, arguments: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health">Health check URL</Label>
                  <Input
                    id="health"
                    placeholder="http://127.0.0.1:3000/"
                    value={form.healthUrl}
                    onChange={(e) =>
                      setForm({ ...form, healthUrl: e.target.value })
                    }
                  />
                </div>
                <Button onClick={() => setStep(1)} className="w-full sm:w-auto">
                  Review deployment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 1 && !deploying && (
            <Card>
              <CardHeader>
                <CardTitle>Review & deploy</CardTitle>
                <CardDescription>
                  NovaDock will run the bounded deploy loop with up to 3 attempts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="space-y-3 text-sm">
                  <ReviewRow label="Name" value={form.name} />
                  <ReviewRow label="Template" value={selectedTemplate.name} />
                  <ReviewRow label="Service" value={`NovaDock-${form.name.toLowerCase().replace(/\s+/g, "-")}`} />
                  <ReviewRow label="Command" value={`${form.command} ${form.arguments}`} />
                  <ReviewRow label="Port" value={String(form.port)} />
                  <ReviewRow label="Path" value={form.workDir} />
                </dl>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button onClick={handleDeploy}>
                    <Rocket className="h-4 w-4" />
                    Deploy now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {deploying && (
            <Card className="border-violet-500/20">
              <CardHeader>
                <CardTitle>Deploy loop running</CardTitle>
                <CardDescription>
                  Observe → verify → retry until healthy or halt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={(deployPhase / (PHASES.length - 1)) * 100} />
                <div className="space-y-2">
                  {PHASES.map((phase, i) => (
                    <div
                      key={phase}
                      className={cn(
                        "flex items-center gap-3 text-sm",
                        i <= deployPhase ? "text-zinc-200" : "text-zinc-600",
                      )}
                    >
                      {i < deployPhase ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : i === deployPhase ? (
                        <span className="h-4 w-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-zinc-700" />
                      )}
                      {phase}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-violet-500/10 bg-violet-500/[0.04]">
          <CardHeader>
            <CardTitle className="text-violet-200">Loop engineering</CardTitle>
            <CardDescription>
              How this deploy converges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-400">
            <p>
              Each deploy is a <strong className="text-zinc-300">bounded loop</strong>:
              install dependencies, register NSSM service, start process, verify health.
            </p>
            <p>
              Failures trigger automatic retry (max 3 attempts). Every step is logged
              with halt reasons for auditability.
            </p>
            <p className="text-xs text-zinc-500 border-t border-white/10 pt-4">
              On Windows: uses real NSSM commands. In dev/demo mode: simulated executor
              for safe testing.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-mono text-xs text-zinc-300">{value}</dd>
    </div>
  );
}
