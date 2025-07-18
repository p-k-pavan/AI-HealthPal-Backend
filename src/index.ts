import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; 
import authRouter from "./routes/auth.router"; 
import { errorHandler } from "./middleware/errorHandler";
import aiRouter from "./routes/ai.router";
import cors from "cors"
import prescriptionRouter from "./routes/prescription.router"
import appointmentRouter from "./routes/appointment.router";

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB as string)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/ai",aiRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/appointment", appointmentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 404;
    const message = res.statusMessage || "Something went wrong";
    res.status(statusCode).json({
        success: false,
        message: message,
    });
    next();
});
app.use(errorHandler);