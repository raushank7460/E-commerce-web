const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  aiShoppingAssistantChat,
  aiSearch
} = require('../controllers/recommendationController');
const { optionalProtect } = require('../middleware/authMiddleware');

router.get('/', optionalProtect, getRecommendations);
router.post('/assistant', aiShoppingAssistantChat);
router.get('/ai-search', aiSearch);

module.exports = router;
