"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { EventForm } from "@/components/events/EventForm";
import { formatDate } from "@/lib/utils";
import type { EventStatus } from "@/lib/validations/event";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    status: EventStatus;
    createdAt: Date;
  };
  worldId: string;
  regionId: string;
}

export function EventCard({ event, worldId, regionId }: EventCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await fetch(
      `/api/worlds/${worldId}/regions/${regionId}/events/${event.id}`,
      { method: "DELETE" }
    );
    setIsDeleting(false);
    if (res.ok) {
      setDeleteOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex-row items-start justify-between gap-2 pb-2">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-base leading-tight">
              <Link
                href={`/worlds/${worldId}/regions/${regionId}/events/${event.id}`}
                className="hover:underline focus-visible:underline"
              >
                {event.title}
              </Link>
            </CardTitle>
            <EventStatusBadge status={event.status} />
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] min-w-[44px]"
              aria-label={`Edit ${event.title}`}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive hover:text-destructive-foreground"
              aria-label={`Delete ${event.title}`}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
          <p className="text-xs text-muted-foreground">
            Created {formatDate(event.createdAt)}
          </p>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            worldId={worldId}
            regionId={regionId}
            eventId={event.id}
            defaultValues={{
              title: event.title,
              description: event.description,
              status: event.status,
            }}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Delete Event"
        description={`Are you sure you want to delete "${event.title}"? All outcomes will be permanently deleted.`}
      />
    </>
  );
}
