const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const chatbotController = require("../controllers/chatbotController");

router.post("/parse-cv", aiController.parseCv);
router.post("/match", aiController.matchApplication);

router.post("/chatbot/start", chatbotController.startChatbot);
router.post("/chatbot/answer", chatbotController.answerChatbot);
router.get("/chatbot/result/:appId", chatbotController.getChatbotResult);

module.exports = router;
