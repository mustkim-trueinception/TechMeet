// import { updateGuestSchema } from './../routes/BookingRoutes';
import { z } from "zod";

/**
 * Enum representing guest occupations.
 * @enum {string}
 */
export const GuestOccupationEnum = z.enum([
  "Student",
  "Businessperson",
  "Working Professional",
]);

/**
 * Enum representing booking status.
 * @enum {string}
 */
export const StatusEnum = z.enum([
  "Pending",
  "Completed",
  "Cancelled",
  "Rescheduled",
]);

/**
 * Zod schema for validating booking data.
 * 
 * @property {string} guestName - Name of the guest, required and must be a non-empty string.
 * @property {string} dateId - The ID of the selected date, required and must be a non-empty string.
 * @property {("Student" | "Businessperson" | "Working Professional")} guestOccupation - Occupation of the guest, restricted to specific values.
 * @property {number} guestAge - Age of the guest, required and must be a positive number.
 * @property {string} guestCity - City of the guest, required and must be a non-empty string.
 * @property {string} guestEmail - Email of the guest, required and must be in valid email format.
 * @property {string} guestPhone - Phone number of the guest, required and must be at least 10 digits.
 * @property {string} guestWhatsapp - WhatsApp number of the guest, required and must be at least 10 digits.
 * @property {string} guestWebsite - Website of the guest, optional but must be a valid format if provided.
 * @property {string} guestProblem - The problem or issue reported by the guest, required and must be a non-empty string.
 * @property {string | undefined} guestVoiceNote - Optional voice note from the guest.
 * @property {Array<string>} tags - Array of tags associated with the booking, required.
 * @property {boolean} guestKYC - Boolean indicating whether KYC (Know Your Customer) is completed, required.
 * @property {string} expertId - MongoDB ObjectId of the expert, required and must be a valid ObjectId format.
 * @property {string} slotId - MongoDB ObjectId of the slot, required and must be a valid ObjectId format.
 * @property {("Pending" | "Completed" | "Cancelled" | "Rescheduled")} status - Status of the booking, restricted to specific values.
 */
export const BookingSchemaZod = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  dateId: z.string().min(1, "Date is required"),
  guestOccupation: GuestOccupationEnum,
  guestAge: z.number().min(1, "Guest age must be a positive number"),
  guestCity: z.string().min(1, "Guest city is required"),
  guestEmail: z.string().email("Invalid email format"),
  guestPhone: z.string().min(10, "Guest phone must be at least 10 digits"),
  guestWhatsapp: z
    .string()
    .min(10, "Guest Whatsapp must be at least 10 digits"),
  guestWebsite: z.string().min(10, "Invalid website format"),
  guestProblem: z.string().min(1, "Guest problem is required"),
  guestVoiceNote: z.string().optional(),
  tags: z.array(z.string()),
  guestKYC: z.boolean(),
  expertId: z.string().length(24, "Invalid Expert ID"), // Validate MongoDB ObjectId format
  slotId: z.string().length(24, "Invalid Slot ID"), // Validate MongoDB ObjectId format
  status: StatusEnum,
});
