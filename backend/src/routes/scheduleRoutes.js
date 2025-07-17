const express = require('express');
const router = express.Router();
const ScheduledQuestion = require('../models/ScheduledQuestion');
const auth = require('../middlewares/authMiddleware');

//agendar pergunta
router.post('/', auth, async (req,res)=>{
    console.log('REQ BODY:', req.body);
    const {question, scheduledAt, repeat}= req.body;

    if(!question || !scheduledAt) {
        return res.status(400).json({error: 'Pergunta e data são obrigatórias.'})
    }

    try{
        const novo = await ScheduledQuestion.create({
            userId: req.user.id,
            question,
            scheduledAt,
            repeat
        })
res.status(201).json(novo);
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

//buscar pergunta
router.get('/', auth, async (req,res)=>{
  try {
      const agendadas = await ScheduledQuestion.find({userId: req.user.id}).sort({scheduledAt: -1});
      res.json(agendadas);
  }catch (err) {
      res.status(500).json({error: err.message});
  }
})



module.exports = router;