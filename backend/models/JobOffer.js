const mongoose = require("mongoose");

const JobOfferSchema = new mongoose.Schema({
  reference: String, // ex: "2024/03"
  titrePoste: String, // ex: "تقني في شبكات الاتصال"
  diplomeRequis: String, // ex: "شهادة مؤهل تقني سامي أو ما يعادلها"
  specialiteRequise: String, // ex: "شبكات الاتصال أو ما يعادلها"
  repartitionPostes: [
    {
      lieu: String, // ex: "الإدارة المركزية للشبكات"
      nombre: Number, // ex: 9
    },
  ],
  dateDebutInscription: Date,
  dateFinInscription: Date,
  remarquesImportantes: [String], // "ملاحظات هامة" - liste de points
  procedureShugh: [String],
  mission: String,
  profilRecherche: String,
  principalesActivites: [String],
  competencesTechniques: [String],
  competencesPersonnelles: [String],
  // "صيغة إجراء عرض الشغل" - liste de points
  statut: { type: String, enum: ["ouvert", "ferme"], default: "ouvert" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobOffer", JobOfferSchema);
