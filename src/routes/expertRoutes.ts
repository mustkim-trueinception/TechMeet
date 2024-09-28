// Experts route with jwt authentication
import express from 'express';
import { Expert } from '../models/Expert';
import { expertSchemaZod } from '../schemas/expertSchema';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/auth';
import { Request, Response } from 'express';
import { z } from 'zod';


const router = express.Router();

// Define the routes
// Create a new expert
router.post('/expert/create', async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const parsedData = expertSchemaZod.parse(req.body);

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

// Get all experts
router.get('/experts',async (req: Request, res: Response) => {
  try {
    const experts = await Expert.find();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an expert by ID          
router.get('/expert/:id',async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }
    res.status(200).json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an expert by ID   
router.put('/expert/:id', async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const parsedData = expertSchemaZod.partial().parse(req.body); // Allow partial updates

    const expert = await Expert.findByIdAndUpdate(req.params.id, parsedData, { new: true });
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
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

// Delete an expert by ID     
router.delete('/expert/:id', async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});  

export default router;
