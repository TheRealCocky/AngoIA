const SessionSchedule = require('../models/SessionSchedule');
const createSession=async (req,res)=>{
    const { thema, scheduledAt } = req.body;

    try {
        const novaSessao=await SessionSchedule.create({
            userId: req.user.id,// ← vem do token
            thema,
            scheduledAt
        });
        // Mock de resposta
        console.log('💾 Nova sessão:', novaSessao);
        res.status(201).json(novaSessao);
    }catch (err) {
        console.error('Erro ao criar sessão agendada:', err.message);
        res.status(500).json({ message: 'Erro interno ao agendar sessão.' });

    }
}
     const getUserSessions = async (req, res) => {
    try {
        const sessoes = await SessionSchedule.find({ userId: req.user.id }).sort({ scheduledAt: 1 });
        res.status(200).json(sessoes);
    } catch (err) {
        console.error('Erro ao buscar sessões:', err.message);
        res.status(500).json({ message: 'Erro interno ao listar sessões.' });
    }
};


module.exports = {createSession, getUserSessions}