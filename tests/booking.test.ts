// import { updateGuestSchema } from './../src/routes/BookingRoutes';
import { Schema } from 'mongoose';
import request from 'supertest';
import app from '../src/main'; // Replace with the correct path to your Express app
import mongoose from 'mongoose';
import { GuestOccupationEnum } from '../dist/server';
import { updateGuestSchema } from '../src/routes/BookingRoutes';
import { BookingSchema } from '../dist/server';
import { authenticateJWT } from '../src/middleware/auth';

describe('POST /api/v1/book-appointment', () => {
    beforeAll(async () => {
      // await mongoose.connect('mongodb://localhost:27017/test-db');
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
    });
  
    it('should create a new booking with valid data and return 201', async () => {
      const validData = {
            guestName: "Khan Maaz",
            dateId: "66fa9e5b0a0249416313b82b",
            guestOccupation: "Businessperson",
            guestAge: 35,
            guestCity: "UK",
            guestEmail: "maaz@example.com",
            guestPhone: "4545405555",
            guestWhatsapp: "4544444444",
             guestWebsite:"www.khanmaaz.com",
            guestProblem: "Find best way to create audience",
            guestVoiceNote: "https://example.com/voiceNote123.mp3",
            tags: [
              "audience",
              "stress management"
            ],
            guestKYC: true,
            expertId: "66f7b215ec4690d3ae8d1d43",
            slotId: "66fa9af7e086e9da29ef5bec",
            status: "Pending"
      };
  
      const res = await request(app)
        .post('/api/v1/book-appointment')
        .send(validData);
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', "Booking created successfully");
    });
  
    it('should return 400 if Invalid data is provided', async () => {
      const invalidData = {
        guestName: "zeeshan",
        dateId: "615a4c4b8a1a2a001c0f21de",
        guestOccupation: "Developer", // Invalid occupation
        guestAge: "40", // Invalid age (should be a number)
        guestCity: "Nashik",
        guestEmail: "johndoe@example.com",
        guestPhone: "1234567890",
        guestWhatsapp: "1234567890",
        guestProblem: "Anxiety issues",
        guestVoiceNote: "https://example.com/voice_note.mp3",
        tags: ["mental health", "consultation"],
        guestKYC: true,
        expertId: "66f7b215ec4690d3ae8d1d43",
        slotId: "66ff8650c63cfbc9d92e482d",
        status: "Pending" // Valid status
      };
  
      const res = await request(app)
        .post('/api/v1/book-appointment')
        .send(invalidData);
  
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  
    it('should return 400 if an validation error occurs', async () => {
      const res = await request(app)
        .post('/api/v1/book-appointment')
        .send({}); // Empty body
  
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });


// booking-modify testing code
// Sample booking data to use for testing
const sampleBooking = {
  guestName: "John Doe",
  dateId: new mongoose.Types.ObjectId(),
  guestOccupation: "Student",
  guestAge: 25,
  guestCity: "New York",
  guestEmail: "john.doe@example.com",
  guestPhone: "1234567890",
  guestWhatsapp: "0987654321",
  guestWebsite: "http://johndoe.com",
  guestProblem: "Need help with coding.",
  guestVoiceNote: undefined,
  tags: ["coding", "help"],
  guestKYC: true,
  expertId: new mongoose.Types.ObjectId(),
  slotId: new mongoose.Types.ObjectId(),
  status: "Pending",
};

// Setup test data
beforeAll(async () => {
  // // Connect to MongoDB
  // await mongoose.connect(process.env.MONGODB_URI); // Ensure this environment variable is set correctly
  // // Insert a sample booking into the database
  // await BookingSchema.create(sampleBooking);
});

// Clean up after tests
afterAll(async () => {
  // await BookingSchema.deleteMany({}); // Clean up the test data
  await mongoose.disconnect(); // Disconnect from MongoDB
});

// Test for updating guest data
describe("PUT /api/v1/booking/modify", () => {
  it("should update guest data successfully", async () => {
    const bookingToUpdate = await BookingSchema.findOne(); // Get the sample booking created in beforeAll
    const updateData = {
      booking_id: bookingToUpdate._id.toString(),
      guestPhone: "9876543210",
      guestEmail: "john.new@example.com",
      guestName: "John New",
    };

    const response = await request(app)
      .put("/api/v1/booking/modify")
      .send(updateData)
      .set("Authorization", `Bearer ${authenticateJWT}`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Guest data updated successfully");
    expect(response.body.updatedBooking.guestPhone).toBe(updateData.guestPhone);
    expect(response.body.updatedBooking.guestEmail).toBe(updateData.guestEmail);
    expect(response.body.updatedBooking.guestName).toBe(updateData.guestName);
  });

  it("should return 400 if validation fails", async () => {
    const updateData = {
      booking_id: "invalidId",
      guestPhone: "9876543210",
      guestEmail: "invalidEmail", // Invalid email
      guestName: "John New",
    };

    const response = await request(app)
      .put("/api/v1/booking/modify")
      .send(updateData)
      .set("Authorization", `Bearer ${authenticateJWT}`); // Replace with a valid JWT token

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 404 if booking not found", async () => {
    const updateData = {
      booking_id: new mongoose.Types.ObjectId().toString(), // Non-existent booking ID
      guestPhone: "9876543210",
      guestEmail: "john.new@example.com",
      guestName: "John New",
    };

    const response = await request(app)
      .put("/api/v1/booking/modify")
      .send(updateData)
      .set("Authorization", `Bearer ${authenticateJWT}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Booking not found");
  });

  it("should return 403 if no token provided", async () => {
    const updateData = {
      booking_id: "someBookingId",
      guestPhone: "9876543210",
      guestEmail: "john.new@example.com",
      guestName: "John New",
    };

    const response = await request(app)
      .put("/api/v1/booking/modify")
      .send(updateData); // No token provided

    expect(response.status).toBe(403);
  });
});