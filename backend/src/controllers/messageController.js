const Message = require('../models/Message');

const getMessagesByConversation = async (req, res) => {
    try {
        const messages = await Message.find({ conversation: req.params.conversationId })
            .sort({ createdAt: 1 }) // ordem cronológica
            .populate('sender', 'name email');

        res.status(200).json(messages);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error.message);
        res.status(500).json({ message: 'Erro ao buscar mensagens.' });
    }
};


const sendMessage = async (req, res) => {
    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    try {
        const message = new Message({
            conversation: conversationId,
            sender: senderId,
            content
        });

        await message.save();

        // (Opcional) atualizar o campo "lastMessage" na conversa
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: content,
            updatedAt: new Date()
        });

        const populated = await message.populate('sender', 'name email');

        res.status(201).json(populated);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
        res.status(500).json({ message: 'Erro ao enviar mensagem.' });
    }
};

module.exports = { getMessagesByConversation, sendMessage };