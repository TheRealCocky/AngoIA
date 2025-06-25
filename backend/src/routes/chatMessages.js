// routes/chatMessages.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ChatMessage } = require('../models/ChatMessage');
const auth = require('../middlewares/authMiddleware');

/**
 * Middleware: valida o formato do ID
 */
const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }
    next();
};

/**
 * POST /:id/like
 * Dá like em uma mensagem e remove dislike (se existir)
 */
router.post('/:id/like', auth, validateId, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await ChatMessage.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId }
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /:id/dislike
 * Dá dislike e remove like (se existir)
 */
router.post('/:id/dislike', auth, validateId, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await ChatMessage.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId }
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /:id/unlike
 * Remove o like do usuário
 */
router.post('/:id/unlike', auth, validateId, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await ChatMessage.findByIdAndUpdate(
            req.params.id,
            { $pull: { likes: userId } },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /:id/undislike
 * Remove o dislike do usuário
 */
router.post('/:id/undislike', auth, validateId, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await ChatMessage.findByIdAndUpdate(
            req.params.id,
            { $pull: { dislikes: userId } },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /:id/favorite
 * Adiciona a mensagem aos favoritos do usuário
 */
router.post('/:id/favorite', auth, validateId, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await ChatMessage.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { favorites: userId } },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /:id/unfavorite
 * Remove a mensagem dos favoritos do usuário
 */
router.post('/:id/unfavorite', auth, validateId, async (req, res) => {
    const userId = req.user.id;
    try {
        const updated = await ChatMessage.findByIdAndUpdate(
            req.params.id,
            { $pull: { favorites: userId } },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /favorites
 * Lista todas as mensagens favoritedas pelo usuário logado
 */
router.get('/favorites', auth, async (req, res) => {
    try {
        const mensagens = await ChatMessage.find({ favorites: req.user.id });
        res.status(200).json(mensagens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});






/**
 * GET /:id
 * Recupera uma mensagem específica com likes/dislikes populados
 */
router.get('/:id', validateId, async (req, res) => {
    try {
        const msg = await ChatMessage.findById(req.params.id)
            .populate('likes', 'name')
            .populate('dislikes', 'name');
        if (!msg) return res.status(404).json({ error: "Mensagem não encontrada." });
        res.status(200).json(msg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /user
 * Recupera todas as mensagens enviadas pelo usuário logado
 */
router.get('/user', auth, async (req, res) => {
    try {
        const mensagens = await ChatMessage.find({ sender: req.user.id });
        res.status(200).json(mensagens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /bot/all
 * Recupera todas as mensagens enviadas pelo bot
 */
router.get('/bot/all', async (req, res) => {
    try {
        const mensagens = await ChatMessage.find({ sender: 'bot' }).sort({ createdAt: -1 });
        res.status(200).json(mensagens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;

