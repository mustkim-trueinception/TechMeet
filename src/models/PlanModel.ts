import mongoose, { Document, Schema } from "mongoose";

/**
 * @interface IPlan
 * @extends Document
 * @description Interface representing a Plan document in MongoDB.
 * @property {string} name - The name of the plan.
 * @property {string} channel - The channel through which the plan will be executed (e.g., phone, video).
 * @property {number} duration - The duration of the plan in minutes.
 * @property {string} price - The price of the plan.
 * @property {string} bookingType - The type of booking (e.g., "appointment", "seminar").
 * @property {mongoose.Schema.Types.ObjectId} expertId - Reference to the associated expert.
 * @property {boolean} [isDedicated] - Optional field indicating if the plan is dedicated (default: false).
 */

export interface IPlan extends Document {
  name: string;
  channel: string;
  duration: number;
  price: string;
  bookingType: string; // "appointment", "seminar", etc.
  expertId: mongoose.Schema.Types.ObjectId; // Reference to Expert
  isDedicated?: boolean;
}

/**
 * @constant PlanSchema
 * @type {Schema}
 * @description Mongoose schema for the Plan model.
 * @property {string} name - The name of the plan (required).
 * @property {string} channel - The channel of the plan (required).
 * @property {number} duration - Duration of the plan in minutes (required).
 * @property {string} price - The price of the plan (required).
 * @property {string} bookingType - Type of the booking, either "appointment", "seminar", etc. (required).
 * @property {mongoose.Schema.Types.ObjectId} expertId - Reference to the Expert model (required).
 * @property {boolean} [isDedicated=false] - Indicates if the plan is dedicated (default: false).
 * @property {Date} createdAt - Automatically generated timestamp when the document is created.
 * @property {Date} updatedAt - Automatically generated timestamp when the document is updated.
 */

const PlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    channel: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: String, required: true },
    bookingType: { type: String, required: true }, // E.g., "appointment", "seminar"
    expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true }, // Reference to Expert model
    isDedicated: { type: Boolean, default: false }, // Default false
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * @constant Plan
 * @type {mongoose.Model<IPlan>}
 * @description Mongoose model for the Plan schema.
 */

export const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
