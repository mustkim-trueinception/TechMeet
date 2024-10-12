import { Request, Response } from "express";
import { Slot } from "../models/SlotModel";
import { SlotSchemaZod } from "../schemas/SlotSchema"; // Import the Zod schema
import { authenticateJWT } from "../middleware/auth"; // Import JWT middleware
import { z } from "zod";
import express from "express";

const router = express.Router();

/**
 * @module SlotRouter
 * @description Express router for handling slot-related operations.
 */

/**
 * @route POST /slot/create
 * @group Slots - Operations about slots
 * @param {Slot} slot.body - Slot object to create
 * @returns {Slot} 201 - Created slot object
 * @returns {Error} 400 - Validation error
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 * @description Create a new slot.
 */
router.post(
  "/slot/create",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      // Validate the request body using Zod
      const parsedData = SlotSchemaZod.parse(req.body);

      const slot = new Slot(parsedData);
      await slot.save();
      res.status(201).json(slot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return Zod validation errors
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

/**
 * @route GET /slots
 * @group Slots - Operations about slots
 * @returns {Array.<Slot>} 200 - List of all slots
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - No slots found
 * @returns {Error} 500 - Internal server error
 * @description Retrieve all slots.
 */
router.get("/slots", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const slots = await Slot.find();
    if (!slots.length) {
      return res.status(404).json({ error: "No slots found" });
    }
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /slot/{expert_Id}
 * @group Slots - Operations about slots
 * @param {string} expert_Id.path.required - The expert ID to find the slot
 * @returns {Slot} 200 - Found slot object
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Slot not found
 * @returns {Error} 500 - Internal server error
 * @description Get a slot by expert ID.
 */
router.get(
  "/slot/:expert_Id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const slot = await Slot.find({ expertId: req.params.expert_Id });
      if (!slot.length) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.status(200).json(slot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /slot/{id}
 * @group Slots - Operations about slots
 * @param {string} id.path.required - The ID of the slot to update
 * @param {Slot} slot.body - Slot object with updated values
 * @returns {Slot} 200 - Updated slot object
 * @returns {Error} 400 - Validation error
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Slot not found
 * @returns {Error} 500 - Internal server error
 * @description Update a slot by ID.
 */
router.put(
  "/slot/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      // Validate the request body using Zod
      const parsedData = SlotSchemaZod.partial().parse(req.body); // Allow partial updates

      const slot = await Slot.findByIdAndUpdate(req.params.id, parsedData, {
        new: true,
      });
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.status(200).json({
        message: "Slot updated successfully",
        slot,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return Zod validation errors
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

/**
 * @route DELETE /slot/{id}
 * @group Slots - Operations about slots
 * @param {string} id.path.required - The ID of the slot to delete
 * @returns {204} 204 - No content (successful deletion)
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Slot not found
 * @returns {Error} 500 - Internal server error
 * @description Delete a slot by ID.
 */
router.delete(
  "/delete/slot/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const slot = await Slot.findByIdAndDelete(req.params.id);
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.status(204).json({
        message: "Slot deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
