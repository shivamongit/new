import { AppStatus, type AppStatus as AppStatusType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  AppStatus,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  DEPLOYING: { label: "Deploying", variant: "warning" },
  RUNNING: { label: "Running", variant: "success" },
  STOPPED: { label: "Stopped", variant: "secondary" },
  FAILED: { label: "Failed", variant: "destructive" },
  UNHEALTHY: { label: "Unhealthy", variant: "destructive" },
};

export function StatusBadge({ status }: { status: AppStatusType }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className="gap-1.5">
      {status === "RUNNING" && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      )}
      {status === "DEPLOYING" && (
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      )}
      {config.label}
    </Badge>
  );
}
