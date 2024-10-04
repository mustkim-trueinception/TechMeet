import { Request, Response } from "express";
import { Plan } from "../models/PlanModel"; // Updated model import path
import { PlanSchemaZod } from "../schemas/PlanSchema"; // Zod validation schema
import { z } from "zod";
import express from "express";

const router = express.Router();

/**
 * @route POST /plan/create
 * @description Create a new plan
 * @access Public
 * @param {Request} req - Express request object containing the new plan data in req.body
 * @param {Response} res - Express response object
 * @returns {Object} Created plan or validation errors
 */

router.post("/plan/create", async (req: Request, res: Response) => {
  try {
    // Validate request data with Zod
    const parsedData = PlanSchemaZod.parse(req.body);

    const plan = new Plan(parsedData);
    await plan.save();
    res.status(201).json(plan);
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
 * @route GET /plans/get
 * @description Get all plans
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object[]} List of all plans or error message
 */

router.get("/plans/get", async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /plan/:expert_id
 * @description Get plans by expert ID
 * @access Public
 * @param {Request} req - Express request object containing expert_id in req.params
 * @param {Response} res - Express response object
 * @returns {Object[]} List of plans or error message
 */

router.get("/plan/:expert_id", async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find({ expertId: req.params.expert_id });
    if (!plans || plans.length === 0) {
      return res.status(404).json({ error: "No plans found for this expert" });
    }
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /:id
 * @description Update a plan by ID
 * @access Public
 * @param {Request} req - Express request object containing plan ID in req.params and updated data in req.body
 * @param {Response} res - Express response object
 * @returns {Object} Updated plan or error message
 */

router.put("/:id", async (req: Request, res: Response) => {
  try {
    // Validate request data using Zod
    const parsedData = PlanSchemaZod.partial().parse(req.body); // Allow partial updates

    const plan = await Plan.findByIdAndUpdate(req.params.id, parsedData, {
      new: true,
    });
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

/**
 * @route DELETE /:id
 * @description Delete a plan by ID
 * @access Public
 * @param {Request} req - Express request object containing plan ID in req.params
 * @param {Response} res - Express response object
 * @returns {void} No content or error message
 */

router.delete("/plan/:id", async (req: Request, res: Response) => {  // /api/v1/plan => added
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(204).json({
      message: "Plan deleted successfully",   // message added for the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
