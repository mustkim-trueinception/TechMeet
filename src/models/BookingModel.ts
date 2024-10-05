import mongoose, { Schema, Document } from "mongoose";

/**
 * Enum for different guest occupations.
 * @enum {string}
 */
enum GuestOccupation {
  STUDENT = "Student",
  BUSINESSMAN = "Businessperson",
  WORKING_PROFESSIONAL = "Working Professional",
}

/**
 * Enum for booking status.
 * @enum {string}
 */
export enum Status {
  PENDING = "Pending",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  RESCHEDULED = "Rescheduled",
  // Add more statuses as needed
  REJECTED= "Rejected"
}

/**
 * Interface representing a Booking document in MongoDB.
 * @interface IBooking
 * @extends {Document}
 * @property {string} guestName - Name of the guest.
 * @property {mongoose.Schema.Types.ObjectId} dateId - Reference to the Date model.
 * @property {GuestOccupation} guestOccupation - Occupation of the guest.
 * @property {number} guestAge - Age of the guest.
 * @property {string} guestCity - City of the guest.
 * @property {string} guestEmail - Email of the guest.
 * @property {string} guestPhone - Phone number of the guest.
 * @property {string} guestWhatsapp - WhatsApp number of the guest.
 * @property {string} guestWebsite - Website of the guest (optional).
 * @property {string} guestProblem - Description of the guest's problem.
 * @property {string} [guestVoiceNote] - Voice note from the guest (optional).
 * @property {string[]} tags - Tags related to the booking.
 * @property {boolean} guestKYC - KYC status of the guest.
 * @property {mongoose.Schema.Types.ObjectId} expertId - Reference to the Expert model.
 * @property {mongoose.Schema.Types.ObjectId} slotId - Reference to the Slot model.
 * @property {Status} status - Current status of the booking.
 */
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
  expertId: mongoose.Schema.Types.ObjectId;
  slotId: mongoose.Schema.Types.ObjectId;
  status: Status;
}

/**
 * Mongoose schema for the Booking collection.
 * @type {Schema<IBooking>}
 */
const bookingSchema: Schema = new Schema(
  {
    guestName: { type: String, required: true },
    dateId: { type: Schema.Types.ObjectId, ref: "Date", required: true },
    guestOccupation: {
      type: String,
      enum: Object.values(GuestOccupation),
      required: true,
    },
    guestAge: { type: Number, required: true },
    guestCity: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    guestWhatsapp: { type: String, required: true },
    guestWebsite: { type: String },
    guestProblem: { type: String, required: true },
    guestVoiceNote: { type: String }, // Optional field
    tags: [{ type: String, required: true }],
    guestKYC: { type: Boolean, required: true },
    expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
    status: { type: String, enum: Object.values(Status), required: true },
  },
  { timestamps: true }
);

/**
 * The Booking model based on the booking schema.
 * @typedef {mongoose.Model<IBooking>}
 */
export const BookingSchema = mongoose.model<IBooking>("Booking", bookingSchema);
