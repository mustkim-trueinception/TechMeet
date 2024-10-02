// models/expert.model.ts

import mongoose, { Document, Schema } from "mongoose";
import { array } from "zod";

export interface IExpert extends Document {
  username: string;
  email: string;
  fullname: string;
  expertise: string;
  designation: string;
  description: string;
  avatar: string;
  coverPhoto: string;
  isAdmin: boolean;
  isActive: boolean;
}

const ExpertSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    expertise: { type: [String], required: true },
    designation: { type: String, required: true },
    description: { type: String, required: true },
    avatar: { type: String }, // URL to the avatar image
    coverPhoto: { type: String }, // URL to the cover photo
    availableCities: { type: [String], required: true },
    isAdmin: { type: Boolean, default: false }, // By default, not admin
    isActive: { type: Boolean, default: true }, // By default, active
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Expert = mongoose.model<IExpert>("Expert", ExpertSchema);
