// services/aiMatching.js
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.matchCVWithJob = async (
  cvText,
  jobDescription,
  requiredSkills = [],
) => {
  // Sécurité : si requiredSkills n'est pas un tableau valide, on évite le crash
  const skillsList = Array.isArray(requiredSkills) ? requiredSkills : [];

  const prompt = `
  Voici un CV : ${cvText}
  Voici les exigences du poste : ${jobDescription}
  Compétences requises : ${skillsList.join(", ")}
  
  Donne un score de matching entre 0 et 100, 
  liste les compétences trouvées, les compétences manquantes,
  et retourne un JSON strict: 
  {"score": number, "skillsFound": [], "skillsMissing": []}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};
