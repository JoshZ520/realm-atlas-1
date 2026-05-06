import { z } from "zod";

export const eventStatusSchema = z.enum(["active", "resolved", "ignored"]);

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Event title is required")
    .max(100, "Event title cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Event description is required")
    .max(2000, "Event description cannot exceed 2000 characters"),
  status: eventStatusSchema.optional().default("active"),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(2000).optional(),
  status: eventStatusSchema.optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventStatus = z.infer<typeof eventStatusSchema>;
