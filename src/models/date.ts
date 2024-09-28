import mongoose, { Document, Schema } from 'mongoose';

enum Availability {
  holiday = 'holiday',
  available = 'available',
  not_available = 'not available',
  booked = 'booked'
}

export interface IDate extends Document {
  date: string;  // Date in "DD/MM/YYYY" format
  availability: Availability;
  expertId: mongoose.Schema.Types.ObjectId;  // Reference to Expert model
  slotsId: mongoose.Schema.Types.ObjectId[];  // Array of references to Slot model
}

const DateSchema: Schema = new Schema({
  date: { type: String, required: true },
  availability: {
    type: String,
    enum: Object.values(Availability),
    required: true,
  },
  expertId: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },
  slotsId: [{ type: Schema.Types.ObjectId, ref: 'Slot' }]
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

export const DateModel = mongoose.model<IDate>('Date', DateSchema);
