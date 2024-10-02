import { Request, Response } from 'express';
import { Slot } from '../models/SlotModel';
import { SlotSchemaZod } from '../schemas/SlotSchema';  // Import the Zod schema
import { z } from 'zod';
import express from 'express';

const router = express.Router();

// Define the routes for slots
 // Create a new slot
router.post('/slot/create',async (req: Request, res: Response) => {
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
      res.status(400).json({ error: error.message });
    }
  }
});

// Get all slots
router.get('/slots', async (req: Request, res: Response) => {
  try {
    const slots = await Slot.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

 // Get a slot by ID
router.get('/slot/:expert_Id', async (req: Request, res: Response) => {
  try {
    console.log(req.params.expert_Id);
    const slot = await Slot.find({expertId:req.params.expert_Id});
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});  

 // Update a slot by ID
router.put('/slot:id',async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod
    const parsedData = SlotSchemaZod.partial().parse(req.body);  // Allow partial updates

    const slot = await Slot.findByIdAndUpdate(req.params.id, parsedData, { new: true });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.status(200).json(slot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return Zod validation errors
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});     

 // Delete a slot by ID
router.delete('/slot:id', async (req: Request, res: Response) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});    

export default router;
