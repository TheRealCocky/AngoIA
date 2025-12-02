const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

const getGeminiResponse = async (message) => {
    if (!API_KEY) {
        console.error("❌ Chave da API Gemini não encontrada no .env");
        return "Erro interno: API não configurada corretamente.";
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: message }],
                    },
                ],
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 15000, // 15s
            }
        );

        // Log detalhado para debug
        console.log("✅ Resposta bruta da Gemini:", JSON.stringify(response.data, null, 2));

        // Procura no caminho original, se não existir, tenta outros caminhos possíveis
        let texto = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!texto) {
            // fallback alternativo
            texto = response.data?.output_text || "";
        }

        return texto?.trim() || "Sem resposta disponível no momento.";
    } catch (err) {
        console.error("❌ Erro na API Gemini:", err.response?.data || err.message);
        return "Erro ao gerar resposta com a IA.";
    }
};

module.exports = { getGeminiResponse };






