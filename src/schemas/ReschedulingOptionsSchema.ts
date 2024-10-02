import { z } from "zod";

// Zod validation schema for rescheduling options
export const ReschedulingOptionsSchemaZod = z.object({
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
