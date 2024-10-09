import express, { Request, Response } from "express";
import { ReschedulingRequestSchemaZod } from "../schemas/RequestRescheduleSchema";
import { ReschedulingRequest } from "../models/RequestRescheduleModel";
import { z } from "zod";

const router = express.Router();

/**
 * @route POST /reschedule
 * @group Rescheduling - Operations related to rescheduling requests
 * @param {object} req.body - The request body containing rescheduling request data
 * @param {string} req.body.CurrentBookingId - The ID of the current booking (must be a valid ObjectId)
 * @param {string} req.body.RequestedDateId - The ID of the requested new date (must be a valid ObjectId)
 * @param {string} req.body.RequestedSlotId - The ID of the requested new slot (must be a valid ObjectId)
 * @returns {object} 201 - Rescheduling request created successfully
 * @returns {object} 400 - Bad request, rescheduling request already exists or validation errors
 * @returns {object} 500 - Internal server error
 * @example
 * Request body example
 * {
 *   "CurrentBookingId": "5f50c31b52bdbb0012d95a5f",
 *   "RequestedDateId": "5f50c31b52bdbb0012d95a60",
 *   "RequestedSlotId": "5f50c31b52bdbb0012d95a61"
 * }
 */

router.post("/reschedule", async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod schema
    const validatedData = ReschedulingRequestSchemaZod.parse(req.body);
    console.log(validatedData);

    // Check if the rescheduling request already exists
    const reschedulingRequestExists = await ReschedulingRequest.findOne({
      CurrentBookingId: validatedData.CurrentBookingId,
      RequestedDateId: validatedData.RequestedDateId,
      RequestedSlotId: validatedData.RequestedSlotId,
    });
    if (reschedulingRequestExists) {
      return res.status(400).json({
        message: "Rescheduling request already exists",
      });
    }
    // Create a new rescheduling request
    const newReschedulingRequest = new ReschedulingRequest({
      CurrentBookingId: validatedData.CurrentBookingId,
      RequestedBy: validatedData.RequestedBy,
      RequestedDateId: validatedData.RequestedDateId,
      RequestedSlotId: validatedData.RequestedSlotId,
      ReschedulingId: validatedData.ReschedulingId,
      SelectedOption: validatedData.SelectedOption,
      // ExpertId: validatedData.expertId,
    });
    await newReschedulingRequest.save();
    res.status(201).json({
      message: "Rescheduling request created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
