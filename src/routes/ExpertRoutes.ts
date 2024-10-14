import express from "express";
import { Expert, IExpert } from "../models/ExpertModel";
import { ExpertSchemaZod } from "../schemas/ExpertSchema";
import { authenticateJWT } from "../middleware/auth";
import { Request, Response } from "express";
import { z } from "zod";
import {
  ReschedulingRequest,
  IReschedulingRequest,
} from "../models/RequestRescheduleModel";
import mongoose from "mongoose";
import { BookingSchema, Status } from "../models/BookingModel";

const router = express.Router();

/**
 * @route POST /expert/create
 * @description Create a new expert
 * @access Private
 * @param {Request} req - Express request object, with expert data in the body
 * @param {Response} res - Express response object, returns created expert or error
 * @returns {Expert} 201 - Created expert
 * @returns {Error} 400 - Validation or request error
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.post(
  "/expert/create",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const parsedData = ExpertSchemaZod.parse(req.body);
      const expert = new Expert(parsedData);
      await expert.save();
      res.status(201).json(expert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
);

/**
 * @route GET /experts
 * @description Get all experts
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object, returns all experts or error
 * @returns {Expert[]} 200 - List of experts
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.get("/experts", authenticateJWT, async (req: Request, res: Response) => {
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
 * @returns {Expert[]} 200 - List of experts
 * @returns {Error} 500 - Internal server error
 */
router.get("/guest/experts", async (req: Request, res: Response) => {
  try {
    const experts = await Expert.find()
      .select(
        "username fullname expertise designation description avatar coverPhoto"
      )
      .lean(); // Ensures no extra fields or metadata;
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /expert/:id
 * @description Get an expert by ID
 * @access Private
 * @param {Request} req - Express request object, expert ID in the params
 * @param {Response} res - Express response object, returns expert or error
 * @returns {Expert} 200 - Expert object
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Expert not found
 * @returns {Error} 500 - Internal server error
 */
router.get(
  "/expert/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const expert = await Expert.findById(req.params.id);
      if (!expert) {
        return res.status(404).json({ error: "Expert not found" });
      }
      res.status(200).json(expert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /expert/:id
 * @description Get an expert by ID
 * @access Private
 * @param {Request} req - Express request object, expert ID in the params
 * @param {Response} res - Express response object, returns expert or error
 * @returns {Expert} 200 - Expert object
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Expert not found
 * @returns {Error} 500 - Internal server error
 */
router.get("/user/expert/:id", async (req: Request, res: Response) => {
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
 * @access Private
 * @param {Request} req - Express request object, expert ID in the params, updated data in the body
 * @param {Response} res - Express response object, returns updated expert or error
 * @returns {Expert} 200 - Updated expert
 * @returns {Error} 400 - Validation or request error
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Expert not found
 * @returns {Error} 500 - Internal server error
 */
router.put(
  "/expert/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const parsedData = ExpertSchemaZod.partial().parse(req.body);
      const expert = await Expert.findByIdAndUpdate(req.params.id, parsedData, {
        new: true,
      });
      if (!expert) {
        return res.status(404).json({ error: "Expert not found" });
      }
      res.status(200).json(expert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
);

/**
 * @route DELETE /expert/:id
 * @description Delete an expert by ID
 * @access Private
 * @param {Request} req - Express request object, expert ID in the params
 * @param {Response} res - Express response object, returns 204 on success or error
 * @returns {void} 204 - No content
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Expert not found
 * @returns {Error} 500 - Internal server error
 */
router.delete(
  "/expert/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const expert = await Expert.findByIdAndDelete(req.params.id);
      if (!expert) {
        return res.status(404).json({ error: "Expert not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /expert/rescheduleRequests
 * @description List all reschedule requests from guests
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object, returns reschedule requests
 * @returns {ReschedulingRequest[]} 200 - List of reschedule requests
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.get(
  "/expert/rescheduleRequests",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const requests = await ReschedulingRequest.find();
      res.status(200).json({
        message: "Rescheduling requests retrieved successfully",
        list: requests,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

export default router;
