"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { RegionForm } from "@/components/regions/RegionForm";
import type { RegionWithCount } from "@/types";

interface RegionCardProps {
  region: RegionWithCount;
  worldId: string;
}

export function RegionCard({ region, worldId }: RegionCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await fetch(`/api/worlds/${worldId}/regions/${region.id}`, {
      method: "DELETE",
    });
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
          <CardTitle className="text-base leading-tight">
            <Link
              href={`/worlds/${worldId}/regions/${region.id}`}
              className="hover:underline focus-visible:underline"
            >
              {region.name}
            </Link>
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] min-w-[44px]"
              aria-label={`Edit ${region.name}`}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive hover:text-destructive-foreground"
              aria-label={`Delete ${region.name}`}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {region.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {region.description}
            </p>
          )}
          <Badge variant="secondary">
            {region.eventCount} {region.eventCount === 1 ? "event" : "events"}
          </Badge>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Region</DialogTitle>
          </DialogHeader>
          <RegionForm
            worldId={worldId}
            regionId={region.id}
            defaultValues={{ name: region.name, description: region.description ?? undefined }}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Delete Region"
        description={`Are you sure you want to delete "${region.name}"? All events and outcomes within it will be permanently deleted.`}
      />
    </>
  );
}
