import { z } from "zod";

export const outcomeSchema = z.object({
  description: z
    .string()
    .min(1, "Outcome description is required")
    .max(2000, "Outcome description cannot exceed 2000 characters"),
});

export const updateOutcomeSchema = z.object({
  description: z.string().min(1).max(2000).optional(),
  occurred: z.boolean().optional(),
});

export type OutcomeInput = z.infer<typeof outcomeSchema>;
export type UpdateOutcomeInput = z.infer<typeof updateOutcomeSchema>;
