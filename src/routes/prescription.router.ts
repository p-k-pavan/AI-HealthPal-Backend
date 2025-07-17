import express from 'express';
import upload from '../utils/multer';
import { uploadPrescription } from '../controllers/prescription.controller';


const router = express.Router();

router.post('/upload', upload.single('prescription'), uploadPrescription);

export default router;