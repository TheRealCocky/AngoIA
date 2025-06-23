const Conversation = require('../models/Conversation');

const getUserHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await Conversation.find({
            participants: userId  // ou 'user' se for apenas um autor
        })
            .sort({ createdAt: -1 })
            .populate('participants', 'name email');

        res.status(200).json({ history });

    } catch (error) {
        console.error('Erro ao buscar histórico:', error.message);
        res.status(500).json({ message: 'Erro ao buscar histórico do usuário.' });
    }
};

module.exports = { getUserHistory };

