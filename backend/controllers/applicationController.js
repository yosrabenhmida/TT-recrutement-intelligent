const Application = require("../models/Application");
const Candidate = require("../models/Candidate");
exports.createApplication = async (req, res) => {
  try {
    const { candidateData, academics, experiences, jobInfo, jobOfferId } =
      req.body;

    if (!candidateData?.email) {
      return res.status(400).json({ error: "Email du candidat requis" });
    }

    const email = candidateData.email.toLowerCase();

    // Crée le candidat s'il n'existe pas, ou met à jour ses infos s'il existe déjà
    // (findOneAndUpdate avec $set ne touche que les champs listés, donc le
    // mot de passe existant n'est jamais écrasé)
    const candidate = await Candidate.findOneAndUpdate(
      { email },
      {
        $set: {
          ...candidateData,
          email,
          academics: academics || [],
          experiences: experiences || [],
          jobInfo: jobInfo || {},
        },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );

    const application = await Application.create({
      candidate: candidate._id,
      jobOffer: jobOfferId,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobOffer: req.params.jobId })
      .populate("candidate")
      .sort({ scoreGlobal: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("candidate")
      .populate("jobOffer");
    if (!application)
      return res.status(404).json({ error: "Candidature introuvable" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { statut, dateDecision: new Date() },
      { returnDocument: "after" },
    );
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsByCandidate = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.params.candidateId,
    })
      .populate("jobOffer")
      .sort({ dateCandidature: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: recherche par email (utilisé par MonEspace.jsx : /candidate?email=...)
exports.getApplicationsByCandidateEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const candidate = await Candidate.findOne({ email: email.toLowerCase() });
    if (!candidate) {
      return res.json([]); // aucun candidat trouvé = aucune candidature
    }

    const applications = await Application.find({ candidate: candidate._id })
      .populate("jobOffer")
      .sort({ dateCandidature: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsByEmail = async (req, res) => {
  const { email } = req.query;
  const candidate = await Candidate.findOne({ email });
  if (!candidate) return res.json([]);
  const applications = await Application.find({ candidate: candidate._id })
    .populate("jobOffer")
    .sort({ dateCandidature: -1 });
  res.json(applications);
};

exports.inviteToChatbot = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { statut: "invite_chatbot" },
      { returnDocument: "after" },
    );
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Planifie ou modifie un entretien pour une candidature
exports.planifierEntretien = async (req, res) => {
  try {
    const { dateEntretien, lieuEntretien, noteEntretien } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        dateEntretien,
        lieuEntretien,
        noteEntretien,
        statut: "shortliste", // réutilise ton statut existant "Entretien"
      },
      { new: true },
    )
      .populate("candidate", "prenom nom email telephone")
      .populate("jobOffer", "titrePoste localisation");

    if (!application) {
      return res.status(404).json({ error: "Candidature introuvable" });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupère toutes les candidatures ayant un entretien planifié
exports.getEntretiens = async (req, res) => {
  try {
    const entretiens = await Application.find({
      dateEntretien: { $ne: null },
    })
      .populate("candidate", "prenom nom email telephone")
      .populate("jobOffer", "titrePoste localisation")
      .sort({ dateEntretien: 1 });
    res.json(entretiens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ error: "Candidature introuvable" });
    }

    res.json({ message: "Candidature supprimée avec succès", id });
  } catch (err) {
    console.error("Erreur suppression candidature :", err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
