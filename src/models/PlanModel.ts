import mongoose, { Document, Schema } from "mongoose";

export interface IPlan extends Document {
  name: string;
  channel: string;
  duration: number;
  price: string;
  bookingType: string; // "appointment", "seminar", etc.
  expertId: mongoose.Schema.Types.ObjectId; // Reference to Expert
  isDedicated?: boolean;
}

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

export const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
