"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { WorldForm } from "@/components/worlds/WorldForm";
import type { WorldWithCounts } from "@/types";

interface WorldCardProps {
  world: WorldWithCounts;
}

export function WorldCard({ world }: WorldCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await fetch(`/api/worlds/${world.id}`, { method: "DELETE" });
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
          <CardTitle className="text-lg leading-tight">
            <Link
              href={`/worlds/${world.id}`}
              className="hover:underline focus-visible:underline"
            >
              {world.name}
            </Link>
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] min-w-[44px]"
              aria-label={`Edit ${world.name}`}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive hover:text-destructive-foreground"
              aria-label={`Delete ${world.name}`}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {world.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {world.description}
            </p>
          )}
          <div className="flex gap-2">
            <Badge variant="secondary">
              {world.totalEventCount}{" "}
              {world.totalEventCount === 1 ? "event" : "events"}
            </Badge>
            {world.activeEventCount > 0 && (
              <Badge variant="default">
                {world.activeEventCount} active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit World</DialogTitle>
          </DialogHeader>
          <WorldForm
            worldId={world.id}
            defaultValues={{ name: world.name, description: world.description ?? undefined }}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Delete World"
        description={`Are you sure you want to delete "${world.name}"? This will permanently delete all regions, events, and outcomes within it.`}
      />
    </>
  );
}
