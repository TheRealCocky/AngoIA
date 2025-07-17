const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const auth = require('../middlewares/authMiddleware');

// Like uma resposta
router.post('/:id/like', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await Conversation.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId }
            },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Conversa não encontrada." });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Dislike uma resposta (corrigido)
router.post('/:id/dislike', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await Conversation.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId }
            },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Conversa não encontrada." });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remover um like
router.post('/:id/unlike', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await Conversation.findByIdAndUpdate(
            req.params.id,
            { $pull: { likes: userId } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Conversa não encontrada." });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remover um dislike
router.post('/:id/undislike', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await Conversation.findByIdAndUpdate(
            req.params.id,
            { $pull: { dislikes: userId } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Conversa não encontrada." });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Obter detalhes de uma conversa com os likes/dislikes populados
router.get('/:id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('user', 'name email')
            .populate('likes', 'name email')
            .populate('dislikes', 'name email');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversação não encontrada.' });
        }

        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Rota para buscar todas as conversas do usuário autenticado
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const conversas = await Conversation.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(conversas);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar conversas.' });
    }
});


module.exports = router;

