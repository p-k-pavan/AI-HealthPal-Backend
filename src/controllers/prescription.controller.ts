import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from "express";

export const uploadPrescription = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = path.join(__dirname, '../../', req.file.path);
  
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: m => console.log(m) }
    );

    const medicineNames = extractMedicineNames(text);
    
    
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (deleteError) {
      console.error('Error deleting file:', deleteError);
      
    }
    
    return res.json({ text, medicineNames });
  } catch (error) {
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (deleteError) {
      console.error('Error deleting file after OCR failure:', deleteError);
    }

    return res.status(500).json({ 
      error: 'Failed to process prescription',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

function extractMedicineNames(text: string): string[] {
  const lines = text.split('\n');
  return lines.filter(line => {
   
    return line.match(/^[A-Z][a-zA-Z0-9\s-]+$/);
  }).map(line => line.trim());
}