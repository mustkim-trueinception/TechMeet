import request from "supertest";
import app from "../src/main"; // Adjust the import to your app's path
import mongoose from "mongoose";
import { Expert } from "../src/models/ExpertModel"; // Adjust the import to your Expert model's path

// Sample expert data for testing
const mockExperts = [
  {
    email: "uJ2vH@example.com",
    username: "expert1",
    fullname: "Expert One",
    expertise: "Field A",
    designation: "Senior Expert",
    description: "Description of expert one",
    avatar: "avatar1.png",
    coverPhoto: "cover1.png",
  },
  {
    email: "uJ2vH@example.com",
    username: "expert2",
    fullname: "Expert Two",
    expertise: "Field B",
    designation: "Junior Expert",
    description: "Description of expert two",
    avatar: "avatar2.png",
    coverPhoto: "cover2.png",
  },
];

// Connect to the test database before running tests
beforeAll(async () => {
  //   await mongoose.connect("mongodb://localhost/test_db", {});
});

// Clear the database after each test
afterEach(async () => {
  await Expert.deleteMany({});
});

// Disconnect from the database after all tests are complete
afterAll(async () => {
  await mongoose.disconnect();
});

describe("GET /api/v1/guest/experts", () => {
  it("should return a list of experts", async () => {
    // Seed the database with mock experts
    await Expert.insertMany(mockExperts);

    const response = await request(app).get("/api/v1/guest/experts");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(mockExperts.length);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: expect.any(String),
          fullname: expect.any(String),
          expertise: expect.any(String),
          designation: expect.any(String),
          description: expect.any(String),
          avatar: expect.any(String),
          coverPhoto: expect.any(String),
        }),
      ])
    );
  });

  it("should return an empty array if no experts exist", async () => {
    const response = await request(app).get("/api/v1/guest/experts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
