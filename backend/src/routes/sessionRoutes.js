const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const {createSession, getUserSessions} = require("../controllers/sessionController");
const auth = require('../middlewares/authMiddleware');

router.post('/', auth,createSession);

router.get('/:userId', auth,getUserSessions);

module.exports = router;