"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { worldSchema, type WorldInput } from "@/lib/validations/world";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

interface WorldFormProps {
  worldId?: string;
  defaultValues?: WorldInput;
  onSuccess?: () => void;
}

export function WorldForm({ worldId, defaultValues, onSuccess }: WorldFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorldInput>({
    resolver: zodResolver(worldSchema),
    defaultValues,
  });

  async function onSubmit(data: WorldInput) {
    setServerError(null);
    const url = worldId ? `/api/worlds/${worldId}` : "/api/worlds";
    const method = worldId ? "PUT" : "POST";

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
        <Label htmlFor="world-name">Name</Label>
        <Input
          id="world-name"
          {...register("name")}
          placeholder="My Campaign World"
          aria-describedby={errors.name ? "world-name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="world-name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="world-description">Description</Label>
        <textarea
          id="world-description"
          {...register("description")}
          placeholder="A brief description of your world…"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          aria-describedby={errors.description ? "world-desc-error" : undefined}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p id="world-desc-error" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting} className="min-h-[44px]">
          {isSubmitting ? "Saving…" : worldId ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}
