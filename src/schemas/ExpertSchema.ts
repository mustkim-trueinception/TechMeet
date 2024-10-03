import { z } from "zod";

/**
 * Zod schema for validating expert data.
 * Defines the structure and validation rules for an expert entity.
 * 
 * @const ExpertSchemaZod
 * 
 * @property {string} username - The expert's unique username (at least 3 characters).
 * @property {string} email - The expert's email address (must be a valid email format).
 * @property {string} fullname - The expert's full name (at least 3 characters).
 * @property {string[]} expertise - An array representing the expert's areas of expertise (must have at least one element).
 * @property {string} designation - The expert's role or designation (at least 3 characters).
 * @property {string} description - A brief description of the expert's profile (at least 1 character).
 * @property {string} [avatar] - The URL to the expert's avatar image (optional, must be a valid URL if provided).
 * @property {string} [coverPhoto] - The URL to the expert's cover photo (optional, must be a valid URL if provided).
 * @property {string[]} availableCities - An array of cities where the expert is available (must have at least one city).
 * @property {boolean} [isAdmin] - A boolean indicating if the expert is an admin (optional).
 * @property {boolean} [isActive] - A boolean indicating if the expert is currently active (optional).
 */
export const ExpertSchemaZod = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(3, "Full name must be at least 3 characters long"),
  expertise: z
    .array(z.string())
    .min(1, "Expertise must have at least one element"),
  designation: z
    .string()
    .min(3, "Designation must be at least 3 characters long"),
  description: z.string().min(1, "Description must have at least one element"),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  coverPhoto: z.string().url("Cover photo must be a valid URL").optional(),
  availableCities: z.array(z.string()).min(1, "must have citys element"),
  isAdmin: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
