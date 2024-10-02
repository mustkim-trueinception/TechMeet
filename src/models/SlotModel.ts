import mongoose, { Document, Schema } from "mongoose";

export interface ISlot extends Document {
  availability: string; // Available, Not available, etc.
  timing: string; // Time in "HH:MM" format
  period: string; // Morning, Afternoon, etc.
  planId: mongoose.Schema.Types.ObjectId; // Reference to the Plan model
  expertId: mongoose.Schema.Types.ObjectId; // Reference to the Expert model
}

const SlotSchema: Schema = new Schema(
  {
    availability: { type: String, required: true }, // Available, Not available
    timing: { type: String, required: true }, // Time in "HH:MM" format
    period: { type: String, required: true }, // Morning, Afternoon, etc.
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true }, // Reference to Plan model
    expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true }, // Reference to Expert model
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
