import { z } from "zod";

export const regionSchema = z.object({
  name: z
    .string()
    .min(1, "Region name is required")
    .max(100, "Region name cannot exceed 100 characters"),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
});

export const updateRegionSchema = regionSchema.partial();

export type RegionInput = z.infer<typeof regionSchema>;
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;
