import { BookingSchema } from "../models/BookingModel";
import express, { Request, Response } from "express";
import { ZodError } from "zod"; // Import ZodError for validation error handling

const router = express.Router();

/**
 * @route GET /booking
 * @group Booking - Operations about booking
 * @param {number} page.query - The page number for pagination
 * @param {number} limit.query - The number of results per page
 * @param {string} search.query - The search term to filter bookings
 * @param {string} sort.query - The sorting criteria for bookings
 * @param {string} genre.query - The genre for filtering bookings
 * @returns {object} 200 - List of bookings retrieved successfully
 * @returns {Error} 400 - Bad Request (e.g., invalid query parameters)
 * @returns {Error} 500 - Internal server error
 */
router.get("/booking", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) - 1 || 0; // Page number (0-based index)
    const limit = parseInt(req.query.limit as string) || 5; // Limit per page
    const search = (req.query.search as string) || ""; // Search term
    let sort = (req.query.sort as string) || "guestName"; // Default sort by guestName
    let genre: string | string[] = (req.query.genre as string) || "All"; // Filter by genre

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
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: true, message: "Validation error", issues: err.errors });
    }
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

/**
 * @route GET /Booking/{UID}
 * @group Booking - Operations about booking
 * @param {string} UID.path.required - The ID of the booking entry
 * @returns {object} 200 - Booking entry retrieved successfully
 * @returns {Error} 404 - Booking entry not found
 * @returns {Error} 400 - Bad Request (e.g., invalid UID format)
 * @returns {Error} 500 - Internal server error
 */
router.get("/Booking/:UID", async (req: Request, res: Response) => {
  try {
    // Validate the UID format if necessary
    if (!req.params.UID.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid UID format" });
    }

    const dateEntry = await BookingSchema.findById(req.params.UID);
    if (!dateEntry) {
      return res.status(404).json({ error: "Booking entry not found" });
    }
    res.status(200).json(dateEntry);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Validation error",
          issues: error.errors,
        });
    }
    // Handle other types of errors, e.g., MongoDB specific errors
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid UID format" });
    }
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

export default router;
