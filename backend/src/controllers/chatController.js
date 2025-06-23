// controllers/chatController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const InterestingQuestion = require('../models/InterestingQuestion');
const { ChatMessage } = require('../models/ChatMessage');

const { getGeminiResponse } = require('../utils/geminiClient');
const { construirPrompt } = require('../utils/promptBuilder');
const {
    isRelevantToAngola,
    isInterestingEnough,
    shouldStoreMessage
} = require('../utils/relevanceChecker');

// Mapa para limitar perguntas de visitantes por IP
const visitantes = new Map();

const isSaudacaoSimples = (texto = '') => {
    const frases = [
        "oi", "olá", "ola", "bom dia", "boa tarde", "boa noite",
        "como estás", "como vai", "tudo bem", "yá", "xê", "hello", "hi"
    ];
    return frases.includes(texto.trim().toLowerCase());
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

    // Autenticar via token
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

    // Limite de perguntas para visitantes
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

        // Tratamento para quando a API Gemini falha ou está sobrecarregada
        if (!resposta || resposta.includes('Erro') || resposta.includes('não consegui')) {
            return res.status(200).json({
                resposta: '😔 O sistema está sobrecarregado no momento. Tenta novamente dentro de alguns minutos.',
                _id: null,
                likes: [],
                dislikes: []
            });
        }

        const isCurta = message.trim().split(/\s+/).length <= 3;
        const respostaRuim = !resposta || resposta.includes('Erro') || resposta.includes('não consegui');

        // Se usuário não estiver logado, apenas retorna a resposta
        if (!req.user) {
            return res.status(200).json({
                resposta,
                _id: null,
                likes: [],
                dislikes: []
            });
        }

        // Armazenar apenas se for usuário autenticado
        const userMessage = await ChatMessage.create({
            sender: 'user',
            user: req.user._id,
            text: message
        });

        const botMessage = await ChatMessage.create({
            sender: 'bot',
            text: resposta,
            replyTo: userMessage._id
        });

        const limite = new Date(Date.now() - 3 * 86400000);
        const jaExiste = await Conversation.findOne({
            user: req.user.id,
            question: { $regex: new RegExp(`^${message.trim()}$`, 'i') },
            createdAt: { $gte: limite }
        });

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const countHoje = await Conversation.countDocuments({
            user: req.user.id,
            createdAt: { $gte: hoje }
        });

        const atingiuLimite = countHoje >= 20;

        let novaConversa = null;

        if (!isCurta && !respostaRuim && !jaExiste && !atingiuLimite && shouldStoreMessage(message, resposta)) {
            novaConversa = await Conversation.create({
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

        return res.status(200).json({
            resposta,
            _id: novaConversa?._id || botMessage._id,
            likes: novaConversa?.likes || [],
            dislikes: novaConversa?.dislikes || []
        });

    } catch (error) {
        console.error('Erro no chatController:', error.message);
        return res.status(500).json({ message: 'Erro ao gerar resposta.' });
    }
};


module.exports = { handleChat };













