import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/validations/event";

const statusConfig: Record<
  EventStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Active", variant: "default" },
  resolved: { label: "Resolved", variant: "secondary" },
  ignored: { label: "Ignored", variant: "outline" },
};

interface EventStatusBadgeProps {
  status: EventStatus;
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
