import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for Admin
/**
 * Interface representing an Admin document in MongoDB.
 * @interface IAdmin
 * @extends {Document}
 * @property {string} name - The name of the admin.
 * @property {string} email - The email address of the admin.
 * @property {string} password - The hashed password of the admin.
 */

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

// Define the Mongoose schema for Admin
/**
 * Mongoose schema for Admin collection.
 * Contains fields for name, email, and password with required constraints.
 * Includes timestamps for createdAt and updatedAt fields.
 * @type {Schema<IAdmin>}
 */

const adminSchema: Schema<IAdmin> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create the Admin model using the IAdmin interface
/**
 * The Admin model based on the admin schema.
 * @typedef {Model<IAdmin>}
 */

const AdminSchema = mongoose.model<IAdmin>("Admin", adminSchema);

export default AdminSchema;
