const Application = require("../models/Application");
const chatbotService = require("../services/chatbotService");

exports.startChatbot = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application =
      await Application.findById(applicationId).populate("jobOffer");

    application.statut = "chatbot_en_cours";
    await application.save();

    const question = await chatbotService.generateQuestion(
      chatbotService.themes[0],
      application.jobOffer.titrePoste,
    );

    res.json({ question, themeIndex: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.answerChatbot = async (req, res) => {
  try {
    const { applicationId, question, reponse, themeIndex } = req.body;
    const application =
      await Application.findById(applicationId).populate("jobOffer");

    const analyse = await chatbotService.analyzeAnswer(question, reponse);

    application.chatbotConversation.push({
      question,
      reponse,
      analyseIA: JSON.stringify(analyse),
    });

    const nextIndex = themeIndex + 1;

    if (nextIndex >= chatbotService.themes.length) {
      // Fin du chatbot -> calcul du score final
      const scores = application.chatbotConversation.map(
        (c) => JSON.parse(c.analyseIA).score,
      );
      const softSkillsScore = Math.round(
        (scores.reduce((a, b) => a + b, 0) / scores.length) * 10,
      );

      application.softSkillsScore = softSkillsScore;
      application.scoreGlobal = Math.round(
        application.matchingScore * 0.6 + softSkillsScore * 0.4,
      );
      application.statut = "chatbot_termine";
      await application.save();

      return res.json({
        done: true,
        softSkillsScore,
        scoreGlobal: application.scoreGlobal,
      });
    }

    await application.save();
    const nextQuestion = await chatbotService.generateQuestion(
      chatbotService.themes[nextIndex],
      application.jobOffer.titrePoste,
    );

    res.json({ done: false, nextQuestion, themeIndex: nextIndex });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChatbotResult = async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);
    if (!application) {
      return res.status(404).json({ error: "Candidature introuvable" });
    }
    res.json({
      softSkillsScore: application.softSkillsScore,
      scoreGlobal: application.scoreGlobal,
      conversation: application.chatbotConversation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
