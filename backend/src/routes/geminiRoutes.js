const express = require('express');
const router = express.Router();
const client = require('../utils/geminiClient');

const MODEL_NAME = 'models/gemini-2.0-flash';

router.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Campo "prompt" é obrigatório' });

    try {
        const response = await client.generateText({
            model: MODEL_NAME,
            prompt: { text: prompt },
        });

        const generatedText = response.candidates?.[0]?.output || '';

        res.json({ generatedText });
    } catch (error) {
        console.error('Erro ao chamar a API Gemini:', error);
        res.status(500).json({ error: 'Erro interno na geração de texto' });
    }
});

module.exports = router;
