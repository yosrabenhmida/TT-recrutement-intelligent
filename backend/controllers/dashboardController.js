const mongoose = require("mongoose");
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");

// 🔎 Récupère le modèle des offres quel que soit son nom
function getJobModel() {
  const names = ["JobOffer", "Job", "Offre", "Offer"];
  for (const n of names) {
    if (mongoose.models[n]) return mongoose.models[n];
  }
  return null;
}

exports.getStats = async (req, res) => {
  try {
    const Job = getJobModel();
    const now = new Date();

    /* ---------- Existant ---------- */
    const totalApplications = await Application.countDocuments();

    const avgScoreAgg = await Application.aggregate([
      { $match: { scoreGlobal: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: "$scoreGlobal" } } },
    ]);

    const diplomesAgg = await Candidate.aggregate([
      { $group: { _id: "$diplome", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const competencesAgg = await Candidate.aggregate([
      { $unwind: "$competencesExtraites" },
      { $group: { _id: "$competencesExtraites", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const genreAgg = await Candidate.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
    ]);

    const uniAgg = await Candidate.aggregate([
      { $group: { _id: "$universite", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const funnel = await Application.aggregate([
      { $group: { _id: "$statut", count: { $sum: 1 } } },
    ]);

    /* ---------- Offres ---------- */
    let totalOffres = 0;
    let offresActives = 0;
    let totalPostes = 0;
    let candidaturesParOffre = [];
    let postesParLieu = [];

    if (!Job) {
      console.error(
        "❌ [dashboard] Modèle d'offres introuvable. Modèles chargés :",
        Object.keys(mongoose.models),
      );
    } else {
      const appCollection = Application.collection.name; // ex: "applications"

      totalOffres = await Job.countDocuments();

      // Active = pas de date de fin OU date de fin >= aujourd'hui
      offresActives = await Job.countDocuments({
        $or: [
          { dateFinInscription: { $exists: false } },
          { dateFinInscription: null },
          { dateFinInscription: "" },
          { dateFinInscription: { $gte: now } },
        ],
      });

      const postesAgg = await Job.aggregate([
        { $unwind: "$repartitionPostes" },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$repartitionPostes.nombre", 0] } },
          },
        },
      ]);
      totalPostes = postesAgg[0]?.total || 0;

      postesParLieu = await Job.aggregate([
        { $unwind: "$repartitionPostes" },
        {
          $group: {
            _id: "$repartitionPostes.lieu",
            count: { $sum: { $ifNull: ["$repartitionPostes.nombre", 0] } },
          },
        },
        { $match: { _id: { $nin: [null, ""] } } },
        { $sort: { count: -1 } },
      ]);

      // Compte les candidatures quel que soit le nom du champ de liaison
      candidaturesParOffre = await Job.aggregate([
        {
          $lookup: {
            from: appCollection,
            let: { jid: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$jobOffer", "$$jid"] },
                      { $eq: ["$job", "$$jid"] },
                      { $eq: ["$offre", "$$jid"] },
                    ],
                  },
                },
              },
            ],
            as: "apps",
          },
        },
        {
          $project: {
            _id: { $ifNull: ["$titrePoste", "Sans titre"] },
            count: { $size: "$apps" },
          },
        },
        { $sort: { count: -1 } },
      ]);
    }

    res.json({
      totalApplications,
      scoreMoyen: avgScoreAgg[0]?.avg?.toFixed(1) || 0,
      diplomes: diplomesAgg,
      competences: competencesAgg,
      genre: genreAgg,
      universites: uniAgg,
      funnel,
      totalOffres,
      offresActives,
      totalPostes,
      candidaturesParOffre,
      postesParLieu,
      _debug: {
        modeleOffres: Job?.modelName || null,
        collectionOffres: Job?.collection?.name || null,
        modelesCharges: Object.keys(mongoose.models),
      },
    });
  } catch (err) {
    console.error("❌ [dashboard/stats]", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTop10 = async (req, res) => {
  const top10 = await Application.find({ jobOffer: req.params.jobId })
    .populate("candidate")
    .sort({ scoreGlobal: -1 })
    .limit(10);
  res.json(top10);
};

exports.getGeoData = async (req, res) => {
  const candidates = await Candidate.find({
    "localisation.lat": { $ne: null },
  }).select("nom prenom localisation");
  res.json(candidates);
};
