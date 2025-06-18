// middlewares/relevanceFilter.js
const { isRelevantToAngola } = require('../utils/relevanceChecker');

const relevanceFilter = (req, res, next) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Mensagem ausente.' });
    }

    if (!isRelevantToAngola(message)) {
        return res.status(200).json({
            resposta: 'Desculpe, só posso responder a perguntas relacionadas a Angola 🇦🇴.'
        });
    }

    next();
};

module.exports = relevanceFilter;
