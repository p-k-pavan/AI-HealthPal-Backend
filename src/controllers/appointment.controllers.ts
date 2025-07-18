import { Request,Response,NextFunction } from "express";
import User from "../models/user.models";
import Appointment from "../models/appointment.models";

const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { patientId, doctorId, date, time, reason } = req.body;

    if (!patientId || !doctorId || !date || !time || !reason) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {

        const patient = await User.findById(patientId);
        const doctor = await User.findById(doctorId);
        if (!patient || !doctor) {
            return res.status(404).json({ error: "Patient or Doctor not found" });
        }
        // Check if the appointment already exists
        const existingAppointment = await Appointment.findOne({ 
            patient: patientId,
            doctor: doctorId,
            date,
            time
        });
        if (existingAppointment) {
            return res.status(400).json({ error: "Appointment already exists for this time slot" });
        }
        //
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            time,
            reason
        });

        await appointment.save();
        return res.status(201).json({ message: "Appointment created successfully", appointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({ error: "Failed to create appointment" });
    }
}

const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { userId } = req.query;
    try {
        const appointments = await Appointment.find().populate('patient doctor', 'name email');
        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ error: "Failed to fetch appointments" });
    }
}

const updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
        return res.status(400).json({ error: "Appointment ID and status are required" });
    }

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        appointment.status = status;
        await appointment.save();
        return res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return res.status(500).json({ error: "Failed to update appointment" });
    }
}

const ALL_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00"
];

interface IAppointment {
  doctor: string;
  date: Date;
  time: string;
}

const getDoctorAvailableSlots = async (req: Request, res: Response): Promise<Response | void> => {
  const doctorId = req.query.doctorId as string;
  const date = req.query.date as string;

  if (!doctorId || !date) {
    return res.status(400).json({ error: "Doctor ID and date are required" });
  }

  try {
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: new Date(date)
    });

    const bookedTimes = bookedAppointments.map((app: IAppointment) => app.time);
    const availableSlots = ALL_SLOTS.filter(slot => !bookedTimes.includes(slot));

    return res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({ error: "Failed to fetch available slots" });
  }
};



export { createAppointment, getAppointments, updateAppointment,getDoctorAvailableSlots};