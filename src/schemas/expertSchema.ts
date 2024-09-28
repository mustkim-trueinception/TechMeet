import { z } from 'zod';

// Zod schema for expert validation
export const expertSchemaZod = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(3, "Full name must be at least 3 characters long"),
  expertise:  z.array(z.string()).min(1, "Expertise must have at least one element"),
  designation: z.string().min(3, "Designation must be at least 3 characters long"),
  description: z.string().min(1, "Description must have at least one element"),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  coverPhoto: z.string().url("Cover photo must be a valid URL").optional(),
  availableCities: z.array(z.string()).min(1, "must have citys element"),
  isAdmin: z.boolean().optional(),
  isActive: z.boolean().optional()
});
