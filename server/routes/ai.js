const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/recommend', async (req, res) => {
    try {
        const { goal, level, interests } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API key not configured' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Act as an expert curriculum designer. create a personalized learning path for a student with the following profile:
        - Goal: ${goal}
        - Current Level: ${level}/5
        - Interests: ${interests.join(', ')}

        Generate a structured learning path with 5-7 main modules.
        For each module, provide a title, description, and estimated duration.
        
        Return the response in strictly valid JSON format with the following structure:
        {
            "title": "Path Title",
            "description": "Brief description of the path",
            "estimatedDuration": "Total duration",
            "modules": [
                {
                    "title": "Module Title",
                    "description": "Module Description",
                    "duration": "Duration"
                }
            ]
        }
        Do not include any markdown formatting or explanations, just the JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        res.json(data);
    } catch (error) {
        console.error('AI Recommendation Error:', error);
        res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
    }
});

module.exports = router;
