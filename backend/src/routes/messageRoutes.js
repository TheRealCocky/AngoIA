const express = require('express');
const router = express.Router();
const { getMessagesByConversation, sendMessage } = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

// Buscar todas as mensagens de uma conversa
router.get('/:conversationId', auth, getMessagesByConversation);

// Enviar nova mensagem
router.post('/', auth, sendMessage);

module.exports = router;

