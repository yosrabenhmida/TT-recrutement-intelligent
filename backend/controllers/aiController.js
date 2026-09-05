const path = require("path");
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");
const JobOffer = require("../models/JobOffer");
const aiService = require("../services/aiService");

exports.parseCv = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const candidate = await Candidate.findById(candidateId);

    const filePath = path.join(__dirname, "..", candidate.cvUrl);
    const text = await aiService.extractCvText(filePath);

    candidate.cvTextExtrait = text;
    await candidate.save();

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.matchApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application =
      await Application.findById(applicationId).populate("candidate jobOffer");

    const result = await aiService.matchCvToJob(
      application.candidate.cvTextExtrait,
      application.jobOffer,
    );

    application.matchingScore = result.score;
    application.scoreGlobal = result.score; // affiché tel quel tant qu'il n'y a pas de chatbot
    application.competencesTrouvees = result.competencesTrouvees || [];
    application.competencesManquantes = result.competencesManquantes || [];
    application.commentaireIA = result.commentaire || "";

    await application.save();
    res.json({ ...result, applicationId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
