# TT Recrutement Intelligent

Plateforme de recrutement intelligente développée pour Tunisie Telecom (Direction Régionale Nabeul).

##  Fonctionnalités principales
- **Espace Admin** : création d'offres d'emploi, dashboard RH intelligent (top candidats, scores, statistiques), décision finale (accepter/refuser/entretien)
- **Espace Candidat** : consultation des offres, candidature avec upload de CV, suivi du statut
- **Matching IA** : analyse automatique du CV par rapport à l'offre (diplôme, compétences, expérience) via l'API Groq → score de matching
- **Chatbot de pré-sélection** : questions courtes (motivation, disponibilité, soft skills) pour les candidats à score élevé → Soft Skills Score
- **Dashboard RH** : top 10 candidats, score moyen, diplômes fréquents, compétences les plus demandées, carte géographique des candidats

##  Stack technique
- **Frontend** : React, React Router, Tailwind CSS, Axios
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Auth** : JWT + bcrypt
- **CV** : Multer (upload) + pdf-parse / mammoth (extraction texte)
- **IA** : Groq API (matching + chatbot)

##  Structure du projet
\`\`\`
backend/    → API Express (controllers, models, routes, services)
frontend/   → React app (pages admin/candidat, composants, hooks)
\`\`\`
