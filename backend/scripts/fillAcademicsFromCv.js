// backend/scripts/fillAcademicsFromCv.js
require("dotenv").config();
const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
const aiService = require("../services/aiService");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connecté");

  // Candidats ayant un CV extrait mais sans formation académique enregistrée
  const candidates = await Candidate.find({
    cvTextExtrait: { $exists: true, $ne: "" },
    $or: [{ academics: { $exists: false } }, { academics: { $size: 0 } }],
  });

  console.log(`${candidates.length} candidat(s) à traiter.\n`);

  let success = 0;
  let empty = 0;
  let failed = 0;

  for (const candidate of candidates) {
    try {
      console.log(`→ ${candidate.email} (${candidate._id})`);
      const academics = await aiService.extractAcademicsFromCv(
        candidate.cvTextExtrait,
      );

      if (academics.length === 0) {
        console.log("  Aucune formation détectée dans le CV.");
        empty++;
      } else {
        candidate.academics = academics;
        await candidate.save();
        console.log(
          `  ✓ ${academics.length} formation(s) enregistrée(s) : ${academics
            .map((a) => a.diplomePrepare || a.etablissement || "?")
            .join(", ")}`,
        );
        success++;
      }
    } catch (err) {
      console.error(`  ✗ Erreur pour ${candidate.email} :`, err.message);
      failed++;
    }

    // Petite pause pour ne pas saturer l'API Groq
    await sleep(1500);
  }

  console.log("\n--- Résumé ---");
  console.log(`Mis à jour : ${success}`);
  console.log(`Sans formation détectée : ${empty}`);
  console.log(`Échecs : ${failed}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
