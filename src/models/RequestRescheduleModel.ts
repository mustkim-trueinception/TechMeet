import mongoose, { Schema, Document } from "mongoose";
import { IExpert } from "./ExpertModel";

// Request Reschedule by user /guest /client

// Define enum for requested by
// export enum RequestedBy {
//   USER = 'User',
//   EXPERT = 'Expert'
// }

// Define the Mongoose document interface for rescheduling request
export interface IReschedulingRequest extends Document {
  CurrentBookingId: mongoose.Schema.Types.ObjectId;
  RequestedDateId: mongoose.Schema.Types.ObjectId;
  RequestedSlotId: mongoose.Schema.Types.ObjectId;
  // expertId: mongoose.Schema.Types.ObjectId;
}

// Define the rescheduling request schema
const reschedulingRequestSchema: Schema<IReschedulingRequest> = new Schema(
  {
    CurrentBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    RequestedDateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Date",
      required: true,
    },
    RequestedSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    // expertId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Expert",
    // },
  },
  { timestamps: true }
);

// Create the Mongoose model for rescheduling request
const ReschedulingRequest = mongoose.model<IReschedulingRequest>(
  "ReschedulingRequest",
  reschedulingRequestSchema
);

export { ReschedulingRequest };
