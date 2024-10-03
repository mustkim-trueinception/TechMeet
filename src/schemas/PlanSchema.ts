import { z } from "zod";

/**
 * @constant PlanSchemaZod
 * @description Zod schema for validating Plan objects.
 * @property {string} name - The name of the plan. Must be at least 3 characters long.
 * @property {string} channel - The channel of the plan (e.g., phone, video). Must be at least 3 characters long.
 * @property {number} duration - The duration of the plan in minutes. Must be at least 1 minute.
 * @property {string} price - The price of the plan. Must follow a valid currency format (e.g., "100.00").
 * @property {string} bookingType - The type of booking (e.g., "appointment", "seminar"). Must be at least 3 characters long.
 * @property {string} expertId - The expert's ID. Must be a valid ObjectId string (24 characters).
 * @property {boolean} [isDedicated] - Optional field indicating if the plan is dedicated.
 */

export const PlanSchemaZod = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  channel: z.string().min(3, "Channel must be at least 3 characters"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format (e.g. 100.00)"), // Currency format validation
  bookingType: z.string().min(3, "Booking type must be at least 3 characters"),
  expertId: z.string().length(24, "Invalid Expert ID format"), // ObjectId string format
  isDedicated: z.boolean().optional(), // Optional field
});
