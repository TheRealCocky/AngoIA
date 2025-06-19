// ✅ chatController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getGeminiResponse } = require('../utils/geminiClient');
const { construirPrompt } = require('../utils/promptBuilder');
const {
    isRelevantToAngola,
    isInterestingEnough,
    shouldStoreMessage
} = require('../utils/relevanceChecker');
const Conversation = require('../models/Conversation');
const InterestingQuestion = require('../models/InterestingQuestion');

const visitantes = new Map();

const isSaudacaoSimples = (texto = '') => {
    const frases = [
        "oi", "olá", "ola", "bom dia", "boa tarde", "boa noite",
        "como estás", "como vai", "tudo bem", "yá", "xê", "hello", "hi"
    ];
    return frases.includes(texto.trim().toLowerCase());
};

const handleChat = async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ message: 'A pergunta não pode estar vazia.' });
    }

    if (isSaudacaoSimples(message)) {
        return res.status(200).json({
            resposta: "Olá! Em que posso ajudar sobre Angola hoje? 🇦🇴"
        });
    }

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

    const ip = req.ip;
    if (!req.user) {
        const count = visitantes.get(ip) || 0;
        if (count >= 5) {
            return res.status(403).json({
                message: '⚠️ Limite de 5 perguntas como visitante. Crie uma conta para continuar usando o AngoIA. 🇦🇴'
            });
        }
        visitantes.set(ip, count + 1);
    }

    try {
        let historico = [];
        if (req.user?.id) {
            historico = await Conversation.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .limit(3);
        }

        const prompt = construirPrompt(message, historico);
        const resposta = await getGeminiResponse(prompt);

        const isCurta = message.trim().split(/\s+/).length <= 3;
        const respostaRuim = !resposta || resposta.includes('Erro') || resposta.includes('não consegui');

        let jaExiste = false;
        if (req.user?.id) {
            const limite = new Date(Date.now() - 3 * 86400000);
            jaExiste = await Conversation.findOne({
                user: req.user.id,
                question: { $regex: new RegExp(`^${message.trim()}$`, 'i') },
                createdAt: { $gte: limite }
            });
        }

        let atingiuLimite = false;
        if (req.user?.id) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const countHoje = await Conversation.countDocuments({
                user: req.user.id,
                createdAt: { $gte: hoje }
            });
            atingiuLimite = countHoje >= 20;
        }

        if (
            req.user?.id &&
            !isCurta &&
            !respostaRuim &&
            !jaExiste &&
            !atingiuLimite &&
            shouldStoreMessage(message, resposta)
        ) {
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

        return res.status(200).json({ resposta });

    } catch (error) {
        console.error('Erro no chatController:', error.message);
        return res.status(500).json({ message: 'Erro ao gerar resposta.' });
    }
};

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











