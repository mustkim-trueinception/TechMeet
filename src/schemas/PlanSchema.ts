import { z } from 'zod';

// Zod schema for Plan validation
export const PlanSchemaZod = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  channel: z.string().min(3, "Channel must be at least 3 characters"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format (e.g. 100.00)"),  // Currency format validation
  bookingType: z.string().min(3, "Booking type must be at least 3 characters"),
  expertId: z.string().length(24, "Invalid Expert ID format"),  // ObjectId string format
  isDedicated: z.boolean().optional(),  // Optional field
});
