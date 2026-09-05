const axios = require("axios");

const themes = [
  "motivation",
  "disponibilité",
  "gestion du stress",
  "travail en équipe",
];

exports.generateQuestion = async (theme, jobTitle) => {
  const prompt = `
Tu es un recruteur RH. Pose une question courte (une seule phrase) sur "${theme}"
au candidat pour le poste de "${jobTitle}". Réponds uniquement avec la question, sans préambule.
`;
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } },
  );
  return response.data.choices[0].message.content.trim();
};

exports.analyzeAnswer = async (question, answer) => {
  const prompt = `
Question posée: "${question}"
Réponse du candidat: "${answer}"

Analyse la pertinence et le professionnalisme de cette réponse.
Réponds UNIQUEMENT en JSON: { "score": <0-10>, "commentaire": "..." }
`;
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } },
  );
  const cleaned = response.data.choices[0].message.content
    .replace(/```json|```/g, "")
    .trim();
  return JSON.parse(cleaned);
};

exports.themes = themes;
