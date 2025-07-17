const cron = require('node-cron');
const ScheduledQuestion = require('../models/ScheduledQuestion');
const { ChatMessage } = require('../models/ChatMessage');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { getGeminiResponse } = require('../utils/geminiClient');
const { construirPrompt } = require('../utils/promptBuilder');
const { gerarTags } = require('../controllers/chatController');
const InterestingQuestion = require('../models/InterestingQuestion');

// Executa de minuto em minuto
cron.schedule('* * * * *', async () => {
    const now = new Date();

    try {
        const pendentes = await ScheduledQuestion.find({
            scheduledAt: { $lte: now },
            status: 'pending',
        });

        if (pendentes.length === 0) return;

        console.log(`📌 Encontradas ${pendentes.length} perguntas agendadas.`);

        // Processar todas as perguntas em paralelo controlado
        await Promise.all(pendentes.map(async (agendada) => {
            try {
                const user = await User.findById(agendada.userId);
                if (!user) throw new Error('Usuário não encontrado');

                const historico = await Conversation.find({ user: user._id })
                    .sort({ createdAt: -1 })
                    .limit(3);

                const prompt = construirPrompt(agendada.question, historico);
                const resposta = await getGeminiResponse(prompt);

                const userMsg = await ChatMessage.create({
                    sender: 'user',
                    user: user._id,
                    text: agendada.question,
                });

                const botMsg = await ChatMessage.create({
                    sender: 'bot',
                    text: resposta,
                    replyTo: userMsg._id,
                });

                await Conversation.create({
                    user: user._id,
                    question: agendada.question,
                    response: resposta,
                    status: 'sent',
                    createdAt: new Date(),
                });

                await InterestingQuestion.create({
                    usuarioId: user._id,
                    pergunta: agendada.question,
                    resposta,
                    tags: gerarTags(agendada.question),
                    status: 'nova',
                    data: new Date(),
                });

                if (agendada.repeat !== 'none') {
                    agendada.scheduledAt = getNextDate(agendada.scheduledAt, agendada.repeat);
                    agendada.status = 'pending';
                } else {
                    agendada.status = 'sent';
                }

                await agendada.save();

                console.log(`✅ Respondida: "${agendada.question}"`);
            } catch (err) {
                console.error('❌ Erro ao processar pergunta:', err.message);
                agendada.status = 'failed';
                await agendada.save();
            }
        }));
    } catch (err) {
        console.error('❌ Erro geral no cron job:', err.message);
    }
});

// Função auxiliar para repetição
function getNextDate(date, repeat) {
    const d = new Date(date);
    if (repeat === 'daily') d.setDate(d.getDate() + 1);
    if (repeat === 'weekly') d.setDate(d.getDate() + 7);
    if (repeat === 'monthly') d.setMonth(d.getMonth() + 1);
    return d;
}

