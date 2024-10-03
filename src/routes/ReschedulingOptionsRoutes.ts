import express, { Request, Response } from "express";
import { ReschedulingOptions } from "../models/ReschedulingOptionsModel";
import { ReschedulingOptionsSchemaZod } from "../schemas/ReschedulingOptionsSchema"; // Import Zod validation schema
import { z } from "zod";

const router = express.Router();

/**
 * @route POST /reschedule-options
 * @group Rescheduling - Operations about rescheduling options
 * @param {Object} req.body - Rescheduling options object
 * @param {string} req.body.CurrentBookingId - The current booking ID.
 * @param {Array<Object>} req.body.availableSlots - The available rescheduling slots.
 * @param {string} req.body.availableSlots[].dateId - The ID of the date for the slot.
 * @param {string} req.body.availableSlots[].slotId - The ID of the available slot.
 * @returns {Object} 201 - Successfully created rescheduling options
 * @returns {Object} 400 - Validation errors
 * @returns {Object} 500 - Internal server error
 * @example
 * Example request
 * POST /reschedule-options
 * {
 *   "CurrentBookingId": "603d5b22d2f6e18f88f9a1c4",
 *   "availableSlots": [
 *     {
 *       "dateId": "603d5b22d2f6e18f88f9a1c5",
 *       "slotId": "603d5b22d2f6e18f88f9a1c6"
 *     },
 *     {
 *       "dateId": "603d5b22d2f6e18f88f9a1c7",
 *       "slotId": "603d5b22d2f6e18f88f9a1c8"
 *     },
 *     {
 *       "dateId": "603d5b22d2f6e18f88f9a1c9",
 *       "slotId": "603d5b22d2f6e18f88f9a1ca"
 *     }
 *   ]
 * }
 */
router.post("/reschedule-options", async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const validatedData = ReschedulingOptionsSchemaZod.parse(req.body);

    // Create a new rescheduling options entry
    const newReschedulingOptions = new ReschedulingOptions({
      currentBookingId: validatedData.CurrentBookingId,
      availableSlots: validatedData.availableSlots,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour expiry
    });
    await newReschedulingOptions.save();

    // Send response with the new rescheduling options
    res.status(201).json({
      message: "Rescheduling options created successfully",
      currentBookingId: newReschedulingOptions.CurrentBookingId,
      availableSlots: newReschedulingOptions.availableSlots,
      expiryDate: newReschedulingOptions.expiryDate,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
