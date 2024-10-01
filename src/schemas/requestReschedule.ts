import { z } from 'zod';
// import { RequestedBy } from '../models/requestReschedule';


// Define the Zod schema for rescheduling request
export const reschedulingRequestSchemaZod = z.object({
  CurrentBookingId: z.string().length(24, "Invalid booking ID format"), // Must be a valid ObjectId
  // RequestedBy: z.enum([RequestedBy.USER, RequestedBy.EXPERT]),
  RequestedDateId: z.string().length(24, "Invalid date ID format"), // Must be a valid ObjectId
  RequestedSlotId: z.string().length(24, "Invalid slots ID format"),  // Must be a valid ObjectId
  expertId: z.string().length(24, "Invalid expert ID format"), // Must be a valid ObjectId
});