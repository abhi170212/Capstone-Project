const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route to chat with Gemini, accessible only by logged in users
router.post('/chat', protect, chatWithAI);

module.exports = router;
