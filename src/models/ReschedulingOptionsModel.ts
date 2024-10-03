import { times } from "lodash";
import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface ReschedulingOptions
 * @extends Document
 * @property {mongoose.Types.ObjectId} CurrentBookingId - The ID of the current booking (must be a valid ObjectId).
 * @property {Array<{ dateId: string; slotId: string }>} availableSlots - An array of available slots for rescheduling, each containing a dateId and a slotId.
 * @property {Date} expiryDate - The date and time until the rescheduling options are valid.
 */

export interface ReschedulingOptions extends Document {
  CurrentBookingId: mongoose.Types.ObjectId;
  availableSlots: Array<{ dateId: string; slotId: string }>;
  expiryDate: Date;
}

/**
 * @class ReschedulingOptionsSchema
 * @description Mongoose schema for managing rescheduling options.
 */

const reschedulingOptionsSchema: Schema = new Schema<ReschedulingOptions>(
  {
    CurrentBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    availableSlots: [
      {
        dateId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Date",
          required: true,
        },
        slotId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Slot",
          required: true,
        },
      },
    ],
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

/**
 * @constant ReschedulingOptions
 * @description Mongoose model for rescheduling options, allowing interaction with the rescheduling options collection in the database.
 */
export const ReschedulingOptions = mongoose.model<ReschedulingOptions>(
  "ReschedulingOptions",
  reschedulingOptionsSchema
);
