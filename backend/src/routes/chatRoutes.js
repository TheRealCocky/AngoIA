const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const offensiveFilter = require('../middlewares/offensiveFilter');

router.post('/',  offensiveFilter, handleChat);

module.exports = router;





