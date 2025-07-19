const cron = require('node-cron');
const ScheduledQuestion = require('../models/ScheduledQuestion');
const { ChatMessage } = require('../models/ChatMessage');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { getGeminiResponse } = require('../utils/geminiClient');
const { construirPrompt } = require('../utils/promptBuilder');
const { gerarTags } = require('../controllers/chatController');
const InterestingQuestion = require('../models/InterestingQuestion');

cron.schedule('* * * * *', async () => {
    const now = new Date();

    try {
        const pendentes = await ScheduledQuestion.find({
            scheduledAt: { $lte: now },
            status: 'pending',
        });

        if (pendentes.length === 0) {
            console.log("⏳ Nenhuma pergunta agendada encontrada.");
            return;
        }

        console.log(`📌 ${pendentes.length} perguntas agendadas encontradas.`);

        await Promise.all(pendentes.map(async (agendada, i) => {
            console.log(`\n🔄 Processando [${i + 1}/${pendentes.length}]: ${agendada.question}`);
            try {
                console.log("🔍 Buscando usuário:", agendada.userId);
                const user = await User.findById(agendada.userId);
                if (!user) throw new Error('Usuário não encontrado');

                const historico = await Conversation.find({ user: user._id })
                    .sort({ createdAt: -1 })
                    .limit(3);

                const prompt = construirPrompt(agendada.question, historico);
                const resposta = await getGeminiResponse(prompt);
                console.log("✅ Resposta obtida da IA");

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

                const conversa = await Conversation.create({
                    user: user._id,
                    question: agendada.question,
                    response: resposta,
                    status: 'sent',
                    createdAt: new Date(),
                });
                console.log("💬 Conversa salva:", conversa._id);

                const interessante = await InterestingQuestion.create({
                    usuarioId: user._id,
                    pergunta: agendada.question,
                    resposta,
                    tags: gerarTags(agendada.question),
                    status: 'nova',
                    data: new Date(),
                });
                console.log("✨ Interessante criada:", interessante._id);

                // Agendamento
                if (agendada.repeat !== 'none') {
                    agendada.scheduledAt = getNextDate(agendada.scheduledAt, agendada.repeat);
                    agendada.status = 'pending';
                    console.log("🔁 Reagendada para:", agendada.scheduledAt);
                } else {
                    agendada.status = 'sent';
                }

                await agendada.save();
                console.log(`✅ Finalizada: "${agendada.question}"`);

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

function getNextDate(date, repeat) {
    const d = new Date(date);
    if (repeat === 'daily') d.setDate(d.getDate() + 1);
    if (repeat === 'weekly') d.setDate(d.getDate() + 7);
    if (repeat === 'monthly') d.setMonth(d.getMonth() + 1);
    return d;
}


