const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getGeminiResponse } = require('../utils/geminiClient');
const { isRelevantToAngola } = require('../utils/relevanceChecker');
const { construirPrompt } = require('../utils/promptBuilder');
const Conversation = require('../models/Conversation');
const InterestingQuestion = require('../models/InterestingQuestion');

// Mapa para controle de limite de visitantes por IP
const visitantes = new Map();

const handleChat = async (req, res) => {
    const { message } = req.body;

    // 🚫 Verifica se a mensagem está vazia ou inválida
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ message: 'A pergunta não pode estar vazia.' });
    }

    // 🔐 Tentativa de autenticação manual via token (caso o middleware não tenha sido usado)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            req.user = user;
        } catch (err) {
            console.warn('Token inválido. Continuando como visitante.');
        }
    }

    // 🧾 Limite para visitantes: máximo de 5 perguntas por IP
    const ip = req.ip;
    if (!req.user) {
        const count = visitantes.get(ip) || 0;
        if (count >= 5) {
            return res.status(403).json({
                message: '⚠️ Você atingiu o limite de 5 perguntas como visitante. Crie uma conta para continuar usando o AngoIA. 🇦🇴'
            });
        }
        visitantes.set(ip, count + 1);
    }

    // 🌍 Verifica se a pergunta é relevante para Angola
    const relevante = await isRelevantToAngola(message);
    if (!relevante) {
        return res.status(200).json({
            resposta: `
**Olá! 👋 Eu sou o AngoIA**, seu assistente cultural de Angola 🇦🇴.

Atualmente, respondo perguntas exclusivamente sobre:
- **História**
- **Cultura**
- **Províncias**
- **Figuras nacionais**
- **Curiosidades sobre Angola**

Experimente perguntar:
*“Qual é a capital da província de Benguela?”* 🗺️  
*“O que é Kuduro?”* 🎶  
*“Quem foi Agostinho Neto?”* 📜

Vamos descobrir juntos! 🇦🇴✨
            `.trim()
        });
    }

    try {
        // 📜 Recupera as últimas 3 mensagens anteriores, se o usuário estiver autenticado
        let historico = [];
        if (req.user?.id) {
            historico = await Conversation.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .limit(3);
        }

        // 🧠 Gera o prompt com personalidade + histórico de conversa
        const prompt = construirPrompt(message, historico);

        // 🧩 Chama a IA Gemini com o prompt completo
        const resposta = await getGeminiResponse(prompt);

        // 💾 Salva no banco de dados apenas se a pergunta for relevante e o usuário estiver autenticado
        if (req.user?.id && relevante) {
            await Conversation.create({
                user: req.user.id,
                question: message,
                response: resposta
            });

            await InterestingQuestion.create({
                usuarioId: req.user.id,
                pergunta: message,
                resposta,
                tags: gerarTags(message),
                status: 'nova',
                data: new Date()
            });
        }

        // ✅ Envia a resposta ao frontend
        res.status(200).json({ resposta });

    } catch (error) {
        console.error('❌ Erro no chatController:', error.message);
        res.status(500).json({ message: 'Erro ao gerar resposta.' });
    }
};

// 🎯 Gera tags automáticas com base no conteúdo da pergunta
const gerarTags = (message) => {
    const tags = [];
    const texto = message.toLowerCase();

    if (texto.includes("história") || texto.includes("independência")) tags.push("história");
    if (texto.includes("cultura") || texto.includes("kuduro") || texto.includes("música")) tags.push("cultura");
    if (texto.includes("província") || texto.includes("cidade") || texto.includes("luanda")) tags.push("geografia");
    if (texto.includes("figura") || texto.includes("líder") || texto.includes("presidente")) tags.push("personalidade");

    return tags.length > 0 ? tags : ["geral"];
};

module.exports = { handleChat };









