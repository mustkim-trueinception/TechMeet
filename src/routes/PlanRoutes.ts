import { Request, Response } from "express";
import { Plan } from "../models/PlanModel"; // Updated model import path
import { PlanSchemaZod } from "../schemas/PlanSchema"; // Zod validation schema
import { z } from "zod";
// routes/plan.routes.ts

import express from "express";

const router = express.Router();

// Define the routes for the plans
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
}); // Create a new plan

router.get("/plans/get", async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); // Get all plans

//router.get('/:id', getPlanById);        // Get a plan by ID
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
}); // Get a plan by ID

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
}); // Update a plan by ID

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); // Delete a plan by ID

export default router;
