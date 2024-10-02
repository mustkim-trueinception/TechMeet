import { z } from "zod";

// Zod schema for slot validation
export const SlotSchemaZod = z.object({
  availability: z
    .string()
    .min(3, "Availability must be at least 3 characters long"), // E.g., "Available", "Not available"
  timing: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"), // Validates time in HH:MM format
  period: z.string().min(3, "Period must be at least 3 characters long"), // Morning, Afternoon, etc.
  planId: z.string().length(24, "Invalid Plan ID format"), // 24-character ObjectId string
  expertId: z.string().length(24, "Invalid Expert ID format"), // 24-character ObjectId string
});
