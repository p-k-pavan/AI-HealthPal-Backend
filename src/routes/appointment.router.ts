import express from "express";
import { createAppointment, getAppointments, getDoctorAvailableSlots, updateAppointment } from "../controllers/appointment.controllers";

const router = express.Router();
router.post("/create", createAppointment);
router.get("/", getAppointments);
router.put("/update", updateAppointment);   
router.get("/available-slots", getDoctorAvailableSlots)

export default router;
