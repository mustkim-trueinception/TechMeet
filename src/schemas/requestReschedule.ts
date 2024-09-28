import { z } from 'zod';
import mongoose from 'mongoose';

// Define the Zod schema for rescheduling request
export const reschedulingRequestSchemaZod = z.object({
  Current_Booking_id: z.string().length(24, "Invalid booking ID format"), // Must be a valid ObjectId
  RequestedDateId: z.string().length(24, "Invalid date ID format"), // Must be a valid ObjectId
  RequestedSlotId: z.string().length(24, "Invalid slots ID format"),  // Must be a valid ObjectId
});