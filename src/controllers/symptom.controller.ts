import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const analyzeSymptoms = async (req: Request, res: Response) => {
    const { age, gender, symptoms } = req.body;

    if (
        typeof age !== "number" ||
        typeof gender !== "string" ||
        !Array.isArray(symptoms) ||
        symptoms.length === 0
    ) {
        return res.status(400).json({ error: "Valid age (number), gender (string), and symptoms[] are required" });
    }

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "anthropic/claude-3-haiku",
                messages: [
                    {
                        role: "system",
                        content: `
You are a medical AI assistant. When given symptoms, respond ONLY in the following JSON format:

{
  "age": number,
  "gender": string,
  "conditions": [
    {
      "name": string,
      "probability": number,
      "explanation": string,
      "suggested_medications": [string]
    }
  ],
  "recommendation": string,
  "disclaimer": string
}

• ONLY include common, safe, over-the-counter medications (like paracetamol, antacids, etc.).
• NEVER recommend antibiotics, opioids, or prescription-only drugs.
• Always include a disclaimer to consult a real doctor.
Respond ONLY in valid JSON format.
            `.trim()
                    },
                    {
                        role: "user",
                        content: `Age: ${age}, Gender: ${gender}, Symptoms: ${symptoms.join(", ")}`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const rawContent = response.data.choices?.[0]?.message?.content;

        if (!rawContent) {
            return res.status(500).json({ error: "Empty response from Claude AI" });
        }

        // Try to parse the model's response as JSON
        try {
            const parsed = JSON.parse(rawContent);
            return res.status(200).json({ result: parsed });
        } catch (parseError) {
            // If parsing fails, return raw text
            return res.status(200).json({ result: rawContent, warning: "Response not in JSON format." });
        }

    } catch (error: any) {
        console.error("OpenRouter error:", error?.response?.data || error.message);
        return res.status(500).json({ error: "Failed to analyze symptoms" });
    }
};
