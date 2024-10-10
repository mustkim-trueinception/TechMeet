import request from "supertest";
import app from "../src/main"; // Your Express app
import AdminSchema from "../src/models/AdminModel";
import bcrypt from "bcryptjs";

jest.mock("../src/models/AdminModel");

describe("POST /signup", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  it("should create a new admin when all inputs are valid", async () => {
    (AdminSchema.findOne as jest.Mock).mockResolvedValue(null); // No admin exists
    (AdminSchema.create as jest.Mock).mockResolvedValue({
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
    });

    const response = await request(app).post("/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Admin created successfully");
    expect(response.body.admin).toHaveProperty("email", "john@example.com");
  });

  it("should return 400 if the admin already exists", async () => {
    (AdminSchema.findOne as jest.Mock).mockResolvedValue({
      email: "john@example.com",
    }); // Admin already exists

    const response = await request(app).post("/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Admin already exists");
  });

  it("should return 400 if the request body is invalid", async () => {
    const response = await request(app).post("/signup").send({
      name: "", // Invalid name
      email: "invalid-email", // Invalid email
      password: "123", // Too short password
    });

    expect(response.status).toBe(400);
  });
});
