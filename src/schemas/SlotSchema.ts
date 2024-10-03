import { z } from "zod";

/**
 * @constant SlotSchemaZod
 * @type {z.ZodObject}
 * @description Zod schema for validating slot data.
 * This schema ensures that all required fields are present and correctly formatted
 * when creating or updating a slot.
 * 
 * @property {ZodString} availability - A string that indicates the availability status of the slot.
 * Must be at least 3 characters long (e.g., "Available", "Not available").
 * @property {ZodString} timing - A string that represents the time of the slot in "HH:MM" format.
 * Must match the regular expression for valid time format.
 * @property {ZodString} period - A string indicating the period of the day for the slot.
 * Must be at least 3 characters long (e.g., "Morning", "Afternoon", "Night").
 * @property {ZodString} planId - A string representing the ID of the associated Plan.
 * Must be a 24-character long string.
 * @property {ZodString} expertId - A string representing the ID of the associated Expert.
 * Must be a 24-character long string.
 */

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
