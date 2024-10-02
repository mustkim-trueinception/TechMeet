import express, { Request, Response } from 'express';
import { ReschedulingOptions } from '../models/ReschedulingOptionsModel';
import { ReschedulingOptionsSchemaZod } from '../schemas/ReschedulingOptionsSchema'; // Import Zod validation schema
import { z } from 'zod';

const router = express.Router();

// POST route to create rescheduling options
router.post('/reschedule-options', async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const validatedData = ReschedulingOptionsSchemaZod.parse(req.body);

    // Create a new rescheduling options entry
    const newReschedulingOptions = new ReschedulingOptions({
      currentBookingId: validatedData.currentBookingId,
      availableSlots: validatedData.availableSlots,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour expiry
    });

    // Save to the database
    await newReschedulingOptions.save();

    // Send response with the new rescheduling options
    res.status(201).json({
      message: 'Rescheduling options created successfully',
      currentBookingId: newReschedulingOptions.currentBookingId,
      availableSlots: newReschedulingOptions.availableSlots,
      expiryDate: newReschedulingOptions.expiryDate,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error', error });
  }
});

export default router;
