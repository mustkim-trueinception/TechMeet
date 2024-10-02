import { BookingSchemaZod } from "../schemas/BookingSchema";
import express, { Request, Response } from "express";
import { BookingSchema, IBooking } from "../models/BookingModel"; // Import Mongoose Booking model
import { date, z } from "zod";

const router = express.Router();

// POST route for booking
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

export default router;

// Zod validation schema for updating guest data
const updateGuestSchema = z.object({
  booking_id: z.string().nonempty({ message: "Booking ID is required" }),
  guestPhone: z.string().nonempty({ message: "Phone number is required" }),
  guestEmail: z.string().email({ message: "Valid email is required" }),
  guestName: z.string().nonempty({ message: "Guest name is required" }),
});

// PUT route to modify guest data
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
