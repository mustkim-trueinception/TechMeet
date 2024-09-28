import mongoose, { Schema, Document } from 'mongoose';

// Define the Mongoose document interface for rescheduling request
export interface IReschedulingRequest extends Document {
  Current_Booking_id: mongoose.Schema.Types.ObjectId; // Foreign key for booking
  RequestedDateId: mongoose.Schema.Types.ObjectId; // Foreign key for the requested date
  RequestedSlotId: mongoose.Schema.Types.ObjectId; // Foreign key for the requested slot
}

// Define the rescheduling request schema
const reschedulingRequestSchema: Schema<IReschedulingRequest> = new Schema({
  Current_Booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Foreign key to Booking
  RequestedDateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Date', required: true }, // Foreign key to requested date
  RequestedSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true }, // Foreign key to requested slot
}, { timestamps: true });

// Create the Mongoose model for rescheduling request
const ReschedulingRequest = mongoose.model<IReschedulingRequest>('ReschedulingRequest', reschedulingRequestSchema);

export { ReschedulingRequest };