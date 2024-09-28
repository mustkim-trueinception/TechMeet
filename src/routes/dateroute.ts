// routes/date.routes.ts

import express from 'express';
import { Request, Response } from 'express';
import { DateModel } from '../models/date';  // Updated import path
import { dateSchemaZod } from '../schemas/dateSchema';  // Zod validation schema
import { z } from 'zod';


const router = express.Router();

// Define the routes for dates

        // Create a new date entry
router.post('/date/create', async (req: Request, res: Response) => {
  try {
    // Validate request data with Zod
    const parsedData = dateSchemaZod.parse(req.body);

    const dateEntry = new DateModel(parsedData);
    await dateEntry.save();
    res.status(201).json(dateEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return Zod validation errors
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}); 
 
         // Get all date entries
router.get('/dates', async (req: Request, res: Response) => {
  try {
    const dates = await DateModel.find().populate('expertId').populate('slots');
    res.status(200).json(dates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

 // Get a date entry by ID
router.get('/date/:expertid', async (req: Request, res: Response) => {
  try {
    const dateEntry = await DateModel.find({expertId: req.params.id});
    if (!dateEntry) {
      return res.status(404).json({ error: 'Date entry not found' });
    }
    res.status(200).json(dateEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});      

     // Update a date entry by ID
router.put('/:id',  async (req: Request, res: Response) => {
  try {
    // Validate request data with Zod (allow partial updates)
    const parsedData = dateSchemaZod.partial().parse(req.body);

    const dateEntry = await DateModel.findByIdAndUpdate(req.params.id, parsedData, { new: true });
    if (!dateEntry) {
      return res.status(404).json({ error: 'Date entry not found' });
    }
    res.status(200).json(dateEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});   

 // Delete a date entry by ID

router.delete('/:date_Id', async (req: Request, res: Response) => {
  try {
    const dateEntry = await DateModel.findByIdAndDelete(req.params.date_Id);
    if (!dateEntry) {
      return res.status(404).json({ error: 'Date entry not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});    
export default router;
