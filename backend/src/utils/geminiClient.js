const axios = require('axios');
require('dotenv').config(); // se ainda não estiver no topo

const API_KEY = process.env.GEMINI_API_KEY;

const getGeminiResponse = async (message) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: message }]
                    }
                ]
            }
        );

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
    } catch (err) {
        console.error('Erro na API Gemini:', err.response?.data || err.message);
        return 'Erro ao gerar resposta.';
    }
};

module.exports = { getGeminiResponse };




