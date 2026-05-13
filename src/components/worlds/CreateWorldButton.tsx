"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateWorldWizard } from "@/components/worlds/CreateWorldWizard";

export function CreateWorldButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="min-h-[44px]">
        Create World
      </Button>
      <CreateWorldWizard open={open} onOpenChange={setOpen} onSuccess={() => setOpen(false)} />
    </>
  );
}
