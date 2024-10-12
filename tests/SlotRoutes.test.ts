import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { authenticateJWT } from "../src/middleware/auth"; // Adjust the import based on your project structure
import slotRoutes from "../src/routes/SlotsRoutes"; // Adjust the import based on your project structure
import { Slot } from "../src/models/SlotModel"; // Adjust based on your Slot model location

// Mock the JWT middleware for testing
jest.mock("./path/to/authMiddleware");

const app = express();
app.use(express.json());
app.use(slotRoutes); // Use your routes

describe("POST /slot/create", () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect("mongodb://localhost:27017/AskTruelinkTest");
  });

  afterAll(async () => {
    // Clean up the database and close the connection
    await Slot.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(() => {
    // Reset the mock before each test
    (authenticateJWT as jest.Mock).mockImplementation((req, res, next) => {
      next(); // Call next() to skip authentication
    });
  });

  it("should create a new slot and return it", async () => {
    const newSlot = {
      availability: "Available",
      timing: "10:00",
      period: "Morning",
      planId: new mongoose.Types.ObjectId(), // Use a valid ObjectId
      expertId: new mongoose.Types.ObjectId(), // Use a valid ObjectId
    };

    const response = await request(app)
      .post("/slot/create")
      .send(newSlot)
      .expect(201);

    expect(response.body).toHaveProperty("_id"); // Check if ID is generated
    expect(response.body.availability).toBe(newSlot.availability);
    expect(response.body.timing).toBe(newSlot.timing);
    expect(response.body.period).toBe(newSlot.period);
    expect(response.body.planId).toEqual(newSlot.planId);
    expect(response.body.expertId).toEqual(newSlot.expertId);
  });

  it("should return 400 for invalid slot data", async () => {
    const invalidSlotData = {
      availability: "Av", // Too short
      timing: "10:00", // Valid timing
      period: "M", // Too short
      planId: "invalidPlanId", // Invalid format
      expertId: "invalidExpertId", // Invalid format
    };

    const response = await request(app)
      .post("/slot/create")
      .send(invalidSlotData)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it("should return 500 on server error", async () => {
    // Mock the Slot save method to throw an error
    jest.spyOn(Slot.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const newSlot = {
      availability: "Available",
      timing: "10:00",
      period: "Morning",
      planId: new mongoose.Types.ObjectId(), // Use a valid ObjectId
      expertId: new mongoose.Types.ObjectId(), // Use a valid ObjectId
    };

    const response = await request(app)
      .post("/slot/create")
      .send(newSlot)
      .expect(500);

    expect(response.body).toHaveProperty("error", "Database error");
  });
});
