"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { regionSchema, type RegionInput } from "@/lib/validations/region";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

interface RegionFormProps {
  worldId: string;
  regionId?: string;
  defaultValues?: RegionInput;
  onSuccess?: () => void;
}

export function RegionForm({ worldId, regionId, defaultValues, onSuccess }: RegionFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegionInput>({
    resolver: zodResolver(regionSchema),
    defaultValues,
  });

  async function onSubmit(data: RegionInput) {
    setServerError(null);
    const url = regionId
      ? `/api/worlds/${worldId}/regions/${regionId}`
      : `/api/worlds/${worldId}/regions`;
    const method = regionId ? "PUT" : "POST";

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
        <Label htmlFor="region-name">Name</Label>
        <Input
          id="region-name"
          {...register("name")}
          placeholder="e.g. Northern Reaches"
          aria-describedby={errors.name ? "region-name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="region-name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="region-description">Description</Label>
        <textarea
          id="region-description"
          {...register("description")}
          placeholder="A brief description of this region…"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          aria-describedby={errors.description ? "region-desc-error" : undefined}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p id="region-desc-error" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="min-h-[44px]">
          {isSubmitting ? "Saving…" : regionId ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}
