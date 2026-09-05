const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");

// Extraction texte du CV
exports.extractCvText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text.slice(0, 6000);
};

// Appel LLM (Groq) pour le matching CV / Offre
exports.matchCvToJob = async (cvText, jobOffer) => {
  const competencesTechniques = Array.isArray(jobOffer.competencesTechniques)
    ? jobOffer.competencesTechniques
    : [];
  const competencesPersonnelles = Array.isArray(
    jobOffer.competencesPersonnelles,
  )
    ? jobOffer.competencesPersonnelles
    : [];

  const prompt = `
Tu es un expert RH. Compare ce CV avec les exigences du poste ci-dessous.
Réponds UNIQUEMENT en JSON valide, sans texte autour, avec ce format :
{
  "score": <nombre entre 0 et 100>,
  "competencesTrouvees": [...],
  "competencesManquantes": [...],
  "commentaire": "..."
}

CV:
"""
${cvText}
"""

Poste: ${jobOffer.titrePoste}
Mission: ${jobOffer.mission}
Profil recherché: ${jobOffer.profilRecherche}
Compétences techniques requises: ${competencesTechniques.join(", ")}
Compétences personnelles requises: ${competencesPersonnelles.join(", ")}
Diplôme requis: ${jobOffer.diplomeRequis}
Spécialité requise: ${jobOffer.specialiteRequise}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const raw = response.data.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

// Extraction des informations académiques depuis le texte du CV
exports.extractAcademicsFromCv = async (cvText) => {
  const prompt = `
Tu es un expert RH. Analyse ce CV et extrait UNIQUEMENT les informations de formation académique (diplômes, écoles, universités).

Réponds UNIQUEMENT en JSON valide, sans texte autour, avec ce format exact :
{
  "academics": [
    {
      "etablissement": "...",
      "domaine": "...",
      "specialite": "...",
      "diplomePrepare": "...",
      "niveauEtudes": "..."
    }
  ]
}

Règles :
- niveauEtudes doit être une de ces valeurs exactes : "BAC", "BAC + 1", "BAC + 2", "BAC + 3", "BAC + 4", "BAC + 5", "Doctorat".
- Si plusieurs diplômes sont mentionnés, liste-les tous, du plus récent au plus ancien.
- Si une information n'est pas trouvable dans le CV, mets une chaîne vide "" pour ce champ (jamais null).
- Si aucune formation n'est identifiable, réponds { "academics": [] }.

CV:
"""
${cvText}
"""
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const raw = response.data.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return Array.isArray(parsed.academics) ? parsed.academics : [];
};
