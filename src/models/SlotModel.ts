import mongoose, { Document, Schema } from "mongoose";

/**
 * @interface ISlot
 * @extends Document
 * @description Represents a slot in the scheduling system.
 * @property {string} availability - Indicates if the slot is available or not (e.g., Available, Not available).
 * @property {string} timing - The time of the slot in "HH:MM" format.
 * @property {string} period - The period of the day (e.g., Morning, Afternoon, Night).
 * @property {mongoose.Schema.Types.ObjectId} planId - Reference to the associated Plan model.
 * @property {mongoose.Schema.Types.ObjectId} expertId - Reference to the associated Expert model.
 */

export interface ISlot extends Document {
  availability: string;
  timing: string;
  period: string;
  planId: mongoose.Schema.Types.ObjectId;
  expertId: mongoose.Schema.Types.ObjectId
}

/**
 * @constant SlotSchema
 * @type {Schema}
 * @description Defines the Mongoose schema for the Slot model.
 * @property {Object} availability - The availability status of the slot.
 * @property {string} availability.type - The type of the field, should be a string.
 * @property {boolean} availability.required - Indicates that the field is required.
 * @property {Object} timing - The timing of the slot.
 * @property {string} timing.type - The type of the field, should be a string.
 * @property {boolean} timing.required - Indicates that the field is required.
 * @property {Object} period - The period of the day for the slot.
 * @property {string} period.type - The type of the field, should be a string.
 * @property {boolean} period.required - Indicates that the field is required.
 * @property {Object} planId - Reference to the Plan model.
 * @property {ObjectId} planId.type - The type of the field, should be a Schema.Types.ObjectId.
 * @property {string} planId.ref - The model that this ID references (Plan).
 * @property {boolean} planId.required - Indicates that the field is required.
 * @property {Object} expertId - Reference to the Expert model.
 * @property {ObjectId} expertId.type - The type of the field, should be a Schema.Types.ObjectId.
 * @property {string} expertId.ref - The model that this ID references (Expert).
 * @property {boolean} expertId.required - Indicates that the field is required.
 * @property {Object} timestamps - Automatically adds createdAt and updatedAt fields.
 */

const SlotSchema: Schema = new Schema(
  {
    availability: { type: String, required: true },
    timing: { type: String, required: true },
    period: { type: String, required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
