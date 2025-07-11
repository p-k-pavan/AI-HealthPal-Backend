import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    role:{
        type: String,
        enum: ["user", "doctor", "admin"],
        default: "user",
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
    },

},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;