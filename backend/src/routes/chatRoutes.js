const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// exemplo de rota protegida
router.get('/mensagens', authMiddleware, (req, res) => {
    res.json({ message: 'Acesso autorizado às mensagens' });
});

module.exports = router;
