import { BookingSchema } from "../models/BookingModel";
import express, { Request, Response } from "express";
import { any, array, string } from "zod";

const router = express.Router();

// Booking search route with pagination, filtering, and sorting
router.get("/booking", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) - 1 || 0; // Page number (0-based index)
    const limit = parseInt(req.query.limit as string) || 5; // Limit per page
    const search = (req.query.search as string) || ""; // Search term
    let sort = (req.query.sort as string) || "guestName"; // Default sort by guestName
    let genre: string | string[] = (req.query.genre as string) || "All"; // Allow both string and string[] // Filter by genre (in your case, fields like guestName, guestCity, etc.)

    // Options for genre (in this context, it could be fields like guestName, guestCity, etc.)
    const genreOptions = [
      "guestName",
      "guestOccupation",
      "guestAge",
      "guestCity",
      "guestEmail",
      "guestPhone",
      "guestWhatsapp",
      "guestProblem",
    ];

    // If genre is set to 'All', include all options, otherwise split the genres from query
    genre === "All" ? (genre = [...genreOptions]) : (genre = genre.split(","));

    // Sorting logic
    const sortParams = sort.split(",");
    let sortBy: any = {};
    if (sortParams[1]) {
      sortBy[sortParams[0]] = sortParams[1]; // Custom sort if multiple fields
    } else {
      sortBy[sortParams[0]] = "asc"; // Default to ascending sort
    }

    // Query to find matching bookings
    const query: any = {
      $or: [
        { guestName: { $regex: search, $options: "i" } },
        { guestOccupation: { $regex: search, $options: "i" } },
        { guestCity: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
        { guestPhone: { $regex: search, $options: "i" } },
        { guestWhatsapp: { $regex: search, $options: "i" } },
        { guestProblem: { $regex: search, $options: "i" } },
      ],
    };

    // Execute the query with pagination and sorting
    const bookings = await BookingSchema.find(query)
      .populate("expertId") // Populate expertId with full expert details if needed
      .sort(sortBy) // Sort the results
      .skip(page * limit) // Pagination
      .limit(limit); // Limit results per page

    // Get total count for pagination
    const total = await BookingSchema.countDocuments(query);

    // Response object
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      genres: genreOptions,
      bookings,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get a date entry by ID
router.get("/Booking/:UID", async (req: Request, res: Response) => {
  try {
    const dateEntry = await BookingSchema.findById(req.params.UID);
    if (!dateEntry) {
      return res.status(404).json({ error: "Date entry not found" });
    }
    res.status(200).json(dateEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
