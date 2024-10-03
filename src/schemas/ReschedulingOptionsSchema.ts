import { z } from "zod";

/**
 * @constant ReschedulingOptionsSchemaZod
 * @description Zod schema for validating rescheduling options. It checks for the following:
 * - CurrentBookingId: a required non-empty string representing the current booking ID.
 * - availableSlots: an array of objects, each containing:
 *   - dateId: a required non-empty string representing the date.
 *   - slotId: a required non-empty string representing the slot ID.
 *   - The array must contain at least 3 options.
 * - expiryDate: an optional date field, which will be generated in the backend.
 */export const ReschedulingOptionsSchemaZod = z.object({
  CurrentBookingId: z.string().nonempty("Current booking ID is required"),
  availableSlots: z
    .array(
      z.object({
        dateId: z.string().nonempty("Date is required"),
        slotId: z.string().nonempty("Slot ID is required"),
      })
    )
    .min(3, "At least 3 options must be provided"),
  expiryDate: z.date().optional(), // expiryDate can be optional, as we'll generate it in the backend
});
