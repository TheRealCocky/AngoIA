const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const geminiRoutes = require('./src/routes/geminiRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const conversationRoutes = require('./src/routes/conversationRoute');
const messageRoutes = require('./src/routes/messageRoutes');
const chatMessagesRoutes = require('./src/routes/chatMessages');


const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

// Middleware
app.use(cors());
app.use(express.json());

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat-messages', chatMessagesRoutes);


// app.use('/api/feedback', feedbackRoutes); // descomentável se for usar

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB');

        app.listen(port, () => {
            console.log(`🚀 AngoIA backend rodando em:`);
            console.log(`🌐 Local:    http://localhost:${port}`);
            console.log(`🌍 Público:  ${baseUrl}`);
        });
    })
    .catch((err) => {
        console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    });

//http://localhost:3000/api/auth/register
//http://localhost:3000/api/chat




