import { BookingSchemaZod } from '../schemas/BookingSchema';
import mongoose, { Schema, Document } from 'mongoose';

// Define enums for guest occupation
enum GuestOccupation {
  STUDENT = 'Student',
  BUSINESSMAN = 'Businessperson',
  WORKING_PROFESSIONAL = 'Working Professional'
}

// Define enum for status
export enum Status {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  RESCHEDULED = 'Rescheduled'
}

// Define the Mongoose document interface for booking
export interface IBooking extends Document {
  guestName: string;
  dateId: mongoose.Schema.Types.ObjectId;
  guestOccupation: GuestOccupation;
  guestAge: number;
  guestCity: string;
  guestEmail: string;
  guestPhone: string;
  guestWhatsapp: string;
  guestWebsite: string;
  guestProblem: string;
  guestVoiceNote?: string; // Optional field
  tags: string[];
  guestKYC: boolean;
  expertId: mongoose.Schema.Types.ObjectId; // Reference to Expert model
  slotId: mongoose.Schema.Types.ObjectId;   // Reference to Slot model
  status: Status;
}

// Define the Mongoose schema for booking
  const bookingSchema: Schema = new Schema({
  guestName: { type: String, required: true },
  dateId:{ type: Schema.Types.ObjectId, ref: 'Date', required: true },  // Reference to Date model,
  guestOccupation: { type: String, enum: Object.values(GuestOccupation), required: true },
  guestAge: { type: Number, required: true },
  guestCity: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
  guestWhatsapp: { type: String, required: true },
  guestWebsite: { type: String },
  guestProblem: { type: String, required: true },
  guestVoiceNote: { type: String },  // Optional field
  tags: [{ type: String, required: true }],
  guestKYC: { type: Boolean, required: true },
  expertId: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },  // Reference to Expert model
  slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },  // Reference to Slot model
  status: { type: String, enum: Object.values(Status), required: true }
}, { timestamps: true });

export const BookingSchema = mongoose.model<IBooking>('Booking', bookingSchema);
