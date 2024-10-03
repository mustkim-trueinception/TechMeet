import { populate } from "dotenv";
import mongoose, { Document, Schema } from "mongoose";

/**
 * Enum for date availability status.
 * @enum {string}
 */
enum Availability {
  holiday = "holiday",
  available = "available",
  not_available = "not available",
  booked = "booked",
}


/**
 * Interface representing a Date document in MongoDB.
 * @interface IDate
 * @extends {Document}
 * @property {string} date - The date in "DD/MM/YYYY" format.
 * @property {Availability} availability - The availability status of the date.
 * @property {mongoose.Schema.Types.ObjectId} expertId - Reference to the expert associated with the date.
 * @property {mongoose.Schema.Types.ObjectId[]} slotsId - Array of references to the Slot model.
 */
export interface IDate extends Document {
  date: string; // Date in "DD/MM/YYYY" format
  availability: Availability;
  expertId: mongoose.Schema.Types.ObjectId;
  slotsId: mongoose.Schema.Types.ObjectId[]; // Array of references to Slot model
}


/**
 * Schema for the Date model.
 * @type {Schema}
 * @property {string} date - The date in "DD/MM/YYYY" format.
 * @property {Availability} availability - The availability status of the date.
 * @property {mongoose.Schema.Types.ObjectId} expertId - Reference to the expert associated with the date.
 * @property {mongoose.Schema.Types.ObjectId[]} slotsId - Array of references to the Slot model.
 * @property {Date} createdAt - Timestamp when the document was created.
 * @property {Date} updatedAt - Timestamp when the document was last updated.
 */
const DateSchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    availability: {
      type: String,
      enum: Object.values(Availability),
      required: true,
    },
    expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
    slotsId: [{ type: Schema.Types.ObjectId, ref: "Slot" }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const DateModel = mongoose.model<IDate>("Date", DateSchema);
