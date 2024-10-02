import { z } from 'zod';

// Zod schema for validating date entries
export const DateSchemaZod = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  availability: z.enum(['holiday', 'available', 'not available', 'booked']),
  expertId: z.string().length(24, "Invalid Expert ID format"),  // MongoDB ObjectId format
  slotsId: z.array(z.string().length(24, "Invalid Slot ID format")),  // Optional array of slot IDs
});
