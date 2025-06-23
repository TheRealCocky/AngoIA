const { ChatMessage } = require('../models/ChatMessage');

// Retorna mensagens pareadas: { pergunta, resposta }
const getPairedMessages = async (req, res) => {
    try {
        const perguntas = await ChatMessage.find({ sender: 'user' })
            .sort({ createdAt: -1 })
            .limit(50); // limite opcional

        const pares = await Promise.all(perguntas.map(async (pergunta) => {
            const resposta = await ChatMessage.findOne({ replyTo: pergunta._id });
            return {
                pergunta,
                resposta
            };
        }));

        res.json(pares);
    } catch (err) {
        console.error('Erro ao buscar pares de mensagens:', err.message);
        res.status(500).json({ message: 'Erro ao buscar mensagens pareadas.' });
    }
};

module.exports = { getPairedMessages };
