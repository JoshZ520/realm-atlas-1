import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be 3–50 characters (letters, numbers, underscores)")
    .max(50, "Username must be 3–50 characters (letters, numbers, underscores)")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must be 3–50 characters (letters, numbers, underscores)"
    ),
  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters with one letter and one number"
    )
    .regex(
      /(?=.*[a-zA-Z])(?=.*[0-9])/,
      "Password must be at least 8 characters with one letter and one number"
    ),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
