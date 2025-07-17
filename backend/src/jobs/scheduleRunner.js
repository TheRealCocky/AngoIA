const cron = require('node-cron');
const ScheduledQuestion = require('../models/ScheduledQuestion');
const { ChatMessage } = require('../models/ChatMessage');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { getGeminiResponse } = require('../utils/geminiClient');
const { construirPrompt } = require('../utils/promptBuilder');
const { gerarTags } = require('../controllers/chatController');
const InterestingQuestion = require('../models/InterestingQuestion');

// Tarefa cron: roda a cada minuto
cron.schedule('* * * * *', async () => {
    const now = new Date();

    // Busca todas as perguntas pendentes cuja data já passou
    const perguntas = await ScheduledQuestion.find({
        scheduledAt: { $lte: now },
        status: 'pending'
    });

    for (const agendada of perguntas) {
        try {
            const user = await User.findById(agendada.userId);
            if (!user) throw new Error('Usuário não encontrado');

            // Buscar últimas 3 conversas do usuário para contexto
            const historico = await Conversation.find({ user: user._id })
                .sort({ createdAt: -1 })
                .limit(3);

            // Construir o prompt e obter resposta da IA
            const prompt = construirPrompt(agendada.question, historico);
            const resposta = await getGeminiResponse(prompt);

            // Salvar mensagens no histórico de chat
            const userMsg = await ChatMessage.create({
                sender: 'user',
                user: user._id,
                text: agendada.question
            });

            const botMsg = await ChatMessage.create({
                sender: 'bot',
                text: resposta,
                replyTo: userMsg._id
            });

            // Salvar a conversa para notificação
            await Conversation.create({
                user: user._id,
                question: agendada.question,
                response: resposta,
                status: 'sent'
            });

            // Marcar como pergunta interessante
            await InterestingQuestion.create({
                usuarioId: user._id,
                pergunta: agendada.question,
                resposta,
                tags: gerarTags(agendada.question),
                status: 'nova',
                data: new Date()
            });

            // Marcar como enviada ou preparar próxima repetição
            if (agendada.repeat !== 'none') {
                agendada.scheduledAt = getNextDate(agendada.scheduledAt, agendada.repeat);
                agendada.status = 'pending';
            } else {
                agendada.status = 'sent';
            }

            await agendada.save();

            console.log(`✅ Pergunta agendada respondida: "${agendada.question}"`);

        } catch (err) {
            console.error('❌ Erro ao processar pergunta agendada:', err.message);
            agendada.status = 'failed';
            await agendada.save();
        }
    }
});

// Função auxiliar para calcular próxima data de repetição
function getNextDate(date, repeat) {
    const d = new Date(date);
    if (repeat === 'daily') d.setDate(d.getDate() + 1);
    if (repeat === 'weekly') d.setDate(d.getDate() + 7);
    if (repeat === 'monthly') d.setMonth(d.getMonth() + 1);
    return d;
}
