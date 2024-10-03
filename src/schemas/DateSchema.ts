import { z } from "zod";


/**
 * Zod schema for validating date entries.
 * @type {z.ZodObject<{
 *   date: z.ZodString;
 *   availability: z.ZodEnum<["holiday", "available", "not available", "booked"]>;
 *   expertId: z.ZodString;
 *   slotsId: z.ZodArray<z.ZodString>;
 * }>
 */
export const DateSchemaZod = z.object({
  /**
   * The date in "DD/MM/YYYY" format.
   * Must match the regex /^\d{2}\/\d{2}\/\d{4}$/.
   * @type {string}
   */
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),

  /**
   * The availability status of the date.
   * Must be one of: "holiday", "available", "not available", or "booked".
   * @type {("holiday" | "available" | "not available" | "booked")}
   */
  availability: z.enum(["holiday", "available", "not available", "booked"]),

  /**
   * The ID of the expert associated with the date.
   * Must be a string of 24 characters (MongoDB ObjectId format).
   * @type {string}
   */
  expertId: z.string().length(24, "Invalid Expert ID format"), // MongoDB ObjectId format

  /**
   * An optional array of slot IDs associated with the date.
   * Each ID must be a string of 24 characters (MongoDB ObjectId format).
   * @type {string[]}
   */
  slotsId: z.array(z.string().length(24, "Invalid Slot ID format")), // Optional array of slot IDs
});
