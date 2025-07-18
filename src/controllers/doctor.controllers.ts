import { Request, Response, NextFunction } from "express";
import User from "../models/user.models";

const getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const doctors = await User.find({ role: "doctor" }).select("-password");
        return res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(500).json({ error: "Failed to fetch doctors" });
    }
}

export { getDoctors };