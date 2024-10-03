import { BookingSchemaZod } from "../schemas/BookingSchema";
import express, { Request, Response } from "express";
import { BookingSchema, IBooking } from "../models/BookingModel"; // Import Mongoose Booking model
import { date, z } from "zod";

const router = express.Router();

/**
 * @typedef {Object} BookingResponse
 * @property {string} guestName - Name of the guest.
 * @property {string} dateId - The ID of the selected date.
 * @property {("Student" | "Businessperson" | "Working Professional")} guestOccupation - Occupation of the guest.
 * @property {number} guestAge - Age of the guest.
 * @property {string} guestCity - City of the guest.
 * @property {string} guestEmail - Email of the guest.
 * @property {string} guestPhone - Phone number of the guest.
 * @property {string} guestWhatsapp - WhatsApp number of the guest.
 * @property {string} guestWebsite - Website of the guest.
 * @property {string} guestProblem - Problem or issue reported by the guest.
 * @property {string | undefined} guestVoiceNotes - Optional voice note from the guest.
 * @property {Array<string>} tags - Array of tags associated with the booking.
 * @property {boolean} guestKYC - Indicates if KYC is completed.
 * @property {string} expertId - MongoDB ObjectId of the expert.
 * @property {string} slotId - MongoDB ObjectId of the slot.
 * @property {("Pending" | "Completed" | "Cancelled" | "Rescheduled")} status - Status of the booking.
 */

/**
 * POST route for booking an appointment.
 * 
 * @route POST /book-appointment
 * @group Booking - Operations about booking appointments
 * @param {Object} req - Express request object.
 * @param {BookingResponse} req.body - The data for booking an appointment.
 * @returns {Object} 201 - Successfully created booking.
 * @returns {Object} 400 - Validation error details.
 * @returns {Object} 500 - Internal server error.
 */
router.post("/book-appointment", async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod schema
    const validatedData = BookingSchemaZod.parse(req.body);

    // Create new Booking with validated data
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
      expertId: validatedData.expertId, // This should be an array of experts
      slotId: validatedData.slotId,
      status: validatedData.status,
    });

    // Save the booking to the database
    await newBooking.save();

    // Respond with only the required fields
    res.status(201).json({
      guestName: newBooking.guestName,
      dateId: newBooking.dateId,
      guestOccupation: newBooking.guestOccupation,
      guestAge: newBooking.guestAge,
      guestCity: newBooking.guestCity,
      guestEmail: newBooking.guestEmail,
      guestPhone: newBooking.guestPhone,
      guestWhatsapp: newBooking.guestWhatsapp,
      guestWebsite: newBooking.guestWebsite,
      guestProblem: newBooking.guestProblem,
      guestVoiceNotes: newBooking.guestVoiceNote,
      tags: newBooking.tags,
      guestKYC: newBooking.guestKYC,
      expertId: newBooking.expertId,
      slotId: newBooking.slotId,
      status: newBooking.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error", error });
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
const updateGuestSchema = z.object({
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
 * @returns {Object} 404 - Booking not found.
 * @returns {Object} 400 - Validation error details.
 * @returns {Object} 500 - Internal server error.
 */
router.put("/booking/modify", async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod schema
    const validatedData = updateGuestSchema.parse(req.body);

    // Find the booking by ID and update guest data
    const updatedBooking = await BookingSchema.findByIdAndUpdate(
      validatedData.booking_id,
      {
        $set: {
          guestPhone: validatedData.guestPhone,
          guestEmail: validatedData.guestEmail,
          guestName: validatedData.guestName, // Changed from guestUsername to guestName
        },
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Send a success response with updated booking data
    res.status(200).json({
      message: "Guest data updated successfully",
      updatedBooking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
