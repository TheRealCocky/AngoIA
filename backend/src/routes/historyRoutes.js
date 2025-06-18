// routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, getUserHistory);

module.exports = router;
