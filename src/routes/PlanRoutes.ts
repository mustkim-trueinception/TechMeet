import { Request, Response } from "express";
import { Plan } from "../models/PlanModel"; // Updated model import path
import { PlanSchemaZod } from "../schemas/PlanSchema"; // Zod validation schema
import { authenticateJWT } from "../middleware/auth"; // JWT middleware
import { z } from "zod";
import express from "express";

const router = express.Router();

/**
 * @route POST /plan/create
 * @description Create a new plan
 * @access Private
 * @param {Request} req - Express request object containing the new plan data in req.body
 * @param {Response} res - Express response object
 * @returns {Plan} 201 - Created plan object
 * @returns {Error} 400 - Validation error
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.post(
  "/plan/create",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      // Validate request data with Zod
      const parsedData = PlanSchemaZod.parse(req.body);

      const plan = new Plan(parsedData);
      await plan.save();
      res.status(201).json({ success: true, plan });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

/**
 * @route GET /plans/get
 * @description Get all plans
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object[]} 200 - List of all plans
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - No plans found
 * @returns {Error} 500 - Internal server error
 */
router.get(
  "/plans/get",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const plans = await Plan.find();
      if (!plans.length) {
        return res.status(404).json({ error: "No plans found" });
      }
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /plan/:expert_id
 * @description Get plans by expert ID
 * @access Private
 * @param {Request} req - Express request object containing expert_id in req.params
 * @param {Response} res - Express response object
 * @returns {Object[]} 200 - List of plans by expert ID
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - No plans found for this expert
 * @returns {Error} 500 - Internal server error
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
 * @route PUT /plan/:id
 * @description Update a plan by ID
 * @access Private
 * @param {Request} req - Express request object containing plan ID in req.params and updated data in req.body
 * @param {Response} res - Express response object
 * @returns {Plan} 200 - Updated plan object
 * @returns {Error} 400 - Validation error
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Plan not found
 * @returns {Error} 500 - Internal server error
 */
router.put(
  "/plan/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const parsedData = PlanSchemaZod.partial().parse(req.body); // Allow partial updates

      const plan = await Plan.findByIdAndUpdate(req.params.id, parsedData, {
        new: true,
      });
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.status(200).json({
        message: "Plan updated successfully",
        plan,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

/**
 * @route DELETE /plan/:id
 * @description Delete a plan by ID
 * @access Private
 * @param {Request} req - Express request object containing plan ID in req.params
 * @param {Response} res - Express response object
 * @returns {void} 204 - No content, plan deleted successfully
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - Plan not found
 * @returns {Error} 500 - Internal server error
 */
router.delete(
  "/plan/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const plan = await Plan.findByIdAndDelete(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.status(204).json({
        message: "Plan deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
