// models/InterestingQuestion.js
const mongoose = require('mongoose');

const interestingQuestionSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pergunta: { type: String, required: true },
    resposta: { type: String, required: true },
    status: { type: String, default: 'nova' },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterestingQuestion', interestingQuestionSchema);
