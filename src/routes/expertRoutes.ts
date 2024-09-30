// Experts route with jwt authentication
import express from 'express';
import { Expert, IExpert } from '../models/Expert';
import { expertSchemaZod } from '../schemas/expertSchema';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/auth';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ReschedulingRequest, IReschedulingRequest } from '../models/requestReschedule'; // Import the Mongoose model


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



// GET route to list reschedule requests from guests
router.get('/reschedule-request', async (req: Request, res: Response) => {
  try {
    // Fetch all rescheduling requests without populating the entire document
    const requests = await ReschedulingRequest.find();

    // Send the response with only the required fields
    const formattedRequests = requests.map(request => ({
      currentBookingID: request.Current_Booking_id, 
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


// GET route to list reschedule requests by expert ID
router.get('/reschedule-request/:expertId', async (req: Request, res: Response) => {
  const { expertId } = req.params; // Extract expert ID from request parameters
  console.log(`Expert ID: ${expertId}`);

  try {
    // Fetch rescheduling requests for the specified expert and populate the expert's name
    const requests = await ReschedulingRequest.find({ expertId }) // Assuming you have an expertId in ReschedulingRequest schema
      .populate({
        path: 'Current_Booking_id', // Populate booking details if needed
      })
      .populate({
        path: 'RequestedDateId', // Populate date details if needed
      })
      .populate({
        path: 'RequestedSlotId', // Populate slot details if needed
      })
      .populate({
        path: 'expertId', // Populate expert to get expert's name
        select: 'username', // Select only the name field from the expert model
      });

    // Format the response to include only the required fields
    const formattedRequests = requests.map(request => ({
      currentBookingID: request.Current_Booking_id, // You might want to extract only the ID or relevant fields here
      requestedDateId: request.RequestedDateId, // Same as above
      requestedSlotId: request.RequestedSlotId, // Same as above
      expertName: (request.expertId as IExpert)?.username || null, // Include expert's name; handle cases where expertId might not exist
    }));

    res.status(200).json({
      message: 'Rescheduling requests retrieved successfully',
      data: formattedRequests,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});




// GET route to list all reschedule requests with expert name
router.get('/reschedule-requests', async (req: Request, res: Response) => {
  try {
    // Fetch all rescheduling requests and populate the expert's username
    const requests = await ReschedulingRequest.find()
      .populate({
        path: 'expertId',
        select: 'username', // Only select the username field from the Expert model
      })
      .populate('Current_Booking_id') // Populate booking details if needed
      .populate('RequestedDateId') // Populate date details if needed
      .populate('RequestedSlotId'); // Populate slot details if needed

    // Format the response to include only the required fields
    const formattedRequests = requests.map(request => {
      const expert = request.expertId as IExpert | null; // Type assertion for populated expert

      return {
        currentBookingID: request.Current_Booking_id, // Include the relevant fields you need
        requestedDateId: request.RequestedDateId,
        requestedSlotId: request.RequestedSlotId,
        expertName: expert?.username || null, // Include expert's username if expert is populated
      };
    });

    res.status(200).json({
      message: 'Rescheduling requests retrieved successfully',
      data: formattedRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



// GET route to list all reschedule requests with expert name
// router.get('/reschedule-requests', async (req: Request, res: Response) => {
//   try {
//     // Fetch all rescheduling requests and populate the expert's username
//     const requests = await ReschedulingRequest.find()
//       .populate('expertId') // Populate expert details if needed)
//       .populate('Current_Booking_id') // Populate booking details if needed
//       .populate('RequestedDateId') // Populate date details if needed
//       .populate('RequestedSlotId'); // Populate slot details if needed

//     // Format the response to include only the required fields
//     const formattedRequests = requests.map(request => {
//       const expert = request.expertId as IExpert; // Type assertion to IExpert

//       return {
//         currentBookingID: request.Current_Booking_id, // Include the relevant fields you need
//         requestedDateId: request.RequestedDateId,
//         requestedSlotId: request.RequestedSlotId,
//         expertName: expert?.username || null, // Ensure expert is populated, else set as null
//       };
//     });

//     res.status(200).json({
//       message: 'Rescheduling requests retrieved successfully',
//       data: formattedRequests,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// });


export default router;
