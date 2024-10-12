import { BookingSchemaZod } from "../schemas/BookingSchema";
import express, { Request, Response } from "express";
import { BookingSchema, IBooking } from "../models/BookingModel"; // Import Mongoose Booking model
import { date, z } from "zod";
import { authenticateJWT  } from "../middleware/auth";

const router = express.Router();

/**
 * POST route for booking an appointment.
 * 
 * @route POST /book-appointment
 * @group Booking - Operations about booking appointments
 * @param {Object} req - Express request object.
 * @param {BookingResponse} req.body - The data for booking an appointment.
 * @returns {Object} 201 - Successfully created booking.
 * @returns {Object} 400 - Validation error details.
 * @returns {Object} 401 - Unauthorized, invalid token.
 * @returns {Object} 403 - No token provided.
 * @returns {Object} 500 - Internal server error.
 */
router.post("/book-appointment", async (req: Request, res: Response) => {
  try {
    const validatedData = BookingSchemaZod.parse(req.body);

    const newBooking = new BookingSchema({
      guestName: validatedData.guestName,
      dateId: validatedData.dateId,
      guestOccupation: validatedData.guestOccupation,
      guestAge: validatedData.guestAge,
      guestCity: validatedData.guestCity,
      guestEmail: validatedData.guestEmail,
      guestPhone: validatedData.guestPhone,
      guestWhatsapp: validatedData.guestWhatsapp,
      guestProblem: validatedData.guestProblem,
      guestVoiceNote: validatedData.guestVoiceNote,
      tags: validatedData.tags,
      guestKYC: validatedData.guestKYC,
      expertId: validatedData.expertId,
      slotId: validatedData.slotId,
      status: validatedData.status,
    });
    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error"});
  }
});


/**
 * Zod validation schema for updating guest data.
 * 
 * @typedef {Object} UpdateGuestData
 * @property {string} booking_id - The ID of the booking to update.
 * @property {string} guestPhone - New phone number of the guest.
 * @property {string} guestEmail - New email of the guest.
 * @property {string} guestName - New name of the guest.
 */
export const updateGuestSchema = z.object({
  booking_id: z.string().nonempty({ message: "Booking ID is required" }),
  guestPhone: z.string().nonempty({ message: "Phone number is required" }),
  guestEmail: z.string().email({ message: "Valid email is required" }),
  guestName: z.string().nonempty({ message: "Guest name is required" }),
});


/**
 * PUT route to modify guest data.
 * 
 * @route PUT /booking/modify
 * @group Booking - Operations about booking appointments
 * @param {Object} req - Express request object.
 * @param {UpdateGuestData} req.body - The data for updating guest information.
 * @returns {Object} 200 - Successfully updated booking data.
 * @returns {Object} 400 - Validation error details.
 * @returns {Object} 401 - Unauthorized, invalid token.
 * @returns {Object} 403 - No token provided.
 * @returns {Object} 404 - Booking not found.
 * @returns {Object} 500 - Internal server error.
 */
router.put("/booking/modify", authenticateJWT,async (req: Request, res: Response) => {
  try {
    const validatedData = updateGuestSchema.parse(req.body);

    const updatedBooking = await BookingSchema.findByIdAndUpdate(
      validatedData.booking_id,
      {
        $set: {
          guestPhone: validatedData.guestPhone,
          guestEmail: validatedData.guestEmail,
          guestName: validatedData.guestName,
        },
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({
      message: "Guest data updated successfully",
      updatedBooking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
