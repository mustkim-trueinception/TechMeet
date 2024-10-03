import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing an expert in the system.
 * @interface IExpert
 * @extends {Document}
 *
 * @property {string} username - The unique username of the expert.
 * @property {string} email - The email address of the expert.
 * @property {string} fullname - The full name of the expert.
 * @property {string[]} expertise - The areas of expertise of the expert.
 * @property {string} designation - The designation or role of the expert (e.g., CTO, CMO, SA).
 * @property {string} description - A brief description of the expert's profile.
 * @property {string} avatar - URL to the expert's avatar image.
 * @property {string} coverPhoto - URL to the expert's cover photo.
 * @property {boolean} isAdmin - Indicates if the expert is an admin (default: false).
 * @property {boolean} isActive - Indicates if the expert is currently active (default: true).
 * @property {string[]} availableCities - The cities where the expert is available.
 */
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

/**
 * Mongoose schema for the Expert model.
 * Defines the structure of expert documents stored in MongoDB.
 * @const ExpertSchema
 *
 * @property {string} username - The unique username of the expert (required, unique).
 * @property {string} email - The email address of the expert (required, unique).
 * @property {string} fullname - The full name of the expert (required).
 * @property {string[]} expertise - An array of areas of expertise (required).
 * @property {string} designation - The designation or role of the expert (required).
 * @property {string} description - A brief description of the expert's profile (required).
 * @property {string} avatar - URL to the avatar image (optional).
 * @property {string} coverPhoto - URL to the cover photo (optional).
 * @property {string[]} availableCities - An array of cities where the expert is available (required).
 * @property {boolean} isAdmin - Boolean indicating if the expert is an admin (default: false).
 * @property {boolean} isActive - Boolean indicating if the expert is currently active (default: true).
 */
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
