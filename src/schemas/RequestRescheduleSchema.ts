import { optional, z } from "zod";
import { RequestedBy } from "../models/RequestRescheduleModel";
// import { RequestedBy } from '../models/requestReschedule';

/**
 * @constant ReschedulingRequestSchemaZod
 * @description Zod schema for validating the rescheduling request data
 * @property {string} CurrentBookingId - The ID of the current booking (must be a valid 24-character ObjectId)
 * @property {string} RequestedDateId - The ID of the requested new date (must be a valid 24-character ObjectId)
 * @property {string} RequestedSlotId - The ID of the requested new slot (must be a valid 24-character ObjectId)
 * @example
 * {
 *   CurrentBookingId: "5f50c31b52bdbb0012d95a5f",
 *   RequestedDateId: "5f50c31b52bdbb0012d95a60",
 *   RequestedSlotId: "5f50c31b52bdbb0012d95a61"
 * }
 */

export const ReschedulingRequestSchemaZod = z.object({
  CurrentBookingId: z.string().length(24, "Invalid booking ID format"),
  RequestedBy: z.enum([RequestedBy.USER, RequestedBy.EXPERT]),
  RequestedDateId: z.string().length(24, "Invalid date ID format").optional(),
  RequestedSlotId: z.string().length(24, "Invalid slots ID format").optional(),
  ReschedulingId: z
    .string()
    .length(24, "Invalid rescheduling ID format")
    .optional(),
  SelectedOption: optional(z.string().min(1, "Please select an option")),
  // expertId: z.string().length(24, "Invalid expert ID format")
});
