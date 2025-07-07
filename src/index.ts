import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB as string)
.then((): void => {
    console.log("Connected to Mongo");
})
.catch((error: unknown): void => {
    console.error("Error connecting to MongoDB:", error);
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log("Server is running on Port 5000")
})