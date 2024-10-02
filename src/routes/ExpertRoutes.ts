// Experts route with jwt authentication
import express from 'express';
import { Expert, IExpert } from '../models/ExpertModel';
import { ExpertSchemaZod } from '../schemas/ExpertSchema';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/auth';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ReschedulingRequest, IReschedulingRequest } from '../models/RequestRescheduleModel'; // Import the Mongoose model
import { populate } from 'dotenv';
import mongoose from 'mongoose';
import { BookingSchema,Status } from '../models/BookingModel';

const router = express.Router();

// Define the routes
// Create a new expert
router.post('/expert/create', async (req: Request, res: Response) => {
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
    const parsedData = ExpertSchemaZod.partial().parse(req.body); // Allow partial updates

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



// GET route to list reschedule requests from guests (35:  working code)
router.get('/reschedule-request', async (req: Request, res: Response) => {
  try {
    // Fetch all rescheduling requests without populating the entire document
    const requests = await ReschedulingRequest.find();

    // Send the response with only the required fields
    const formattedRequests = requests.map(request => ({
      currentBookingID: request.CurrentBookingId, 
      requestedDateId: request.RequestedDateId,
      requestedSlotId: request.RequestedSlotId, 
    }));

    res.status(200).json({
      message: 'Rescheduling requests retrieved successfully',
      list: formattedRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});



// GET route to list reschedule requests by expert ID ( 34: only for admin orking code)
router.get('/reschedule-requests/:ExpertId', async (req: Request, res: Response) => {
  const { ExpertId } = req.params; // Extract expert ID from request parameters
  console.log(`Expert ID: ${ExpertId}`);

  try {
    // Check if the expert exists in the database
    const expert = await Expert.findById(ExpertId).select('username'); // Only select the username field
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Fetch rescheduling requests associated with the specified expert ID
    const requests = await ReschedulingRequest.find({ expertId: ExpertId }) // Ensure the expertId field exists in ReschedulingRequest schema
      .populate('Current_Booking_id') // Populate booking details if needed
      .populate('RequestedDateId') // Populate date details if needed
      .populate('RequestedSlotId'); // Populate slot details if needed

    // If no requests are found
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No reschedule requests found for this expert' });
    }

    // Format the response to include the necessary fields
    const formattedRequests = requests.map(request => ({
      currentBookingID: request.CurrentBookingId, // Include the booking ID or details
      requestedDateId: request.RequestedDateId, // Include the requested date
      requestedSlotId: request.RequestedSlotId, // Include the requested slot
      expertName: expert.username // Include the expert's username
    }));

    // Send the response
    res.status(200).json({
      message: 'Rescheduling requests retrieved successfully',
      list: formattedRequests, // Return the formatted requests
    });

  } catch (error) {
    console.error('Error fetching reschedule requests:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// GET route to list all reschedule requests (for admin)
router.get('/reschedule-requests', async (req: Request, res: Response) => {
  try {
    // Fetch all rescheduling requests and populate the expert's username
    const requests = await ReschedulingRequest.find()
      .populate({
        path: 'Current_Booking_id',
        populate: {
          path: 'expertId',
          model: 'Expert',
          select: 'username',
        },
      })
      .populate({
        path: 'RequestedDateId', // Populate date details if needed
      })
      .populate({
        path: 'RequestedSlotId', // Populate slot details if needed
      });
console.log(requests);

    // Format the response to include only the required fields
    const formattedRequests = requests.map(request => ({
      currentBookingID: request.CurrentBookingId, // Include the relevant fields
      requestedDateId: request.RequestedDateId,
      requestedSlotId: request.RequestedSlotId,
      // expertName: request.Current_Booking_id?.expertId?.username || null, // Use optional chaining and default to null
    }));

    res.status(200).json({
      message: 'Rescheduling requests retrieved successfully',
      list: formattedRequests, // Return the formatted data
    });
  } catch (error) {
    console.error('Error fetching reschedule requests:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Handle-Reschedule Requests
// POST route to handle expert reschedule requests
router.post('/handle-Reschedule', async (req: Request, res: Response) => {
  const { CurrentBookingId, RequestedDateId, RequestedSlotId, action, newDate } = req.body;

  try {
    // Check if the booking exists
    const booking = await BookingSchema.findById(CurrentBookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (action === 'accepted') {
      // Validate the requestedDateId and requestedSlotId
      if (!mongoose.Types.ObjectId.isValid(RequestedDateId) || !mongoose.Types.ObjectId.isValid(RequestedSlotId)) {
        return res.status(400).json({ message: 'Invalid date or slot ID' });
      }

      // Update the booking with new date and slot
      booking.dateId = RequestedDateId;
      booking.slotId = RequestedSlotId;
      booking.status = Status.RESCHEDULED; // Update the status using the enum

      await booking.save();

      // Optionally, delete the rescheduling request if it was accepted
      await ReschedulingRequest.deleteOne({ CurrentBookingId: CurrentBookingId });

      return res.status(200).json({
        message: 'Reschedule request accepted successfully',
        booking,
      });
    } else if (action === 'rejected') {
      // Optionally, delete the rescheduling request if it was rejected
      await ReschedulingRequest.deleteOne({ CurrentBookingId: CurrentBookingId });

      return res.status(200).json({
        message: 'Reschedule request rejected successfully',
      });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error handling reschedule request:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



export default router;
