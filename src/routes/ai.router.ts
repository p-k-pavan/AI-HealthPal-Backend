import express from "express";
import { analyzeSymptoms } from "../controllers/symptom.controller";
import VerifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/symptom",VerifyToken,analyzeSymptoms);

export default router;