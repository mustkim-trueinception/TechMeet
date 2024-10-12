import { SignupSchemaZod, LoginSchemaZod } from "./../schemas/AdminSchema";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import AdminSchema from "../models/AdminModel";
import { ReschedulingRequest } from "../models/RequestRescheduleModel";
import { authenticateJWT } from "../middleware/auth"; // Import the JWT authentication middleware

const router = express.Router();

/**
 * @route POST /signup
 * @group Admin - Operations about admin
 * @param {object} req.body - The admin signup data
 * @param {string} req.body.name.required - The name of the admin
 * @param {string} req.body.email.required - The email of the admin
 * @param {string} req.body.password.required - The password of the admin
 * @returns {object} 201 - Admin created successfully
 * @returns {Error} 409 - Admin already exists
 * @returns {Error} 400 - Bad request
 * @returns {Error} 500 - Internal server error
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validatedData = SignupSchemaZod.parse(req.body);
    const { name, email, password } = validatedData;

    const adminExists = await AdminSchema.findOne({ email });
    if (adminExists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await AdminSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route POST /login
 * @group Admin - Operations about admin
 * @param {object} req.body - The admin login data
 * @param {string} req.body.email.required - The email of the admin
 * @param {string} req.body.password.required - The password of the admin
 * @returns {object} 200 - Login successful
 * @returns {Error} 401 - Invalid email or password
 * @returns {Error} 400 - Bad request
 * @returns {Error} 500 - Internal server error
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const validatedData = LoginSchemaZod.parse(req.body);
    const { email, password } = validatedData;

    const admin = await AdminSchema.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route GET /admin/rescheduleRequests
 * @group Admin - Operations about admin
 * @description List all reschedule requests (for admin)
 * @access Admin
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {object} 200 - Rescheduling requests retrieved successfully
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.get(
  "/admin/rescheduleRequests",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const requests = await ReschedulingRequest.find()
        .populate({
          path: "CurrentBookingId",
          select: "_id", // Updated to _id
          populate: {
            path: "expertId",
            model: "Expert",
            select: "username",
          },
        })
        .populate({
          path: "RequestedDateId",
          select: "date", // Populate date details if needed
        })
        .populate({
          path: "RequestedSlotId",
          select: "_id", // Updated to _id
        });

      const formattedRequests = requests.map((request) => ({
        CurrentBookingId: request.CurrentBookingId,
        RequestedDateId: request.RequestedDateId,
        RequestedSlotId: request.RequestedSlotId,
      }));

      res.status(200).json({
        message: "Rescheduling requests retrieved successfully",
        list: formattedRequests,
      });
    } catch (error) {
      console.error("Error fetching reschedule requests:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export default router;
