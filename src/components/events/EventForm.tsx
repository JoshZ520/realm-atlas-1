"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

interface EventFormProps {
  worldId: string;
  regionId: string;
  eventId?: string;
  defaultValues?: Partial<EventInput>;
  onSuccess?: () => void;
}

export function EventForm({
  worldId,
  regionId,
  eventId,
  defaultValues,
  onSuccess,
}: EventFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: { status: "active", ...defaultValues },
  });

  async function onSubmit(data: EventInput) {
    setServerError(null);
    const base = `/api/worlds/${worldId}/regions/${regionId}/events`;
    const url = eventId ? `${base}/${eventId}` : base;
    const method = eventId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.refresh();
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="event-title">Title</Label>
        <Input
          id="event-title"
          {...register("title")}
          placeholder="e.g. Goblin raids on trade routes"
          aria-describedby={errors.title ? "event-title-error" : undefined}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p id="event-title-error" className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="event-description">Description</Label>
        <textarea
          id="event-description"
          {...register("description")}
          placeholder="Describe what happened…"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          aria-describedby={errors.description ? "event-desc-error" : undefined}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p id="event-desc-error" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="event-status">Status</Label>
        <select
          id="event-status"
          {...register("status")}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="ignored">Ignored</option>
        </select>
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="min-h-[44px]">
          {isSubmitting ? "Saving…" : eventId ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}
