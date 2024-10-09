/**
 * @module ExpertRoutes
 * @requires express
 * @requires Expert
 * @requires ExpertSchemaZod
 * @requires jwt
 * @requires authenticateJWT
 * @requires z
 * @requires ReschedulingRequest
 * @requires mongoose
 * @requires BookingSchema
 */

import express from "express";
import { Expert, IExpert } from "../models/ExpertModel";
import { ExpertSchemaZod } from "../schemas/ExpertSchema";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middleware/auth";
import { Request, Response } from "express";
import { z } from "zod";
import {
  ReschedulingRequest,
  IReschedulingRequest,
} from "../models/RequestRescheduleModel"; // Import the Mongoose model
import { populate } from "dotenv";
import mongoose from "mongoose";
import { BookingSchema, Status } from "../models/BookingModel";

const router = express.Router();

/**
 * @route POST /expert/create
 * @description Create a new expert
 * @access Public
 * @param {Request} req - Express request object, with expert data in the body
 * @param {Response} res - Express response object, returns created expert or error
 */

router.post("/expert/create", async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const parsedData = ExpertSchemaZod.parse(req.body);

    const expert = new Expert(parsedData);
    await expert.save();
    res.status(201).json(expert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return Zod validation errors
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

/**
 * @route GET /experts
 * @description Get all experts
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object, returns all experts or error
 */

router.get("/experts", async (req: Request, res: Response) => {
  try {
    const experts = await Expert.find();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /guest/experts
 * @description Get all experts
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object, returns all experts or error
 */

router.get("/guest/experts", async (req: Request, res: Response) => {
  try {
    const experts = await Expert.find();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /expert/:id
 * @description Get an expert by ID
 * @access Public
 * @param {Request} req - Express request object, expert ID in the params
 * @param {Response} res - Express response object, returns expert or error
 */

router.get("/expert/:id", async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ error: "Expert not found" });
    }
    res.status(200).json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /expert/:id
 * @description Update an expert by ID
 * @access Public
 * @param {Request} req - Express request object, expert ID in the params, updated data in the body
 * @param {Response} res - Express response object, returns updated expert or error
 */

router.put("/expert/:id", async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const parsedData = ExpertSchemaZod.partial().parse(req.body); // Allow partial updates

    const expert = await Expert.findByIdAndUpdate(req.params.id, parsedData, {
      new: true,
    });
    if (!expert) {
      return res.status(404).json({ error: "Expert not found" });
    }
    res.status(200).json(expert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return Zod validation errors
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

/**
 * @route DELETE /expert/:id
 * @description Delete an expert by ID
 * @access Public
 * @param {Request} req - Express request object, expert ID in the params
 * @param {Response} res - Express response object, returns 204 on success or error
 */

router.delete("/expert/:id", async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({ error: "Expert not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /reschedule-request
 * @description List all reschedule requests from guests
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object, returns reschedule requests
 */

router.get(
  "/expert/rescheduleRequests",
  async (req: Request, res: Response) => {
    try {
      // Fetch all rescheduling requests without populating the entire document
      const requests = await ReschedulingRequest.find();

      // Send the response with only the required fields
      const formattedRequests = requests.map((request) => ({
        CurrentBookingId: request.CurrentBookingId,
        RequestedDateId: request.RequestedDateId,
        RequestedSlotId: request.RequestedSlotId,
      }));

      res.status(200).json({
        message: "Rescheduling requests retrieved successfully",
        list: requests,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

/**
 * @route GET /reschedule-requests/:ExpertId
 * @description List reschedule requests by expert ID
 * @access Public
//  * @param {Request} req - Express request object, expert ID in the params
//  * @param {Response} res - Express response object, returns reschedule requests for the expert
 */

router.get("/Requests/:ExpertId", async (req: Request, res: Response) => {
  const ExpertId = req.params.ExpertId; // Extract expert ID from request parameters

  try {
    // Check if the expert exists in the database
    const expert = await Expert.findById(ExpertId).select("username"); // Only select the username field
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Fetch rescheduling requests associated with the specified expert ID
    const requests = await ReschedulingRequest.find() // Ensure the expertId field exists in ReschedulingRequest schema
      .populate({
        path: "CurrentBookingId",
        select: "_Id",
        populate: {
          path: "expertId",
          model: "Expert",
          select: "username",
        },
      })
      .populate("RequestedDateId") // Populate date details if needed
      .populate("RequestedSlotId"); // Populate slot details if needed

    // If no requests are found
    if (requests.length === 0) {
      return res
        .status(404)
        .json({ message: "No reschedule requests found for this expert" });
    }

    // Format the response to include the necessary fields
    const formattedRequests = requests.map((request) => ({
      CurrentBookingId: request.CurrentBookingId, // Include the booking ID or details
      RequestedDateId: request.RequestedDateId, // Include the requested date
      RequestedSlotId: request.RequestedSlotId, // Include the requested slot
      ExpertName: expert.username, // Include the expert's username
    }));

    // Send the response
    res.status(200).json({
      message: "Rescheduling requests retrieved successfully",
      list: formattedRequests, // Return the formatted requests
    });
  } catch (error) {
    console.error("Error fetching reschedule requests:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/**
 * @route POST /handle-Reschedule
 * @description Handle expert reschedule requests
 * @access Public
 * @param {Request} req - Express request object, including reschedule data
 * @param {Response} res - Express response object, returns success or error
 */

router.post("/handle-Reschedule", async (req: Request, res: Response) => {
  const { CurrentBookingId, RequestedDateId, RequestedSlotId, action } =
    req.body;

  try {
    // Check if the booking exists
    const booking = await BookingSchema.findById(CurrentBookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (action === "accepted") {
      // Validate the requested date and slot IDs
      if (
        !mongoose.Types.ObjectId.isValid(RequestedDateId) ||
        !mongoose.Types.ObjectId.isValid(RequestedSlotId)
      ) {
        return res.status(400).json({ message: "Invalid date or slot ID" });
      }

      // Nayi booking create karna using existing booking details and updated fields
      const newBookingData = {
        ...booking.toObject(), // Saari fields copy karo existing booking se
        dateId: RequestedDateId,
        slotId: RequestedSlotId,
        status: Status.RESCHEDULED, // Valid status value set karo
        rescheduledBookingId: CurrentBookingId, // Reference to the old booking
      };
      delete newBookingData._id; // Remove the existing _id from the new booking data
      // Nayi booking create karo
      const newBooking = await BookingSchema.create(newBookingData);

      // Purani booking ko delete karo
      await BookingSchema.findByIdAndDelete(CurrentBookingId);

      // Optionally, rescheduling request delete karo
      await ReschedulingRequest.deleteOne({ CurrentBookingId });

      // Success response bhejo
      return res.status(200).json({
        message: "Reschedule request accepted successfully",
        booking: newBooking,
      });
    } else if (action === "rejected") {
      // Rescheduling request delete karo
      await ReschedulingRequest.deleteOne({ CurrentBookingId });

      // Success response bhejo
      return res.status(200).json({
        message: "Reschedule request rejected successfully",
      });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling reschedule request:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export default router;
