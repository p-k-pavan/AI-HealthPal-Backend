import express from "express";
import { createAppointment, getAppointments, getDoctorAvailableSlots, updateAppointment } from "../controllers/appointment.controllers";
import VerifyToken from "../middleware/verifyToken";

const router = express.Router();
router.post("/create",VerifyToken, createAppointment);
router.get("/", VerifyToken,getAppointments);
router.put("/update",VerifyToken, updateAppointment);   
router.get("/available-slots", VerifyToken,getDoctorAvailableSlots)

export default router;
