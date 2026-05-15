"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

// --- Types ---
export type NewEvent = {
  title: string;
  description: string;
  status: "active" | "resolved" | "ignored";
};

export type NewRegion = {
  name: string;
  description: string;
  events: NewEvent[];
};

export type NewWorldWizardData = {
  name: string;
  description: string;
  regions: NewRegion[];
};

// --- Main Component ---
export function CreateWorldWizard({ open, onOpenChange, onSuccess }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [world, setWorld] = useState({ name: "", description: "" });
  const [regions, setRegions] = useState<NewRegion[]>([]);
  const [regionDraft, setRegionDraft] = useState({ name: "", description: "" });
  const [eventsDraft, setEventsDraft] = useState<Record<number, NewEvent[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: World Info
  function handleWorldNext() {
    if (!world.name.trim()) {
      setError("World name is required");
      return;
    }
    setError(null);
    setStep(2);
  }

  // Step 2: Add Regions
  function handleAddRegion() {
    if (!regionDraft.name.trim()) {
      setError("Region name is required");
      return;
    }
    setRegions([...regions, { ...regionDraft, events: [] }]);
    setRegionDraft({ name: "", description: "" });
    setError(null);
  }
  function handleRegionsNext() {
    if (regions.length === 0) {
      setError("Add at least one region");
      return;
    }
    setError(null);
    setStep(3);
  }

  // Step 3: Add Events to Regions
  function handleAddEvent(regionIdx: number) {
    const events = eventsDraft[regionIdx] || [];
    setEventsDraft({
      ...eventsDraft,
      [regionIdx]: [...events, { title: "", description: "", status: "active" }],
    });
  }
  function handleEventChange(regionIdx: number, eventIdx: number, field: keyof NewEvent, value: string) {
    const events = eventsDraft[regionIdx] || [];
    const updated = events.map((e, i) => i === eventIdx ? { ...e, [field]: value } : e);
    setEventsDraft({ ...eventsDraft, [regionIdx]: updated });
  }
  function handleEventsNext() {
    // Attach events to regions
    const updatedRegions = regions.map((r, idx) => ({ ...r, events: eventsDraft[idx] || [] }));
    setRegions(updatedRegions);
    setStep(4);
  }

  // Step 4: Review & Submit
  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      // 1. Create world
      const resWorld = await fetch("/api/worlds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: world.name, description: world.description }),
      });
      if (!resWorld.ok) throw new Error("Failed to create world");
      const { id: worldId } = await resWorld.json();
      // 2. Create regions
      for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const resRegion = await fetch(`/api/worlds/${worldId}/regions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: region.name, description: region.description }),
        });
        if (!resRegion.ok) throw new Error("Failed to create region");
        const { id: regionId } = await resRegion.json();
        // 3. Create events for this region
        for (const event of region.events) {
          if (!event.title.trim()) continue;
          await fetch(`/api/worlds/${worldId}/regions/${regionId}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
          });
        }
      }
      setLoading(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (e: unknown) {
      setLoading(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  // --- Render ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create World</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>World Name</Label>
              <Input value={world.name} onChange={e => setWorld({ ...world, name: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={world.description} onChange={e => setWorld({ ...world, description: e.target.value })} />
            </div>
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-end gap-2">
              <Button onClick={handleWorldNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Region name" value={regionDraft.name} onChange={e => setRegionDraft({ ...regionDraft, name: e.target.value })} />
              <Input placeholder="Description" value={regionDraft.description} onChange={e => setRegionDraft({ ...regionDraft, description: e.target.value })} />
              <Button onClick={handleAddRegion}>Add Region</Button>
            </div>
            <ul className="space-y-1">
              {regions.map((r, i) => (
                <li key={i}>{r.name} - {r.description}</li>
              ))}
            </ul>
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleRegionsNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            {regions.map((region, idx) => (
              <div key={idx} className="border rounded p-2 mb-2">
                <div className="font-semibold mb-1">Events for {region.name}</div>
                <Button size="sm" onClick={() => handleAddEvent(idx)}>Add Event</Button>
                <ul className="space-y-1 mt-2">
                  {(eventsDraft[idx] || []).map((event, eIdx) => (
                    <li key={eIdx} className="flex gap-2 items-center">
                      <Input placeholder="Title" value={event.title} onChange={e => handleEventChange(idx, eIdx, "title", e.target.value)} />
                      <Input placeholder="Description" value={event.description} onChange={e => handleEventChange(idx, eIdx, "description", e.target.value)} />
                      <select value={event.status} onChange={e => handleEventChange(idx, eIdx, "status", e.target.value)} className="border rounded px-2 py-1">
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="ignored">Ignored</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleEventsNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <div className="font-semibold">World:</div>
              <div>{world.name} - {world.description}</div>
            </div>
            <div>
              <div className="font-semibold">Regions & Events:</div>
              <ul className="list-disc ml-6">
                {regions.map((r, i) => (
                  <li key={i}>
                    {r.name} - {r.description}
                    <ul className="list-disc ml-6">
                      {r.events.map((e, j) => (
                        <li key={j}>{e.title} ({e.status}) - {e.description}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create World"}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
