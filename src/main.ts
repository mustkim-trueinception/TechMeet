import { Slot } from './models/SlotModel';
import * as _ from 'lodash'
import express from 'express'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import { union } from 'lodash'
import 'colors'; // Import colors to extend string prototypes
import dotenv from 'dotenv';
import expertRoute from './routes/ExpertRoutes'
import adminRoute from './routes/AdminRoutes'
import planRoutes from './routes/PlanRoutes'
import SlotsRoutes from './routes/SlotsRoutes'
import dateRoutes from './routes/DateRoutes'
import bookingRoutes from './routes/BookingRoutes'
import requestRescheduleRoute from './routes/RequestRescheduleRoutes'
import adminexpertRoute from './routes/AdminExpertRoutes'
import reschedulingOptionsRoute  from './routes/ReschedulingOptionsRoutes'


const app = express()
app.use(express.json()); // to accept json data 
dotenv.config(); // Load environment variables

// import routes

app.use('/api/v1', expertRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1', planRoutes);
app.use('/api/v1', SlotsRoutes);
app.use('/api/v1', dateRoutes);
app.use('/api/v1', bookingRoutes);
app.use('/api/v1', adminexpertRoute);
app.use('/api/v1/booking', requestRescheduleRoute);
app.use('/api/v1', reschedulingOptionsRoute);

const connectDb = async (): Promise<void> => {
    try {
        // Ensure the MongoDB URL exists or throw an error
        const mongoUrl: string = process.env.MONGO_URL as string;

        await mongoose.connect(mongoUrl);

        console.log(`MongoDB Connected  ✅: ${mongoose.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.log(`Error: ${(error as Error).message}`.red.underline.bold);
        process.exit(1);
    }
};

connectDb()


app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`.bgYellow.black);
})