import express from "express";
import { Request, Response } from "express";
import { DateModel } from "../models/DateModel"; // Updated import path
import { DateSchemaZod } from "../schemas/DateSchema"; // Zod validation schema
import { z } from "zod";
import { Expert } from "../models/ExpertModel";
import { Plan } from "../models/PlanModel";
import { authenticateJWT } from "../middleware/auth"; // Import the JWT authentication middleware

const router = express.Router();

/**
 * @route POST /date/create
 * @group Date - Operations about date
 * @param {object} req.body - The date entry to create
 * @param {string} req.body.date - The date in "DD/MM/YYYY" format
 * @param {("holiday"|"available"|"not available"|"booked")} req.body.availability - The availability status
 * @param {string} req.body.expertId - The ID of the expert associated with the date
 * @param {Array<string>} [req.body.slotsId] - Optional array of slot IDs
 * @returns {object} 201 - The created date entry
 * @returns {Error} 400 - Invalid input data
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.post(
  "/date/create",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      // Validate request data with Zod
      const parsedData = DateSchemaZod.parse(req.body);

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
  }
);

/**
 * @route GET /dates
 * @group Date - Operations about date
 * @returns {Array<object>} 200 - List of all date entries
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.get("/dates", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const dates = await DateModel.find().populate("expertId").populate("slots");
    res.status(200).json(dates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /date/{expertid}
 * @group Date - Operations about date
 * @param {string} expertid.path.required - The ID of the expert
 * @returns {Array<object>} 200 - The date entries associated with the expert
 * @returns {Error} 404 - Date entry not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.get(
  "/date/:expertid",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const dateEntry = await DateModel.find({ expertId: req.params.expertid });
      if (!dateEntry) {
        return res.status(404).json({ error: "Date entry not found" });
      }
      res.status(200).json(dateEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /calendar
 * @group Calendar - Operations about calendars
 * @param {object} req.body - The plan ID to fetch dates and slots
 * @param {string} req.body.plan_id - The ID of the plan
 * @returns {object} 200 - The structured data including plan, expert, and dates
 * @returns {Error} 404 - Plan or expert not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.post("/calendar", async (req: Request, res: Response) => {
  const { plan_id } = req.body;

  try {
    // 1. Find the plan by plan_id
    const plan = await Plan.findById(plan_id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 2. Fetch the expert related to the plan
    const expert = await Expert.findById(plan.expertId);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // 3. Find all dates associated with this plan and expert
    const dates = await DateModel.find({ expertId: plan.expertId });

    // 4. Fetch the slots for each date using the correct property (slotsId)
    const responseDates = await Promise.all(
      dates.map(async (date) => {
        // Populate slots using slotsId reference
        const populatedDate = await date.populate("slotsId"); // Assuming slotsId holds slot references

        return {
          id: date._id,
          date: date.date,
          availability: date.availability,
          slots: populatedDate.slotsId.map((slot: any) => ({
            id: slot._id,
            availability: slot.availability,
            timing: slot.timing,
            period: slot.period,
            expertId: slot.expertId,
            planId: slot.planId,
          })),
        };
      })
    );

    // 5. Return the structured data: plan, dates, slots, and expert
    return res.status(200).json({
      plan: {
        id: plan._id,
        name: plan.name,
        channel: plan.channel,
        duration: plan.duration,
        price: plan.price,
        bookingType: plan.bookingType,
        expertId: plan.expertId,
        isDedicated: plan.isDedicated,
      },
      expert: {
        id: expert._id,
        fullname: expert.fullname, // Assuming expert has a name field
        expertise: expert.expertise, // Assuming expert has a specialty field
      },
      dates: responseDates,
    });
  } catch (error) {
    console.error("Error fetching plan dates and slots:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

/**
 * @route POST /expert/date/create
 * @group Date - Operations about date
 * @param {object} req.body - The date entry to create for the expert
 * @param {string} req.body.plan_id - The ID of the plan
 * @returns {object} 200 - The structured data including plan, expert, and dates
 * @returns {Error} 404 - Plan or expert not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.post(
  "/expert/date/create",
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { plan_id } = req.body;

    try {
      // 1. Find the plan by plan_id
      const plan = await Plan.findById(plan_id);

      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      // 2. Fetch the expert related to the plan
      const expert = await Expert.findById(plan.expertId);

      if (!expert) {
        return res.status(404).json({ message: "Expert not found" });
      }

      // 3. Find all dates associated with this plan and expert
      const dates = await DateModel.find({ expertId: plan.expertId });

      // 4. Fetch the slots for each date using the correct property (slotsId)
      const responseDates = await Promise.all(
        dates.map(async (date) => {
          // Populate slots using slotsId reference
          const populatedDate = await date.populate("slotsId"); // Assuming slotsId holds slot references

          return {
            id: date._id,
            date: date.date,
            availability: date.availability,
            slots: populatedDate.slotsId.map((slot: any) => ({
              id: slot._id,
              availability: slot.availability,
              timing: slot.timing,
              period: slot.period,
              expertId: slot.expertId,
              planId: slot.planId,
            })),
          };
        })
      );

      // 5. Return the structured data: plan, dates, slots, and expert
      return res.status(200).json({
        plan: {
          id: plan._id,
          name: plan.name,
          channel: plan.channel,
          duration: plan.duration,
          price: plan.price,
          bookingType: plan.bookingType,
          expertId: plan.expertId,
          isDedicated: plan.isDedicated,
        },
        expert: {
          id: expert._id,
          fullname: expert.fullname, // Assuming expert has a name field
          expertise: expert.expertise, // Assuming expert has a specialty field
        },
        dates: responseDates,
      });
    } catch (error) {
      console.error("Error fetching plan dates and slots:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
);

/**
 * @route PUT /date/{id}
 * @group Date - Operations about date
 * @param {string} id.path.required - The ID of the date entry
 * @param {object} req.body - The updated date entry data
 * @returns {object} 200 - The updated date entry
 * @returns {Error} 404 - Date entry not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.put(
  "/date/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { date, availability, expertId, slotsId } = req.body;

      const updatedDate = await DateModel.findByIdAndUpdate(
        id,
        { date, availability, expertId, slotsId },
        { new: true, runValidators: true }
      );

      if (!updatedDate) {
        return res.status(404).json({ error: "Date entry not found" });
      }

      res.status(200).json(updatedDate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
);

/**
 * @route DELETE /date/{id}
 * @group Date - Operations about date
 * @param {string} id.path.required - The ID of the date entry
 * @returns {object} 200 - Confirmation of deletion
 * @returns {Error} 404 - Date entry not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */
router.delete(
  "/date/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const deletedDate = await DateModel.findByIdAndDelete(id);
      if (!deletedDate) {
        return res.status(404).json({ error: "Date entry not found" });
      }
      res.status(200).json({ message: "Date entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
