import { ReschedulingOptions } from "./ReschedulingOptionsModel";
import { Request } from "express";
import mongoose, { Schema, Document } from "mongoose";

// Request Reschedule by user /guest /client

// Define enum for requested by
export enum RequestedBy {
  USER = "User",
  EXPERT = "Expert",
}

// Define enum for Options
export enum Options {
  Option_1 = "Option 1",
  Option_2 = "Option 2",
  Option_3 = "Option 3",
}

/**
 * @interface IReschedulingRequest
 * @description Interface for ReschedulingRequest documents
 * @property {mongoose.Schema.Types.ObjectId} CurrentBookingId - The current booking's ObjectId
 * @property {mongoose.Schema.Types.ObjectId} RequestedDateId - The requested new date's ObjectId
 * @property {mongoose.Schema.Types.ObjectId} RequestedSlotId - The requested new slot's ObjectId
 */

export interface IReschedulingRequest extends Document {
  CurrentBookingId: mongoose.Schema.Types.ObjectId;
  RequestedBy: RequestedBy;
  RequestedDateId?: mongoose.Schema.Types.ObjectId;
  RequestedSlotId?: mongoose.Schema.Types.ObjectId;
  ReschedulingId: mongoose.Schema.Types.ObjectId;
  SelectedOption: Options;
}

/**
 * @constant reschedulingRequestSchema
 * @description Mongoose schema for the ReschedulingRequest collection
 * @property {mongoose.Schema.Types.ObjectId} CurrentBookingId - The reference to the current booking
 * @property {mongoose.Schema.Types.ObjectId} RequestedDateId - The reference to the requested date
 * @property {mongoose.Schema.Types.ObjectId} RequestedSlotId - The reference to the requested slot
 * @property {Object} timestamps - Auto-generated timestamps for the document
 */

const reschedulingRequestSchema: Schema<IReschedulingRequest> = new Schema(
  {
    CurrentBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    RequestedBy: {
      type: String,
      enum: Object.values(RequestedBy),
      required: true,
    },
    RequestedDateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Date",
      required: false,
    },
    RequestedSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: false,
    },
    ReschedulingId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    SelectedOption: {
      type: String,
      enum: Object.values(Options),
    },
    // expertId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Expert",
    // },
  },
  { timestamps: true }
);

/**
 * @constant ReschedulingRequest
 * @description Mongoose model for the ReschedulingRequest collection
 * @type {mongoose.Model<IReschedulingRequest>}
 */
const ReschedulingRequest = mongoose.model<IReschedulingRequest>(
  "ReschedulingRequest",
  reschedulingRequestSchema
);

export { ReschedulingRequest };
