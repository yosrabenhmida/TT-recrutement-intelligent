const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  jobOffer: { type: mongoose.Schema.Types.ObjectId, ref: "JobOffer" },
  matchingScore: Number,
  softSkillsScore: Number,
  scoreGlobal: Number,

  competencesTrouvees: { type: [String], default: [] },
  competencesManquantes: { type: [String], default: [] },
  commentaireIA: { type: String, default: "" },
  statut: {
    type: String,
    enum: [
      "nouveau",
      "invite_chatbot",
      "shortliste",
      "chatbot_en_cours",
      "chatbot_termine",
      "refuse",
      "embauche",
    ],
    default: "nouveau",
  },
  chatbotConversation: [
    { question: String, reponse: String, analyseIA: String },
  ],

  dateEntretien: { type: Date, default: null },
  lieuEntretien: { type: String, default: "" },
  noteEntretien: { type: String, default: "" },

  dateCandidature: { type: Date, default: Date.now },
  dateDecision: Date,
});

module.exports = mongoose.model("Application", ApplicationSchema);
