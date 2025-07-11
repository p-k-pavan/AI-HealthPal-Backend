import express from "express";
import { loginController, registerController } from "../controllers/auth.controllers";
import { analyzeSymptoms } from "../controllers/symptom.controller";
import VerifyToken from "../middleware/verifyToken";


const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/symptom",VerifyToken,analyzeSymptoms);

export default router;
