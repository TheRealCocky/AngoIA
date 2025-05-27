const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

// import routes
const authRoutes = require('../backend/src/routes/authRoutes');
const chatRoutes = require('../backend/src/routes/chatRoutes');
const feedbackRoutes = require('../backend/src/routes/feedbackRoutes');
const {connection} = require("mongoose");


const app = express()
const port = process.env.PORT || 3000;

//MIDDLEWARE
app.use(cors())
app.use(express.json())
// Rotas
app.use('/api/auth', authRoutes);
//app.use('/api/chat', chatRoutes);
//app.use('/api/feedback', feedbackRoutes);


//Conexao com MongoDB
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Conectado ao MongoDB');
    app.listen(port, () => {
        console.log(`AngoIA backend running at http://localhost:${port}`)
    })

}).catch((err)=>{
    console.error('Erro ao conectar ao MongoDB:', err.message);
});
//http://localhost:3000/api/auth/register




