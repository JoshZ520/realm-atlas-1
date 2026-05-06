"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RegionForm } from "@/components/regions/RegionForm";

interface AddRegionButtonProps {
  worldId: string;
}

export function AddRegionButton({ worldId }: AddRegionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="min-h-[44px]">
        Add Region
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Region</DialogTitle>
          </DialogHeader>
          <RegionForm worldId={worldId} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
