import express from "express";
import VerifyToken from "../middleware/verifyToken";
import { getDoctors } from "../controllers/doctor.controllers";

const router = express.Router();
router.get("/getdoctor",VerifyToken,getDoctors);

export default router;
