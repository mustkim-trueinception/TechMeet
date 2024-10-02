import express, { Request, Response } from "express";
import { ReschedulingRequestSchemaZod } from "../schemas/RequestRescheduleSchema"; // Import Zod schema
import { ReschedulingRequest } from "../models/RequestRescheduleModel"; // Import Mongoose model
import { z } from "zod";

const router = express.Router();

// POST route to create a new rescheduling request
router.post("/reschedule", async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod schema
    const validatedData = ReschedulingRequestSchemaZod.parse(req.body);

    // Create a new rescheduling request
    const newReschedulingRequest = new ReschedulingRequest({
      CurrentBookingId: validatedData.CurrentBookingId,
      RequestedDateId: validatedData.RequestedDateId,
      RequestedSlotId: validatedData.RequestedSlotId,
      // ExpertId: validatedData.expertId,
    });

    // Save the rescheduling request to the database
    await newReschedulingRequest.save();

    // Send response with the required fields
    res.status(201).json({
      message: "Rescheduling request created successfully",
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
