import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.models";

const registerController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { name, age, gender, email, password, address, profilePicture } = req.body;

    try {
        if (!name || !age || !gender || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            age,
            gender,
            email,
            password: hashedPassword,
            address,
            profilePicture: profilePicture || "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        res.cookie("healthPal", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 86400000 
        });

        return res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id,
            name: newUser.name,
            role: newUser.role,
            profilePicture: newUser.profilePicture,
            token: token
        });
    } catch (error) {
        console.error("Registration error:", error);
        next({
            status: 500,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

const loginController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Incorrect Credential" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect Credential" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        res.cookie("healthPal", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 86400000  
        })

        return res.status(200).json({
            message: "Login successful",
            userId: user._id,
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture,
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        next({
            status: 500,
            message: error instanceof Error ? error.message : "Internal Server Error",
        })
    }
}

export { registerController, loginController };
