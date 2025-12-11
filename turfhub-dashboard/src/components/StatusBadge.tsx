import { cn } from "@/lib/utils";

type Status = "active" | "expired" | "booked" | "blocked" | "available" | "maintenance" | "success" | "failed" | "pending";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  active: "bg-internal/10 text-internal border-internal/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  booked: "bg-primary/10 text-primary border-primary/20",
  blocked: "bg-muted text-muted-foreground border-muted-foreground/20",
  available: "bg-internal/10 text-internal border-internal/20",
  maintenance: "bg-playo/10 text-playo border-playo/20",
  success: "bg-internal/10 text-internal border-internal/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-playo/10 text-playo border-playo/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
