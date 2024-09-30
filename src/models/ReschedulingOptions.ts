import { times } from 'lodash';
import mongoose, { Schema, Document } from 'mongoose';

// Define the Mongoose document interface for rescheduling options
export interface ReschedulingOptions extends Document {
  currentBookingId: mongoose.Types.ObjectId;
  availableSlots: Array<{ date: string; slotId: string }>;
  expiryDate: Date;
}

// Define the Mongoose schema for rescheduling options
const reschedulingOptionsSchema: Schema = new Schema<ReschedulingOptions>({
  currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  availableSlots: [
    {
      dateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Date', required: true },
      slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    },
  ],
  expiryDate: { type: Date, required: true },
},
{ timestamps: true });

// Export the Mongoose model
export const ReschedulingOptions = mongoose.model<ReschedulingOptions>('ReschedulingOptions', reschedulingOptionsSchema);
