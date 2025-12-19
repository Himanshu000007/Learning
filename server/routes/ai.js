const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are "Mick AI", a helpful and friendly AI assistant for the "DynamoLearn" e-learning platform. 
        Your goal is to answer user questions about courses, learning paths, and general programming concepts concisely.
        User said: "${message}"
        keep your response concise (under 50 words) so it can be spoken easily.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Error processing AI request', error: error.message });
    }
});

module.exports = router;
