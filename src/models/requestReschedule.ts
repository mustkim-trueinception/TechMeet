import mongoose, { Schema, Document } from 'mongoose'

// Request Reschedule by user /guest /client

// Define enum for requested by
// export enum RequestedBy {
//   USER = 'User',
//   EXPERT = 'Expert'
// }

// Define the Mongoose document interface for rescheduling request
export interface IReschedulingRequest extends Document {
  Current_Booking_id: mongoose.Schema.Types.ObjectId; // Foreign key for booking
  // RequestedBy: RequestedBy;
  RequestedDateId: mongoose.Schema.Types.ObjectId; // Foreign key for the requested date
  RequestedSlotId: mongoose.Schema.Types.ObjectId; // Foreign key for the requested slot
}

// Define the rescheduling request schema
const reschedulingRequestSchema: Schema<IReschedulingRequest> = new Schema({
  Current_Booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Foreign key to Booking
  // RequestedBy: { type: String, enum: Object.values(RequestedBy), required: true },
  RequestedDateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Date', required: true }, // Foreign key to requested date
  RequestedSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true }, // Foreign key to requested slot
}, { timestamps: true });

// Create the Mongoose model for rescheduling request
const ReschedulingRequest = mongoose.model<IReschedulingRequest>('ReschedulingRequest', reschedulingRequestSchema);

export { ReschedulingRequest };