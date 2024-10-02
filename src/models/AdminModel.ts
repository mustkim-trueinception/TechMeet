import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for Admin
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

// Define the Mongoose schema for Admin
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
const AdminSchema = mongoose.model<IAdmin>("Admin", adminSchema);

export default AdminSchema;
