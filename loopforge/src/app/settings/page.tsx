"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Settings = {
  nssmPath: string;
  appsRoot: string;
  simulateMode: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    nssmPath: "nssm",
    appsRoot: "C:\\LoopForge\\apps",
    simulateMode: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const save = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      toast.success("Settings saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      toast.error("Failed to save settings");
    }
  };

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-zinc-400">
          Configure NSSM path and deployment defaults
        </p>
      </div>

      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Windows agent</CardTitle>
          <CardDescription>
            Paths and modes for the LoopForge Windows service wrapper
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>NSSM executable path</Label>
            <Input
              value={settings.nssmPath}
              onChange={(e) =>
                setSettings({ ...settings, nssmPath: e.target.value })
              }
              placeholder="C:\\LoopForge\\bin\\nssm.exe"
            />
          </div>
          <div className="space-y-2">
            <Label>Applications root directory</Label>
            <Input
              value={settings.appsRoot}
              onChange={(e) =>
                setSettings({ ...settings, appsRoot: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div>
              <p className="text-sm font-medium text-white">Simulate mode</p>
              <p className="text-xs text-zinc-500">
                Safe testing without real NSSM (recommended for dev)
              </p>
            </div>
            <Switch
              checked={settings.simulateMode}
              onCheckedChange={(v) =>
                setSettings({ ...settings, simulateMode: v })
              }
            />
          </div>
          <Button onClick={save}>
            {saved ? "Saved!" : "Save settings"}
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
