import { z } from "zod";

export const worldSchema = z.object({
  name: z
    .string()
    .min(1, "World name is required")
    .max(100, "World name cannot exceed 100 characters"),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
});

export const updateWorldSchema = worldSchema.partial();

export type WorldInput = z.infer<typeof worldSchema>;
export type UpdateWorldInput = z.infer<typeof updateWorldSchema>;
