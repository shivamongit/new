"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AppStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, Square, Trash2 } from "lucide-react";

export function AppActions({
  appId,
  status,
}: {
  appId: string;
  status: AppStatus;
}) {
  const router = useRouter();

  const redeploy = async () => {
    toast.loading("Running deployment orchestration...");
    const res = await fetch(`/api/apps/${appId}/deploy`, { method: "POST" });
    toast.dismiss();
    if (res.ok) {
      toast.success("Redeploy complete");
      router.refresh();
    } else {
      toast.error("Redeploy failed");
    }
  };

  const stop = async () => {
    const res = await fetch(`/api/apps/${appId}/stop`, { method: "POST" });
    if (res.ok) {
      toast.success("Service stopped");
      router.refresh();
    } else {
      toast.error("Stop failed");
    }
  };

  const deleteApp = async () => {
    if (!confirm("Remove this application and its Windows service?")) return;
    const res = await fetch(`/api/apps/${appId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Application removed");
      router.push("/");
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={redeploy}>
        <RefreshCw className="h-4 w-4" />
        Redeploy
      </Button>
      {status === "RUNNING" && (
        <Button variant="outline" size="sm" onClick={stop}>
          <Square className="h-4 w-4" />
          Stop
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={deleteApp}>
        <Trash2 className="h-4 w-4" />
        Remove
      </Button>
    </div>
  );
}
