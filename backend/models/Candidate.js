// backend/models/Candidate.js
const mongoose = require("mongoose");

const AcademicSchema = new mongoose.Schema(
  {
    etablissement: String,
    autre: String,
    domaine: String,
    specialite: String,
    diplomePrepare: String,
    niveauEtudes: String,
  },
  { _id: false },
);

const ExperienceSchema = new mongoose.Schema(
  {
    entreprise: String,
    posteOccupe: String,
    dateDebut: String,
    dateFin: String,
    posteActuel: Boolean,
    description: String,
  },
  { _id: false },
);

const JobInfoSchema = new mongoose.Schema(
  {
    disponibilite: String,
    permisConduire: String,
    experienceComplementaire: String,
    lieuAffectation: String,
    competencesCandidat: [String],
  },
  { _id: false },
);

const CandidateSchema = new mongoose.Schema(
  {
    nom: String,
    prenom: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false, select: false },
    telephone: String,
    genre: String,
    salutation: String,
    adresse: String,
    codePostal: String,
    dateNaissance: String,
    lieuNaissance: String,
    cin: String,

    // Champs remplis via createApplication (avant on les perdait)
    academics: { type: [AcademicSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    jobInfo: { type: JobInfoSchema, default: {} },

    // Conservés pour compatibilité, mais plus utilisés en priorité par l'admin
    universite: String,
    diplome: String,

    localisation: { lat: Number, lng: Number, ville: String },
    cvUrl: String,
    lettreMotivationUrl: String,
    lettreAffectationUrl: String,
    cvTextExtrait: String,
    competencesExtraites: [String],

    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, select: false },
    verificationCodeExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Candidate", CandidateSchema);
