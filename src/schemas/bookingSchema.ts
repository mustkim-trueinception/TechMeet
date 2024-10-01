import { z } from 'zod';

// Define Zod enum for Guest Occupation
export const GuestOccupationEnum = z.enum([
  'Student',
  'Businessperson',
  'Working Professional'
]);

// Define Zod enum for Status
export const StatusEnum = z.enum([
  'Pending',
  'Completed',
  'Cancelled',
  'Rescheduled'
]);

// Zod schema for validating booking data
export const bookingSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  dateId: z.string().min(1, "Date is required"),
  guestOccupation: GuestOccupationEnum,
  guestAge: z.number().min(1, "Guest age must be a positive number"),
  guestCity: z.string().min(1, "Guest city is required"),
  guestEmail: z.string().email("Invalid email format"),
  guestPhone: z.string().min(10, "Guest phone must be at least 10 digits"),
  guestWhatsapp: z.string().min(10, "Guest Whatsapp must be at least 10 digits"),
  guestWebsite: z.string().min(10,"Invalid website format"),
  guestProblem: z.string().min(1, "Guest problem is required"),
  guestVoiceNote: z.string().optional(),
  tags: z.array(z.string()),
  guestKYC: z.boolean(),
  expertId: z.string().length(24, "Invalid Expert ID"),  // Validate MongoDB ObjectId format
  slotId: z.string().length(24, "Invalid Slot ID"),  // Validate MongoDB ObjectId format
  status: StatusEnum
});
