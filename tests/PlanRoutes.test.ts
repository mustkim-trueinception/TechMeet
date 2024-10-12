import request from "supertest";
import app from "../src/main"; // Ensure this path is correct
import { Plan } from "../src/models/PlanModel"; // Ensure this path is correct
import mongoose from "mongoose";

// Mock the Plan model to avoid real database calls in unit tests
jest.mock("../src/models/PlanModel");

describe("POST /api/v1/plan/create", () => {
  beforeAll(async () => {
    // Optionally connect to the database for integration tests
    // await mongoose.connect("mongodb://localhost:27017/AskTruelink");
  });

  afterAll(async () => {
    // Clean up after tests
    await mongoose.connection.close();
  });

  it("should create a new plan when valid data is provided", async () => {
    const mockPlan = {
      name: "phone-30",
      channel: "phone",
      duration: 30,
      price: "2500",
      bookingType: "appointment",
      expertId: "66f7b215ec4690d3ae8d1d43",
      isDedicated: false,
    };

    // Mock the save function to simulate database saving
    (Plan.prototype.save as jest.Mock).mockResolvedValue({
      ...mockPlan,
      _id: new mongoose.Types.ObjectId(), // Simulate MongoDB ObjectId
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/api/v1/plan/create")
      .send(mockPlan);

    console.log(response.body); // Log the response body

    expect(response.status).toBe(201);
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/api/v1/plan/create").send({
      name: "Basic Plan",
      // Missing required fields
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 400 if data is invalid (e.g., wrong data types)", async () => {
    const response = await request(app).post("/api/v1/plan/create").send({
      name: "Basic Plan",
      channel: "Zoom",
      duration: "thirty", // Invalid type, should be a number
      price: "35000",
      bookingType: "appointment",
      expertId: "invalidExpertId", // Invalid MongoDB ObjectId
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 400 if the database throws an error", async () => {
    // Mock a failure in the database
    (Plan.prototype.save as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app).post("/api/v1/plan/create").send({
      name: "onsite-seminar-180",
      channel: "onsite",
      duration: 180,
      price: "35000",
      bookingType: "appointment",
      expertId: "66f65ba4644085f5dc6ae5a8",
      isDedicated: false,
    });

    expect(response.status).toBe(400); // Status should be 400 for database errors
    expect(response.body.error).toBe("Database error");
  });
});
