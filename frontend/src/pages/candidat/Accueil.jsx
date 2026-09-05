import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import useReveal from "../../hooks/useReveal";
import useCountUp from "../../hooks/useCountUp";
import DesinscriptionButton from "../../components/DesinscriptionButton";

/* ============================================================
   LOGO TT — forme goutte officielle Tunisie Telecom
   ============================================================ */
function TTLogo({
  className = "h-10 w-auto",
  showText = true,
  animated = false,
  ...rest
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? "tt-logo-animated" : ""}`}
      aria-label="Tunisie Telecom"
      role="img"
      {...rest}
    >
      <defs>
        <linearGradient id="tt-base" x1="20%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#29ABE2" />
          <stop offset="16%" stopColor="#00A99D" />
          <stop offset="32%" stopColor="#8DC63F" />
          <stop offset="48%" stopColor="#FFD100" />
          <stop offset="64%" stopColor="#F7941E" />
          <stop offset="80%" stopColor="#E6007E" />
          <stop offset="100%" stopColor="#92278F" />
        </linearGradient>

        <linearGradient id="tt-c1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4DD0F5" />
          <stop offset="100%" stopColor="#29ABE2" />
        </linearGradient>
        <linearGradient id="tt-c2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4C4" />
          <stop offset="100%" stopColor="#00A99D" />
        </linearGradient>
        <linearGradient id="tt-c3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B4E84A" />
          <stop offset="100%" stopColor="#8DC63F" />
        </linearGradient>
        <linearGradient id="tt-c4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE85A" />
          <stop offset="100%" stopColor="#FFD100" />
        </linearGradient>
        <linearGradient id="tt-c5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB04A" />
          <stop offset="100%" stopColor="#F7941E" />
        </linearGradient>
        <linearGradient id="tt-c6" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4A9A" />
          <stop offset="100%" stopColor="#E6007E" />
        </linearGradient>
        <linearGradient id="tt-c7" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B84AB8" />
          <stop offset="100%" stopColor="#92278F" />
        </linearGradient>
        <linearGradient id="tt-c8" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6AD8F5" />
          <stop offset="100%" stopColor="#29ABE2" />
        </linearGradient>
        <linearGradient id="tt-c9" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8EE05A" />
          <stop offset="100%" stopColor="#6AB82E" />
        </linearGradient>
        <linearGradient id="tt-c10" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B9A" />
          <stop offset="100%" stopColor="#E83A7A" />
        </linearGradient>

        <filter id="tt-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="tt-shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/*
        FORME OFFICIELLE :
        - Pointe en bas-gauche
        - Gros arrondi en haut-droite
        - Silhouette goutte / teardrop (comme l'image Tunisie Telecom)
      */}
      <g className="tt-logo-shape">
        {/* Silhouette exacte de la goutte */}
        <path
          d="M 145 35
             C 175 50, 185 90, 170 125
             C 158 152, 130 172, 100 178
             C 75 183, 52 172, 38 150
             C 22 125, 20 90, 35 60
             C 48 35, 80 18, 115 22
             C 128 24, 138 28, 145 35 Z"
          fill="url(#tt-base)"
          className="tt-logo-body"
        />

        {/* Facettes low-poly (couvrent toute la goutte) */}
        {/* Haut */}
        <path
          d="M145 35 L170 55 L150 65 L120 42 Z"
          fill="url(#tt-c1)"
          className="tt-facet"
        />
        <path
          d="M120 42 L150 65 L135 82 L95 55 Z"
          fill="url(#tt-c8)"
          className="tt-facet"
        />
        <path
          d="M95 55 L135 82 L115 95 L70 68 Z"
          fill="url(#tt-c2)"
          className="tt-facet"
        />

        {/* Droite */}
        <path
          d="M170 55 L170 125 L150 120 L150 65 Z"
          fill="url(#tt-c3)"
          className="tt-facet"
        />
        <path
          d="M150 65 L150 120 L130 125 L135 82 Z"
          fill="url(#tt-c9)"
          className="tt-facet"
        />
        <path
          d="M135 82 L130 125 L110 130 L115 95 Z"
          fill="url(#tt-c4)"
          className="tt-facet"
        />

        {/* Bas-droite */}
        <path
          d="M170 125 L100 178 L110 150 L150 120 Z"
          fill="url(#tt-c4)"
          className="tt-facet"
        />
        <path
          d="M150 120 L110 150 L95 155 L130 125 Z"
          fill="url(#tt-c5)"
          className="tt-facet"
        />
        <path
          d="M130 125 L95 155 L80 148 L110 130 Z"
          fill="url(#tt-c5)"
          className="tt-facet"
        />

        {/* Bas */}
        <path
          d="M100 178 L38 150 L55 140 L110 150 Z"
          fill="url(#tt-c6)"
          className="tt-facet"
        />
        <path
          d="M110 150 L55 140 L50 125 L95 155 Z"
          fill="url(#tt-c10)"
          className="tt-facet"
        />
        <path
          d="M95 155 L50 125 L55 110 L80 148 Z"
          fill="url(#tt-c6)"
          className="tt-facet"
        />

        {/* Gauche */}
        <path
          d="M38 150 L35 60 L55 70 L50 125 Z"
          fill="url(#tt-c7)"
          className="tt-facet"
        />
        <path
          d="M35 60 L70 68 L55 70 Z"
          fill="url(#tt-c2)"
          className="tt-facet"
        />
        <path
          d="M35 60 L95 55 L70 68 Z"
          fill="url(#tt-c2)"
          className="tt-facet"
        />
        <path
          d="M35 60 L115 22 L95 55 Z"
          fill="url(#tt-c1)"
          className="tt-facet"
        />
        <path
          d="M115 22 L145 35 L120 42 L95 55 Z"
          fill="url(#tt-c8)"
          className="tt-facet"
        />
        <path
          d="M115 22 L120 42 L95 55 Z"
          fill="url(#tt-c1)"
          className="tt-facet"
        />

        {/* Contour net */}
        <path
          d="M 145 35
             C 175 50, 185 90, 170 125
             C 158 152, 130 172, 100 178
             C 75 183, 52 172, 38 150
             C 22 125, 20 90, 35 60
             C 48 35, 80 18, 115 22
             C 128 24, 138 28, 145 35 Z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.2"
          strokeOpacity="0.25"
          strokeLinejoin="round"
        />
      </g>

      {/* Lettres TT — gras, blanc, centrées dans la goutte */}
      <g
        className="tt-logo-letters"
        filter={animated ? "url(#tt-glow)" : undefined}
      >
        {/* T gauche */}
        <path
          d="M52 62 h40 v11 h-14 v40 h-12 v-40 H52 Z"
          fill="#fff"
          className="tt-letter"
        />
        {/* T droite */}
        <path
          d="M108 62 h40 v11 h-14 v40 h-12 v-40 H108 Z"
          fill="#fff"
          className="tt-letter"
        />
      </g>

      {/* Texte à l'intérieur */}
      {showText && (
        <text
          x="100"
          y="140"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.5"
          className="tt-logo-text"
        >
          Tunisie Telecom
        </text>
      )}

      {animated && (
        <rect
          x="15"
          y="10"
          width="170"
          height="170"
          fill="url(#tt-shine)"
          className="tt-logo-shine"
          style={{ mixBlendMode: "soft-light" }}
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

/* ============================================================
   ICÔNES INLINE (zéro dépendance)
   ============================================================ */
const I = {
  search: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  pin: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  cap: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M2 8l10-4 10 4-10 4L2 8Z" />
      <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
    </svg>
  ),
  arrow: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M5 12h13" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  spark: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.9 5.6L19.5 9l-4.4 3.6L16.4 19 12 15.9 7.6 19l1.3-6.4L4.5 9l5.6-1.4L12 2Z" />
    </svg>
  ),
  brain: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 5.5a2.5 2.5 0 0 0-5 0A2.5 2.5 0 0 0 4.5 9 2.5 2.5 0 0 0 5 13.9 2.6 2.6 0 0 0 7.5 18c.9 1.1 3 1.4 4.5.6" />
      <path d="M12 5.5a2.5 2.5 0 0 1 5 0A2.5 2.5 0 0 1 19.5 9a2.5 2.5 0 0 1-.5 4.9 2.6 2.6 0 0 1-2.5 4.1c-.9 1.1-3 1.4-4.5.6" />
      <path d="M12 5.5v13" />
    </svg>
  ),
  doc: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  ),
  mail: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  dash: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <rect x="3" y="3" width="7.5" height="8" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="5" rx="2" />
      <rect x="3" y="14" width="7.5" height="7" rx="2" />
      <rect x="13.5" y="11" width="7.5" height="10" rx="2" />
    </svg>
  ),
  send: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  ),
  users: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M18 20a6.4 6.4 0 0 0-2-4.6" />
    </svg>
  ),
  target: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  chat: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5.2A8 8 0 1 1 21 12Z" />
      <path d="M9 11h6M9 14.5h3.5" />
    </svg>
  ),
  phone: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M4 5c0-1 .8-2 1.8-2h2.1c.8 0 1.5.6 1.7 1.4l.6 2.5c.2.7-.1 1.4-.7 1.8l-1.3.9a12.6 12.6 0 0 0 5.2 5.2l.9-1.3c.4-.6 1.1-.9 1.8-.7l2.5.6c.8.2 1.4.9 1.4 1.7v2.1c0 1-1 1.8-2 1.8A16.8 16.8 0 0 1 4 5Z" />
    </svg>
  ),
  menu: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  close: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  up: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  heart: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z" />
    </svg>
  ),
  shield: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 3l7 3v6c0 4.6-3 8-7 9-4-1-7-4.4-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  trophy: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5" />
      <path d="M12 13v3M9 20h6M10 16h4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2Z" />
    </svg>
  ),
  globe: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9Z" />
    </svg>
  ),
  quote: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M7 5C4.2 6.6 3 9 3 12.4 3 15.6 4.9 18 8 18v-4.2c-1.4 0-2-.9-2-2.3V11H9V5H7Zm9 0c-2.8 1.6-4 4-4 7.4 0 3.2 1.9 5.6 5 5.6v-4.2c-1.4 0-2-.9-2-2.3V11h3V5h-2Z" />
    </svg>
  ),
  clock: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  logout: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

/* ============================================================
   DONNÉES STATIQUES
   ============================================================ */
const NAV = [
  ["#home", "Accueil"],
  ["#jobs", "Offres"],
];

const TAGS_FALLBACK = [
  "Technicien Réseaux",
  "Conseiller Clientèle",
  "Ingénieur Télécom",
  "Commercial",
  "Chargé de Recrutement",
  "Support Technique",
  "Gestion & Finance",
  "Marketing",
];

const FEATURES = [
  {
    icon: I.search,
    t: "Search Jobs",
    d: "Recherche instantanée par métier, compétence, diplôme ou gouvernorat, avec filtres intelligents.",
    from: "from-[#29ABE2]",
    to: "to-[#00A99D]",
  },
  {
    icon: I.send,
    t: "Apply & Connect",
    d: "Candidature en 2 minutes : CV, informations clés, et connexion directe avec les recruteurs TT.",
    from: "from-[#00A99D]",
    to: "to-[#8DC63F]",
  },
  {
    icon: I.dash,
    t: "User Dashboard",
    d: "Un espace personnel pour suivre l'avancement de chaque candidature en temps réel.",
    from: "from-[#8DC63F]",
    to: "to-[#FFD100]",
  },
  {
    icon: I.doc,
    t: "Lecture automatique du CV",
    d: "Votre CV (PDF/DOCX) est lu automatiquement : expériences, diplômes et compétences sont pris en compte.",
    from: "from-[#FFD100]",
    to: "to-[#F7941E]",
  },
  {
    icon: I.brain,
    t: "Sélection intelligente",
    d: "Votre profil est comparé aux exigences du poste pour identifier les offres qui vous correspondent réellement.",
    from: "from-[#F7941E]",
    to: "to-[#E6007E]",
  },
  {
    icon: I.mail,
    t: "Email Notifications",
    d: "Alertes automatiques à chaque étape : réception, présélection, entretien et décision finale.",
    from: "from-[#E6007E]",
    to: "to-[#662D91]",
  },
];

const STEPS = [
  { n: "01", t: "Créez votre profil", d: "Compte candidat + dépôt de CV." },
  {
    n: "02",
    t: "Analyse du dossier",
    d: "Votre CV et vos informations sont étudiés.",
  },
  {
    n: "03",
    t: "Étude de la candidature",
    d: "Comparaison avec les critères du poste.",
  },
  {
    n: "04",
    t: "Entretien & réponse",
    d: "Suivi et notification à chaque étape.",
  },
];

const BENEFITS = [
  {
    icon: I.heart,
    t: "Bien-être & Avantages",
    d: "Assurance santé, primes, et un environnement de travail humain au quotidien.",
    color: "#E6007E",
  },
  {
    icon: I.trophy,
    t: "Évolution de carrière",
    d: "Des formations continues et de réelles opportunités de promotion interne.",
    color: "#F7941E",
  },
  {
    icon: I.shield,
    t: "Stabilité & Sécurité",
    d: "Rejoignez le plus grand opérateur du pays, un employeur solide et pérenne.",
    color: "#29ABE2",
  },
  {
    icon: I.globe,
    t: "Impact national",
    d: "Participez à connecter la Tunisie et à façonner son futur numérique.",
    color: "#00A99D",
  },
  {
    icon: I.clock,
    t: "Équilibre vie pro/perso",
    d: "Horaires flexibles et politiques de télétravail selon les postes.",
    color: "#8DC63F",
  },
  {
    icon: I.users,
    t: "Culture d'équipe",
    d: "Plus de 6500 collaborateurs, une communauté solidaire et bienveillante.",
    color: "#92278F",
  },
];

const GOUVERNORATS = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Gafsa",
  "Tozeur",
  "Kébili",
  "Gabès",
  "Médenine",
  "Tataouine",
];

/* ---- Helper pour normaliser une localisation ---- */
const normLoc = (v) =>
  (v || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // enlève les accents

const TESTIMONIALS = [
  {
    name: "Amine B.",
    role: "Technicien Réseaux",
    quote:
      "Ma candidature a été étudiée rapidement, et l'équipe RH m'a accompagné à chaque étape jusqu'à l'entretien.",
    initials: "AB",
    color: "#29ABE2",
  },
  {
    name: "Sarra K.",
    role: "Conseillère Clientèle",
    quote:
      "Le dépôt du dossier était simple, et j'ai pu suivre l'avancement de ma candidature en toute transparence.",
    initials: "SK",
    color: "#E6007E",
  },
  {
    name: "Youssef T.",
    role: "Chargé de Recrutement",
    quote:
      "Rejoindre Tunisie Telecom a été une évidence : un processus clair, humain, et une vraie perspective de carrière.",
    initials: "YT",
    color: "#8DC63F",
  },
];

/* ============================================================
   PAGE
   ============================================================ */
export default function Accueil() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(false);

  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Toutes");
  const [tri, setTri] = useState("recent");
  const searchRef = useRef(null);

  /* ---- Chargement des offres ---- */
  useEffect(() => {
    let vivant = true;
    api
      .get("/jobs")
      .then((res) => {
        if (!vivant) return;
        setOffres((res.data || []).filter((o) => o.statut === "ouvert"));
      })
      .catch(() => vivant && setErreur(true))
      .finally(() => vivant && setLoading(false));
    return () => {
      vivant = false;
    };
  }, []);

  /* ---- Raccourci clavier "/" pour focus la recherche ---- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const focusSearch = useCallback(() => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => searchRef.current?.querySelector("input")?.focus(), 500);
  }, []);

  const goJobs = useCallback(() => {
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ---- Villes disponibles ---- */
  const villes = useMemo(() => ["Toutes", ...GOUVERNORATS], []);

  /* ---- Tags rapides générés depuis les compétences réelles ---- */
  const tags = useMemo(() => {
    const count = {};
    offres.forEach((o) =>
      (o.competencesRequises || []).forEach((c) => {
        const k = (c || "").trim();
        if (k) count[k] = (count[k] || 0) + 1;
      }),
    );
    const top = Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k]) => k);
    return top.length ? top : TAGS_FALLBACK;
  }, [offres]);

  const resultats = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const villeNorm = normLoc(ville);

    let list = offres.filter((o) => {
      const loc = o.localisation || o.gouvernorat || o.ville || o.lieu;
      const okVille = ville === "Toutes" || normLoc(loc) === villeNorm;

      if (!needle) return okVille;

      const hay = [
        o.titre,
        o.description,
        o.diplomeRequis,
        loc,
        ...(o.competencesRequises || []),
      ]
        .join(" ")
        .toLowerCase();

      return okVille && hay.includes(needle);
    });

    if (tri === "recent") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (tri === "titre") {
      list = [...list].sort((a, b) =>
        (a.titre || "").localeCompare(b.titre || "", "fr"),
      );
    }
    return list;
  }, [offres, q, ville, tri]);

  useReveal([loading, resultats.length]);

  return (
    <div
      className="min-h-screen bg-white text-slate-800 antialiased overflow-x-hidden
                 selection:bg-[#29ABE2]/25 font-[Inter,system-ui,sans-serif]"
    >
      {/* ---- animations additionnelles (tilt, flip, particules, logo) ---- */}
      <style>{`
        /* ========== LOGO TT ANIMATIONS ========== */
        @keyframes tt-logo-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
          50% { transform: scale(1.04); filter: drop-shadow(0 0 12px rgba(41,171,226,.45)); }
        }
        @keyframes tt-logo-shine {
          0% { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(220%) skewX(-18deg); }
        }
        @keyframes tt-facet-shift {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0.95; }
        }
        @keyframes tt-letter-glow {
          0%, 100% { filter: drop-shadow(0 0 0 transparent); }
          50% { filter: drop-shadow(0 0 6px rgba(255,255,255,.7)); }
        }

        .tt-logo-animated .tt-logo-body {
          animation: tt-logo-pulse 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        .tt-logo-animated .tt-facet {
          animation: tt-facet-shift 4.2s ease-in-out infinite;
        }
        .tt-logo-animated .tt-facet:nth-child(2) { animation-delay: 0.15s; }
        .tt-logo-animated .tt-facet:nth-child(3) { animation-delay: 0.3s; }
        .tt-logo-animated .tt-facet:nth-child(4) { animation-delay: 0.45s; }
        .tt-logo-animated .tt-facet:nth-child(5) { animation-delay: 0.6s; }
        .tt-logo-animated .tt-facet:nth-child(6) { animation-delay: 0.75s; }
        .tt-logo-animated .tt-facet:nth-child(7) { animation-delay: 0.9s; }
        .tt-logo-animated .tt-facet:nth-child(8) { animation-delay: 1.05s; }
        .tt-logo-animated .tt-facet:nth-child(9) { animation-delay: 1.2s; }
        .tt-logo-animated .tt-facet:nth-child(10) { animation-delay: 1.35s; }
        .tt-logo-animated .tt-facet:nth-child(11) { animation-delay: 1.5s; }
        .tt-logo-animated .tt-facet:nth-child(12) { animation-delay: 1.65s; }
        .tt-logo-animated .tt-facet:nth-child(13) { animation-delay: 1.8s; }
        .tt-logo-animated .tt-facet:nth-child(14) { animation-delay: 1.95s; }
        .tt-logo-animated .tt-facet:nth-child(15) { animation-delay: 2.1s; }
        .tt-logo-animated .tt-facet:nth-child(16) { animation-delay: 2.25s; }
        .tt-logo-animated .tt-facet:nth-child(17) { animation-delay: 2.4s; }
        .tt-logo-animated .tt-facet:nth-child(18) { animation-delay: 2.55s; }

        .tt-logo-animated .tt-logo-letters {
          animation: tt-letter-glow 2.8s ease-in-out infinite;
        }
        .tt-logo-animated .tt-logo-shine {
          animation: tt-logo-shine 3.8s ease-in-out infinite;
        }

        /* ========== PARTICULES ========== */
        @keyframes tt-particle-float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          12% { opacity: .85; }
          50% { transform: translateY(-46px) translateX(6px); }
          88% { opacity: .35; }
          100% { transform: translateY(-96px) translateX(-4px); opacity: 0; }
        }
        .tt-particle { animation: tt-particle-float linear infinite; }

        /* ========== FLIP CARDS ========== */
        .tt-flip-card { perspective: 1300px; }
        .tt-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform .65s cubic-bezier(.2,.8,.2,1);
          transform-style: preserve-3d;
        }
        .tt-flip-card:hover .tt-flip-inner,
        .tt-flip-card:focus-within .tt-flip-inner { transform: rotateY(180deg); }
        .tt-flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .tt-flip-back { transform: rotateY(180deg); }

        /* ========== TILT SHINE ========== */
        .tt-tilt-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.4), transparent 45%);
          opacity: 0;
          transition: opacity .3s;
        }
        .tt-tilt:hover .tt-tilt-shine { opacity: 1; }

        /* ========== FADE SLIDE ========== */
        @keyframes tt-fade-slide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tt-fade-slide-enter { animation: tt-fade-slide .5s ease; }

        /* ========== REVEAL FAILSAFE ========== */
        @keyframes tt-reveal-failsafe {
          to { opacity: 1; transform: none; }
        }
        .tt-reveal {
          animation: tt-reveal-failsafe 0s linear .7s forwards;
        }

        /* ========== MARQUEE ========== */
        @keyframes tt-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .tt-marquee-track {
          animation: tt-marquee linear infinite;
        }
        .tt-marquee:hover .tt-marquee-track {
          animation-play-state: paused;
        }

        /* ========== FLOAT ========== */
        @keyframes tt-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .tt-float { animation: tt-float 5s ease-in-out infinite; }
        .tt-float-slow { animation: tt-float 8s ease-in-out infinite; }

        /* ========== PULSE RING ========== */
        @keyframes tt-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.6; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        .tt-ring {
          animation: tt-pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* ========== GRADIENT BAR ========== */
        .tt-gradient-bar {
          background: linear-gradient(90deg, #29ABE2, #00A99D, #8DC63F, #FFD100, #F7941E, #E6007E, #92278F);
        }
        .tt-gradient-text {
          background: linear-gradient(90deg, #29ABE2, #8DC63F, #FFD100, #E6007E);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* ========== GLASS ========== */
        .tt-glass {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .tt-glass-dark {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        /* ========== SHIMMER ========== */
        @keyframes tt-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .tt-shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: tt-shimmer 1.6s ease-in-out infinite;
        }

        /* ========== CARD HOVER ========== */
        .tt-card {
          transition: transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s;
        }
        .tt-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <Navbar nbOffres={offres.length} onSearch={focusSearch} />

      <Hero
        nbOffres={offres.length}
        offres={offres}
        loading={loading}
        onJoin={goJobs}
        onSearch={focusSearch}
      />
      <SearchBar
        innerRef={searchRef}
        q={q}
        setQ={setQ}
        ville={ville}
        setVille={setVille}
        villes={villes}
        tri={tri}
        setTri={setTri}
        tags={tags}
        onSubmit={goJobs}
      />

      <Jobs
        loading={loading}
        erreur={erreur}
        resultats={resultats}
        total={offres.length}
        q={q}
        reset={() => {
          setQ("");
          setVille("Toutes");
        }}
      />

      <Testimonials />

      <Footer />

      <BackToTop />
    </div>
  );
}

/* ============================================================
   COMPOSANTS D'INTERACTION (tilt / magnétisme / particules)
   ============================================================ */

/** Barre de progression de scroll, fine, en dégradé de marque */
function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const height = h.scrollHeight - h.clientHeight;
      setP(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-1 bg-slate-100/40">
      <div
        className="h-full tt-gradient-bar transition-[width] duration-150 ease-out"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

/** Petites particules flottantes décoratives (positions figées au premier rendu) */
function Particles({ count = 18 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 6,
        dur: 6 + Math.random() * 9,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-white/40 tt-particle"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Enveloppe "magnétique" : le contenu suit légèrement le curseur au survol */
function Magnetic({ children, strength = 16 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left - r.width / 2) / r.width) * strength;
    const y = ((e.clientY - r.top - r.height / 2) / r.height) * strength;
    setPos({ x, y });
  };
  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition:
          pos.x === 0 && pos.y === 0
            ? "transform .45s cubic-bezier(.2,.8,.2,1)"
            : "transform .08s linear",
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   1 · NAVBAR
   ============================================================ */
function Navbar({ nbOffres, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const userId = user?._id || user?.id || null;
  const userInitials = user
    ? `${(user.prenom || "")[0]}${(user.nom || "")[0]}`.toUpperCase() || "U"
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header
        className={`fixed top-1 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "tt-glass shadow-[0_10px_40px_-18px_rgba(6,47,110,.35)] py-2" : "py-4 bg-transparent"}`}
      >
        <nav className="mx-auto max-w-7xl px-5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <TTLogo
              className="h-11 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110"
              showText={false}
              animated
            />
            <span className="hidden sm:block leading-none">
              <span
                className={`block text-[15px] font-black tracking-tight transition-colors ${scrolled ? "text-[#062F6E]" : "text-white"}`}
              >
                TT <span className="tt-gradient-text">RECRUIT</span>
              </span>
              <span
                className={`block text-[9px] font-bold uppercase tracking-[.22em] transition-colors ${scrolled ? "text-slate-400" : "text-blue-100/70"}`}
              >
                Espace Carrières Officiel
              </span>
            </span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-full transition ${scrolled ? "text-slate-600 hover:text-[#0B4E9B] hover:bg-[#29ABE2]/10" : "text-blue-50/90 hover:text-white hover:bg-white/10"}`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* badge offres */}
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${scrolled ? "bg-[#3AAA35]/10 text-[#2f8a2b]" : "bg-white/12 text-white"}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#3AAA35] tt-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3AAA35]" />
              </span>
              {nbOffres} poste{nbOffres > 1 ? "s" : ""}
            </span>

            {/* recherche rapide */}
            <button
              onClick={onSearch}
              aria-label="Rechercher une offre"
              className={`hidden md:grid h-9 w-9 place-items-center rounded-full transition ${scrolled ? "text-slate-500 hover:bg-slate-100 hover:text-[#0B4E9B]" : "text-white/80 hover:bg-white/12 hover:text-white"}`}
            >
              <I.search className="h-5 w-5" />
            </button>

            {/* ===== AUTH : connecté vs déconnecté ===== */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className={`hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${scrolled ? "text-[#062F6E] hover:bg-slate-100" : "text-white hover:bg-white/12"}`}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFD100] text-xs font-black text-[#062F6E]">
                    {userInitials}
                  </span>
                  Mon compte
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    to="/mon-espace"
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <I.dash className="h-4 w-4 text-[#0B4E9B]" /> Mon espace
                  </Link>
                  <Link
                    to="/mon-espace?tab=candidatures"
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <I.doc className="h-4 w-4 text-[#0B4E9B]" /> Mes
                    candidatures
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-[#0B4E9B]"
                  >
                    <I.logout className="h-4 w-4" /> Déconnexion
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <div className="px-2 py-1">
                    <DesinscriptionButton userId={userId} variant="inline" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/Login"
                  className={`hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-bold transition ${scrolled ? "text-[#0B4E9B] hover:bg-[#0B4E9B]/8" : "text-white hover:bg-white/12"}`}
                >
                  Login
                </Link>
                <Magnetic strength={10}>
                  <Link
                    to="/register"
                    className="group relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#0B4E9B] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0B4E9B]/25 transition-transform hover:scale-105 active:scale-95"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#29ABE2] via-[#E6007E] to-[#FFD100] transition-transform duration-500 group-hover:translate-x-0" />
                    <span className="relative">Rejoindre</span>
                    <I.arrow className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
              </>
            )}

            {/* burger mobile */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className={`lg:hidden grid h-10 w-10 place-items-center rounded-xl transition ${scrolled ? "text-[#062F6E] hover:bg-slate-100" : "text-white hover:bg-white/12"}`}
            >
              <I.menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden transition ${open ? "visible" : "invisible"}`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#03214f]/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white p-6 shadow-2xl transition-transform duration-400 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <TTLogo className="h-11 w-auto" animated />
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <I.close className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map(([href, label], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold text-[#062F6E] transition hover:bg-slate-50"
              >
                <span
                  className="h-2 w-2 rounded-full transition-transform group-hover:scale-150"
                  style={{
                    background: [
                      "#29ABE2",
                      "#00A99D",
                      "#FFD100",
                      "#F7941E",
                      "#E6007E",
                    ][i % 5],
                  }}
                />
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-auto space-y-3 pt-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/mon-espace"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl bg-[#0B4E9B] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#0B4E9B]/25"
                >
                  Mon espace
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-full rounded-2xl border border-slate-200 py-3.5 text-center text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Déconnexion
                </button>
                <div className="px-2 pt-2">
                  <DesinscriptionButton userId={userId} />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-slate-200 py-3.5 text-center text-sm font-bold text-[#0B4E9B] transition hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl bg-[#0B4E9B] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#0B4E9B]/25"
                >
                  Rejoindre
                </Link>
              </>
            )}
            <p className="pt-2 text-center text-[11px] text-slate-400">
              {nbOffres} offre{nbOffres > 1 ? "s" : ""} ouverte
              {nbOffres > 1 ? "s" : ""}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ============================================================
   2 · HERO COMBINÉ
   ============================================================ */

const STEP_ICONS = [I.doc, I.brain, I.target, I.chat];
const STEP_COLORS = ["#29ABE2", "#8DC63F", "#F7941E", "#E6007E"];

/* Salaire : supporte salaire / salaireMin / salaireMax (optionnels côté API) */
function formatSalaire(o) {
  if (o.salaireMin && o.salaireMax)
    return `${Number(o.salaireMin).toLocaleString("fr-FR")} – ${Number(
      o.salaireMax,
    ).toLocaleString("fr-FR")} DT`;
  const s = o.salaire ?? o.salaireMin ?? o.remuneration;
  if (!s) return null;
  return typeof s === "number" ? `${s.toLocaleString("fr-FR")} DT` : String(s);
}

function Hero({ nbOffres, offres = [], loading = false, onJoin, onSearch }) {
  /* ---------- A · Construction de la piste du carrousel ---------- */
  const vedettes = useMemo(() => offres.slice(0, 8), [offres]);

  // on répète les offres jusqu'à avoir au moins 4 cartes (sinon la boucle "saute")
  const base = useMemo(() => {
    if (!vedettes.length) return [];
    const out = [...vedettes];
    while (out.length < 4) out.push(...vedettes);
    return out;
  }, [vedettes]);

  // piste = base dupliquée 2× → translateX(-50%) = boucle parfaitement continue
  const piste = useMemo(() => [...base, ...base], [base]);
  const duree = Math.max(30, base.length * 7); // vitesse constante quel que soit le nb de cartes

  /* ---------- B · Timeline : étape active en boucle ---------- */
  const [etape, setEtape] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setEtape((e) => (e + 1) % STEPS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const pct = (etape / (STEPS.length - 1)) * 100;
  const retourDebut = etape === 0; // on coupe la transition au rembobinage

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-32 pb-36 md:pt-36 scroll-mt-24"
    >
      {/* ---------- FONDS ---------- */}
      <div className="absolute inset-0 -z-10 bg-[#03214f]" />
      <div
        className="absolute inset-0 -z-10 opacity-90
        bg-[radial-gradient(60%_60%_at_15%_18%,#0b4e9b_0%,transparent_60%),radial-gradient(50%_50%_at_85%_10%,#29abe2_0%,transparent_60%),radial-gradient(55%_55%_at_75%_85%,#92278f_0%,transparent_60%),radial-gradient(45%_45%_at_25%_90%,#00a99d_0%,transparent_60%)]"
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]
        [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
        [background-size:56px_56px]
        [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]"
      />
      <Particles count={20} />
      <div className="absolute -left-24 top-24 -z-10 h-80 w-80 rounded-full bg-[#29ABE2]/25 blur-[100px] tt-float" />
      <div className="absolute right-10 bottom-10 -z-10 h-96 w-96 rounded-full bg-[#E6007E]/20 blur-[110px] tt-float-slow" />

      <div className="mx-auto max-w-7xl px-5">
        {/* ================= LIGNE 1 : TEXTE + CARROUSEL ================= */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          {/* ---------- TEXTE ---------- */}
          <div className="min-w-0 text-white">
            <span className="tt-reveal" data-delay="0">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/25 tt-glass-dark
                           px-4 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-white/90"
              >
                <I.spark className="h-3.5 w-3.5 text-[#FFD100]" />
                Recrutement Officiel · Tunisie Telecom
              </span>
            </span>

            <h1
              className="tt-reveal mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]"
              data-delay="1"
            >
              TUNISIE TELECOM
              <br />
              <span className="tt-gradient-text">RECRUTE, ET VOUS ?</span>
            </h1>

            <p
              className="tt-reveal mt-6 max-w-xl text-lg leading-relaxed text-blue-100/85"
              data-delay="2"
            >
              Bienvenue 👋 Ces postes sont{" "}
              <strong className="font-bold text-white">
                ouverts dès maintenant
              </strong>
              . Déposez simplement votre CV : notre{" "}
              <strong className="font-bold text-white">
                assistant de matching
              </strong>{" "}
              se charge de vous rapprocher, en douceur, des offres qui vous
              correspondent le mieux.
            </p>

            <div
              className="tt-reveal mt-9 flex flex-wrap items-center gap-4"
              data-delay="3"
            >
              <Magnetic strength={14}>
                <button
                  onClick={onJoin}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full
                             bg-white px-8 py-4 text-sm font-black text-[#0B4E9B] shadow-2xl
                             transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 tt-gradient-bar opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative transition-colors group-hover:text-white">
                    Voir les {nbOffres} offres
                  </span>
                  <I.arrow className="relative h-4 w-4 transition-all group-hover:translate-x-1 group-hover:text-white" />
                </button>
              </Magnetic>

              <button
                onClick={onSearch}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4
                           text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                <I.search className="h-4 w-4" />
                Rechercher un poste
                <kbd className="ml-1 hidden rounded border border-white/30 px-1.5 py-0.5 text-[10px] font-black sm:inline">
                  /
                </kbd>
              </button>
            </div>

            <div
              className="tt-reveal mt-11 grid max-w-lg grid-cols-3 gap-4"
              data-delay="4"
            >
              <MiniStat
                value={nbOffres}
                suffix=""
                label="Offres ouvertes"
                color="#29ABE2"
              />
              <MiniStat
                value={6500}
                suffix="+"
                label="Collaborateurs"
                color="#8DC63F"
              />
              <MiniStat
                value={24}
                suffix=""
                label="Gouvernorats"
                color="#E6007E"
              />
            </div>
          </div>

          {/* ---------- EMBLÈME TT (signature visuelle) ---------- */}
          <div className="pointer-events-none absolute -top-24 right-4 -z-10 hidden lg:block">
            <div className="relative grid h-44 w-44 place-items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute rounded-full border"
                  style={{
                    width: 110 + i * 52,
                    height: 110 + i * 52,
                    borderColor: ["#29ABE2", "#FFD100", "#E6007E"][i],
                    opacity: 0.3 - i * 0.07,
                    animation: `tt-pulse-ring 3.4s ease-out ${i * 1.1}s infinite`,
                  }}
                />
              ))}
              <span className="grid h-20 w-20 place-items-center rounded-[38%] tt-glass-dark border border-white/25 shadow-[0_20px_50px_-15px_rgba(0,0,0,.7)]">
                <TTLogo className="h-12 w-12" showText={false} animated />
              </span>
            </div>
          </div>

          {/* ---------- CARROUSEL "OFFRES EN VEDETTE" ---------- */}
          <div
            className="tt-reveal relative w-full min-w-0 max-w-full overflow-hidden"
            data-delay="2"
          >
            {/* entête du panneau */}
            <div className="mb-4 flex items-end justify-between px-1">
              <div className="flex items-center gap-3">
                {/* pastille logo */}
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/95 shadow-lg">
                  <TTLogo className="h-7 w-7" showText={false} animated />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[.18em] text-white/70">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#8DC63F] tt-ring" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8DC63F]" />
                    </span>
                    Offres en vedette
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-100/70">
                    Tunisie Telecom · Postulez en 2 minutes
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold text-white/60 sm:block">
                survolez pour figer
              </span>
            </div>

            {/* zone de défilement */}
            <div
              className="tt-marquee relative w-full max-w-full overflow-hidden rounded-[28px]
             border border-white/15 tt-glass-dark p-4
             [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
            >
              {loading && (
                <div className="flex gap-4">
                  {[0, 1].map((i) => (
                    <HeroCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!loading && piste.length === 0 && (
                <div className="grid h-[260px] place-items-center px-6 text-center">
                  <div>
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-2xl">
                      🔔
                    </div>
                    <p className="mt-4 text-sm font-bold text-white">
                      Aucune offre ouverte pour l'instant
                    </p>
                    <p className="mt-1 text-xs text-blue-100/70">
                      Créez votre profil : on vous préviendra dès la prochaine
                      publication, promis 🙂
                    </p>
                    <Link
                      to="/register"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5
                                 text-xs font-black text-[#0B4E9B]"
                    >
                      Créer mon profil <I.arrow className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {!loading && piste.length > 0 && (
                <div
                  className="tt-marquee-track flex w-max flex-nowrap gap-4"
                  style={{ animationDuration: `${duree}s` }}
                >
                  {piste.map((o, i) => (
                    <HeroJobCard
                      key={`${o._id}-${i}`}
                      offre={o}
                      index={i % base.length}
                      /* la 2e moitié est un clone visuel → invisible aux lecteurs d'écran */
                      aria-hidden={i >= base.length}
                    />
                  ))}
                </div>
              )}
            </div>

            <p className="mt-3 px-1 text-center text-[11px] font-semibold text-blue-100/50">
              Défilement automatique · pause au survol
            </p>
          </div>
        </div>

        {/* ================= LIGNE 2 : PARCOURS CANDIDAT ================= */}
        <div
          className="tt-reveal mt-20 rounded-[32px] border border-white/15 tt-glass-dark px-6 py-9 sm:px-10"
          data-delay="3"
        >
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.18em] text-white/60">
                Parcours candidat
              </p>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                4 étapes pour rejoindre{" "}
                <span className="tt-gradient-text">Tunisie Telecom</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <TTLogo className="h-9 w-9" showText={false} animated />
              <span className="text-xs font-semibold text-blue-100/70">
                Live · Étape {etape + 1}/4
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative mt-10">
            {/* barre de progression */}
            <div className="absolute left-0 right-0 top-7 hidden h-1 rounded-full bg-white/10 sm:block">
              <div
                className="h-full rounded-full tt-gradient-bar transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  transition: retourDebut ? "none" : undefined,
                }}
              />
            </div>

            <ol className="grid gap-6 sm:grid-cols-4">
              {STEPS.map((step, i) => {
                const active = i === etape;
                const done = i < etape;
                const Icon = STEP_ICONS[i];
                return (
                  <li
                    key={step.n}
                    className={`relative flex flex-col items-center text-center transition-all duration-500 ${
                      active ? "scale-105" : "opacity-70"
                    }`}
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg transition-all duration-500 ${
                        active ? "scale-110 shadow-xl" : ""
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${STEP_COLORS[i]}, ${
                          ["#00A99D", "#FFD100", "#FFD100", "#92278F"][i]
                        })`,
                        boxShadow: active
                          ? `0 0 0 4px ${STEP_COLORS[i]}33, 0 12px 30px -8px ${STEP_COLORS[i]}88`
                          : undefined,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-xs font-black uppercase tracking-wider text-white/50">
                      {step.n}
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {step.t}
                    </p>
                    <p className="mt-1 text-xs text-blue-100/60">{step.d}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Carte offre hero ---------- */
const HERO_ACCENTS = [
  { bar: "from-[#29ABE2] to-[#00A99D]", icon: "#29ABE2" },
  { bar: "from-[#8DC63F] to-[#FFD100]", icon: "#8DC63F" },
  { bar: "from-[#F7941E] to-[#E6007E]", icon: "#F7941E" },
  { bar: "from-[#92278F] to-[#662D91]", icon: "#92278F" },
];

function HeroJobCard({ offre: o, index, ...rest }) {
  const a = HERO_ACCENTS[index % HERO_ACCENTS.length];
  const titre = o.titre || "Poste ouvert";
  const lieu = o.localisation || o.gouvernorat || o.ville || o.lieu;
  const diplome = o.diplomeRequis;
  const salaire = formatSalaire(o);

  return (
    <article
      className="group relative flex w-[290px] shrink-0 flex-col overflow-hidden rounded-3xl
                 border border-white/15 bg-white/[.07] p-5 backdrop-blur-sm
                 transition-all duration-300 hover:bg-white/[.12] hover:border-white/25"
      {...rest}
    >
      {/* barre colorée en haut */}
      <span
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`}
      />

      {/* Filigrane logo TT */}
      <span
        className="pointer-events-none absolute -bottom-3 -right-2 opacity-[.07]
                   transition-all duration-500 group-hover:opacity-[.16] group-hover:rotate-6"
      >
        <TTLogo className="h-24 w-24" showText={false} />
      </span>

      {/* ========== ENTÊTE : Titre + Badge Ouvert ========== */}
      <div className="relative flex items-start justify-between gap-2">
        <h3
          dir="auto"
          className="line-clamp-2 text-[15px] font-black leading-snug text-white"
        >
          {titre}
        </h3>

        {/* Badge "Ouvert" */}
        <span
          className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full 
                         bg-[#8DC63F]/20 px-2 py-0.5 text-[9px] font-black uppercase 
                         tracking-wide text-[#c6e88a]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#8DC63F]" />
          Ouvert
        </span>
      </div>

      {/* ========== LOCALISATION + DIPLÔME ========== */}
      <div
        className="relative mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 
                      text-[11px] font-semibold text-blue-100/75"
      >
        {lieu && (
          <span dir="auto" className="inline-flex items-center gap-1">
            <I.pin className="h-3.5 w-3.5" style={{ color: a.icon }} />
            {lieu}
          </span>
        )}

        {diplome && (
          <span dir="auto" className="inline-flex items-center gap-1">
            <I.cap className="h-3.5 w-3.5" style={{ color: a.icon }} />
            {diplome}
          </span>
        )}
      </div>

      {/* ========== SALAIRE (si dispo) ========== */}
      {salaire && (
        <p
          className="relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg 
                      bg-white/10 px-2.5 py-1 text-[11px] font-black text-[#FFD100]"
        >
          <I.bolt className="h-3 w-3" />
          {salaire}
        </p>
      )}

      {/* ========== COMPÉTENCES ========== */}
      {o.competencesRequises?.length > 0 && (
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {o.competencesRequises.slice(0, 2).map((c, i) => (
            <span
              key={i}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] 
                         font-bold text-blue-50/90"
            >
              {c}
            </span>
          ))}
          {o.competencesRequises.length > 2 && (
            <span
              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] 
                           font-bold text-blue-50/60"
            >
              +{o.competencesRequises.length - 2}
            </span>
          )}
        </div>
      )}

      {/* ========== BOUTON "POSTULER" (poussé en bas) ========== */}
      <Link
        to={`/offres/${o._id}`}
        tabIndex={rest["aria-hidden"] ? -1 : 0}
        className="relative mt-auto inline-flex items-center justify-center gap-1.5 
                   rounded-full bg-white px-4 py-2.5 text-xs font-black text-[#0B4E9B] 
                   transition hover:bg-[#FFD100] active:scale-95"
      >
        Postuler
        <I.arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}

/* ---------- Skeleton carte hero ---------- */
function HeroCardSkeleton() {
  return (
    <div className="w-[290px] shrink-0 rounded-3xl border border-white/10 bg-white/[.06] p-5">
      <div className="h-4 w-3/4 animate-pulse rounded bg-white/15" />
      <div className="mt-3 flex gap-2">
        <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-4 h-6 w-28 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-white/10" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="mt-5 h-9 w-full animate-pulse rounded-full bg-white/15" />
    </div>
  );
}

function MiniStat({ value, suffix, label, color }) {
  const [ref, n] = useCountUp(value, 1600);
  return (
    <div ref={ref}>
      <p
        className="text-2xl font-black tabular-nums sm:text-3xl"
        style={{ color }}
      >
        {n.toLocaleString("fr-FR")}
        {suffix}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-100/70">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   3 · BARRE DE RECHERCHE + TAGS RAPIDES
   ============================================================ */
function SearchBar({
  innerRef,
  q,
  setQ,
  ville,
  setVille,
  villes,
  tri,
  setTri,
  tags,
  onSubmit,
}) {
  return (
    <section
      ref={innerRef}
      className="relative z-30 mx-auto -mt-10 max-w-5xl px-5"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="tt-reveal rounded-[32px] border border-slate-100 bg-white p-4
                   shadow-[0_30px_80px_-40px_rgba(6,47,110,.45)] sm:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          {/* champ recherche */}
          <label className="group relative flex-1">
            <I.search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2
                         text-slate-400 transition-colors group-focus-within:text-[#0B4E9B]"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cherchez un métier, une compétence, une technologie…"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-4 pl-12 pr-10 text-sm
                         font-medium outline-none transition
                         focus:border-[#29ABE2] focus:bg-white focus:ring-4 focus:ring-[#29ABE2]/15"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-1
                           text-xs font-bold text-slate-500 transition hover:bg-slate-200"
              >
                ✕
              </button>
            )}
          </label>

          {/* select ville */}
          <Select
            value={ville}
            onChange={setVille}
            options={villes}
            icon={I.pin}
            label="Gouvernorat"
          />

          {/* select tri */}
          <Select
            value={tri}
            onChange={setTri}
            icon={I.spark}
            options={[
              { v: "recent", l: "Plus récentes" },
              { v: "titre", l: "A-Z" },
            ]}
            label="Trier par"
          />
        </div>

        {/* tags rapides */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tendances :
          </span>
          {tags.slice(0, 5).map((tag, i) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQ(tag)}
              className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/60
                         px-3.5 py-1.5 text-[11px] font-bold text-slate-600
                         transition hover:border-transparent hover:bg-[#0B4E9B] hover:text-white"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: [
                    "#29ABE2",
                    "#8DC63F",
                    "#FFD100",
                    "#F7941E",
                    "#E6007E",
                  ][i % 5],
                }}
              />
              {tag}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}

/* ============================================================
   4 · SECTION OFFRES
   ============================================================ */
function Jobs({ loading, erreur, resultats, total, q, reset }) {
  return (
    <section id="jobs" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-24">
      <SectionTitle
        kicker="Offres ouvertes"
        title={
          <>
            Trouvez votre prochaine{" "}
            <span className="tt-gradient-text">opportunité chez TT</span>
          </>
        }
        subtitle={`${total} poste${total > 1 ? "s" : ""} ouverte${total > 1 ? "s" : ""} actuellement. Filtrez, postulez, et suivez votre candidature en temps réel.`}
      />

      <div className="mt-12">
        {/* CHARGEMENT */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ERREUR */}
        {!loading && erreur && (
          <EmptyState
            emoji="⚠️"
            title="Oups, un petit souci de chargement"
            text="Rien de grave — réessayez dans un instant, tout devrait revenir à la normale."
            action={
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-[#0B4E9B] px-6 py-3 text-sm font-bold text-white
                           transition hover:scale-105 active:scale-95"
              >
                Recharger la page
              </button>
            }
          />
        )}

        {/* AUCUN RÉSULTAT */}
        {!loading && !erreur && resultats.length === 0 && (
          <EmptyState
            emoji={total === 0 ? "🔍" : "📭"}
            title={
              total === 0
                ? "Aucune offre publiée pour le moment"
                : "Aucun résultat pour cette recherche"
            }
            text={
              total === 0
                ? "Revenez bientôt : de nouvelles opportunités arrivent chaque mois."
                : "Essayez un autre mot-clé ou changez de gouvernorat, la bonne offre n'est peut-être pas loin."
            }
            action={
              total > 0 && (
                <button
                  onClick={reset}
                  className="rounded-full bg-[#0B4E9B] px-6 py-3 text-sm font-bold text-white
                             transition hover:scale-105 active:scale-95"
                >
                  Réinitialiser les filtres
                </button>
              )
            }
          />
        )}

        {/* RÉSULTATS */}
        {!loading && resultats.length > 0 && (
          <>
            <p className="mb-6 text-sm font-semibold text-slate-500">
              <span className="font-black text-[#0B4E9B]">
                {resultats.length}
              </span>{" "}
              offre{resultats.length > 1 ? "s" : ""} correspondant
              {q && (
                <>
                  {" "}
                  à <span className="font-bold text-[#062F6E]">"{q}"</span>
                </>
              )}
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resultats.map((o, i) => (
                <OffreCard key={o._id} offre={o} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* -------- Carte offre -------- */
const ACCENTS = [
  {
    bar: "from-[#29ABE2] to-[#00A99D]",
    chip: "bg-[#29ABE2]/10 text-[#0B7BB5]",
    icon: "#29ABE2",
  },
  {
    bar: "from-[#8DC63F] to-[#FFD100]",
    chip: "bg-[#8DC63F]/15 text-[#5f8a1f]",
    icon: "#8DC63F",
  },
  {
    bar: "from-[#F7941E] to-[#E6007E]",
    chip: "bg-[#F7941E]/12 text-[#c26a10]",
    icon: "#F7941E",
  },
  {
    bar: "from-[#92278F] to-[#662D91]",
    chip: "bg-[#92278F]/10 text-[#7c2179]",
    icon: "#92278F",
  },
];

function OffreCard({ offre: o, index }) {
  const a = ACCENTS[index % ACCENTS.length];
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: "50%", my: "50%" });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (py - 0.5) * -6,
      ry: (px - 0.5) * 6,
      mx: `${px * 100}%`,
      my: `${py * 100}%`,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: "50%", my: "50%" });

  return (
    <Link
      ref={ref}
      to={`/offres/${o._id}`}
      data-delay={index % 6}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="tt-reveal tt-card tt-tilt group relative flex flex-col overflow-hidden rounded-3xl
                 border border-slate-200/90 p-6 shadow-[0_10px_35px_-25px_rgba(6,47,110,.4)]
                 transition-shadow duration-300 hover:shadow-[0_20px_60px_-30px_rgba(6,47,110,.6)]"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform .35s cubic-bezier(.2,.8,.2,1)",
        "--mx": tilt.mx,
        "--my": tilt.my,
      }}
    >
      {/* barre colorée */}
      <span
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`}
      />

      {/* watermark */}
      <div
        className="pointer-events-none absolute -right-6 -top-4 opacity-[.05]
                   transition-all duration-700 group-hover:rotate-12 group-hover:opacity-[.12]"
      >
        <I.target className="h-24 w-24" style={{ color: a.icon }} />
      </div>

      {/* reflet qui suit le curseur */}
      <span className="tt-tilt-shine" />

      {/* titre + badge */}
      <div className="relative flex items-start justify-between gap-3">
        <h3 className="text-lg font-black leading-snug text-[#062F6E] transition-colors group-hover:text-[#0B4E9B]">
          {o.titre}
        </h3>
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#3AAA35]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#2f8a2b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3AAA35]" />
          Ouvert
        </span>
      </div>

      {/* localisation + diplôme */}
      <div className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
        {o.localisation && (
          <span className="inline-flex items-center gap-1.5">
            <I.pin className="h-4 w-4" style={{ color: a.icon }} />
            {o.localisation}
          </span>
        )}
        {o.diplomeRequis && (
          <span className="inline-flex items-center gap-1.5">
            <I.cap className="h-4 w-4" style={{ color: a.icon }} />
            {o.diplomeRequis}
          </span>
        )}
      </div>

      {/* description */}
      <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {o.description}
      </p>

      {/* compétences */}
      {o.competencesRequises?.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {o.competencesRequises.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.chip}`}
            >
              {c}
            </span>
          ))}
          {o.competencesRequises.length > 3 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
              +{o.competencesRequises.length - 3}
            </span>
          )}
        </div>
      )}

      {/* footer */}
      <div className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-[11px] font-semibold text-slate-400">
          {o.createdAt
            ? `Publiée le ${new Date(o.createdAt).toLocaleDateString("fr-FR")}`
            : "Recrutement ouvert"}
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-sm font-black"
          style={{ color: a.icon }}
        >
          Postuler
          <I.arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

/* ============================================================
   7 · TÉMOIGNAGES
   ============================================================ */
function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#03214f] py-24">
      {/* fonds décoratifs */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#29ABE2]/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#E6007E]/15 blur-3xl" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.05]
        [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
        [background-size:56px_56px]
        [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]"
      />
      <Particles count={14} />

      <div className="relative mx-auto max-w-7xl px-5">
        <SectionTitle
          kicker="Ils ont rejoint TT"
          title={
            <span className="text-white">
              Ce qu'en disent nos{" "}
              <span className="tt-gradient-text">candidats</span>
            </span>
          }
          light
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, index }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: "50%", my: "50%" });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (py - 0.5) * -6,
      ry: (px - 0.5) * 6,
      mx: `${px * 100}%`,
      my: `${py * 100}%`,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: "50%", my: "50%" });

  return (
    <div
      ref={ref}
      data-delay={index}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="tt-reveal tt-tilt group relative flex h-full flex-col overflow-hidden
                 rounded-[28px] border border-white/15 tt-glass-dark p-7
                 shadow-[0_20px_50px_-25px_rgba(0,0,0,.6)] transition-transform duration-300"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform .35s cubic-bezier(.2,.8,.2,1)",
        "--mx": tilt.mx,
        "--my": tilt.my,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${t.color}, #FFD100)` }}
      />

      <span className="pointer-events-none absolute -bottom-4 -right-3 opacity-[.10] transition-all duration-500 group-hover:opacity-[.30] group-hover:rotate-6">
        <TTLogo className="h-24 w-24" showText={false} />
      </span>

      <span className="tt-tilt-shine" />

      <I.quote className="h-7 w-7" style={{ color: "#FFD100" }} />

      <p className="relative mt-5 flex-1 text-[15px] font-medium leading-relaxed text-blue-50/95">
        « {t.quote} »
      </p>

      <div className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black text-white shadow-lg"
          style={{ background: t.color }}
        >
          {t.initials}
        </span>
        <div>
          <p className="text-sm font-black text-white">{t.name}</p>
          <p className="text-xs font-semibold text-blue-100/70">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   9 · FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* branding */}
          <div>
            <div className="flex items-center gap-3">
              <TTLogo className="h-14 w-auto" animated />
              <div className="leading-none">
                <p className="text-[14px] font-black text-[#062F6E]">
                  TT <span className="tt-gradient-text">RECRUIT</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Espace Carrières Officiel
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">
              Plateforme de recrutement intelligent pour Tunisie Telecom.
              Connectez votre talent avec votre mission.
            </p>
            <div className="mt-6 flex gap-3">
              {["LinkedIn", "Facebook", "Instagram", "Twitter"].map((r, i) => (
                <a
                  key={r}
                  href="#"
                  aria-label={r}
                  className="grid h-10 w-10 place-items-center rounded-xl text-xs font-black text-white shadow-md transition-transform hover:-translate-y-1"
                  style={{
                    background: ["#0B4E9B", "#29ABE2", "#E6007E", "#F7941E"][i],
                  }}
                >
                  {r[0]}
                </a>
              ))}
            </div>
          </div>

          {/* carrières */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[.14em] text-[#062F6E]">
              Carrières
            </h4>
            <ul className="mt-5 space-y-2.5">
              {[
                "Toutes les offres",
                "Offres pour cadres",
                "Offres pour jeunes diplômés",
                "Candidature spontanée",
              ].map((li) => (
                <li key={li}>
                  <a
                    href="#jobs"
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#0B4E9B]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E6007E] opacity-0 transition-opacity group-hover:opacity-100" />
                    {li}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* produit */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[.14em] text-[#062F6E]">
              Produit
            </h4>
            <ul className="mt-5 space-y-2.5">
              {[
                "Sélection des candidatures",
                "Lecture des CV",
                "Suivi personnalisé",
                "Notifications par email",
              ].map((li) => (
                <li key={li}>
                  <a
                    href="#ai"
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#0B4E9B]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#8DC63F] opacity-0 transition-opacity group-hover:opacity-100" />
                    {li}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[.14em] text-[#062F6E]">
              Aide & Contact
            </h4>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href="mailto:recruit@tt.tn"
                  className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#0B4E9B]"
                >
                  <I.mail className="h-3.5 w-3.5" />
                  recruit@tt.tn
                </a>
              </li>
              <li>
                <a
                  href="tel:+21671234567"
                  className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#0B4E9B]"
                >
                  <I.phone className="h-3.5 w-3.5" />
                  +216 71 234 567
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#0B4E9B]"
                >
                  <I.chat className="h-3.5 w-3.5" />
                  Chat Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-500 transition hover:text-[#0B4E9B]"
                >
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="tt-gradient-bar mt-12 h-1" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Tunisie Telecom. TT RECRUIT SYSTEM.
            Tous droits réservés.
          </p>
          <p className="flex items-center gap-1.5">
            Conçu en Tunisie 🇹🇳 · Made with
            <span className="text-[#E6007E]">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   COMPOSANTS PARTAGÉS / UTILITAIRES
   ============================================================ */

function SectionTitle({ kicker, title, subtitle, light = false }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className="tt-reveal inline-flex items-center gap-2 rounded-full bg-[#0B4E9B]/8 px-4 py-1.5
                   text-[11px] font-black uppercase tracking-[.18em] text-[#0B4E9B]"
      >
        <I.spark className="h-3 w-3 text-[#E6007E]" />
        {kicker}
      </span>
      <h2
        className={`tt-reveal mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-[2.75rem]
                    ${light ? "text-white" : "text-[#062F6E]"}`}
        data-delay="1"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`tt-reveal mt-4 leading-relaxed ${
            light ? "text-blue-100/85" : "text-slate-500"
          }`}
          data-delay="2"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Select({ value, onChange, options, icon: Icon, label }) {
  const norm = options.map((o) => (typeof o === "string" ? { v: o, l: o } : o));

  return (
    <label className="relative md:w-48">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/60 py-4 pl-12 pr-10
                   text-sm font-bold text-slate-700 outline-none transition
                   focus:border-[#29ABE2] focus:bg-white focus:ring-4 focus:ring-[#29ABE2]/15"
        aria-label={label}
      >
        {norm.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
      <div className="tt-shimmer h-5 w-3/4 rounded-lg" />
      <div className="mt-4 flex gap-3">
        <div className="tt-shimmer h-3 w-24 rounded" />
        <div className="tt-shimmer h-3 w-20 rounded" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="tt-shimmer h-3 w-full rounded" />
        <div className="tt-shimmer h-3 w-11/12 rounded" />
        <div className="tt-shimmer h-3 w-2/3 rounded" />
      </div>
      <div className="mt-5 flex gap-2">
        {[16, 20, 14].map((w) => (
          <div
            key={w}
            className="tt-shimmer h-6 rounded-full"
            style={{ width: w * 4 }}
          />
        ))}
      </div>
      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="tt-shimmer h-3 w-28 rounded" />
      </div>
    </div>
  );
}

function EmptyState({ emoji, title, text, action }) {
  return (
    <div
      className="tt-reveal rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/60
                 px-6 py-20 text-center"
    >
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white text-4xl shadow-lg tt-float">
        {emoji}
      </div>
      <h3 className="mt-6 text-xl font-black text-[#062F6E]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {text}
      </p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
      const h = document.documentElement;
      const height = h.scrollHeight - h.clientHeight;
      setP(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const r = 20;
  const c = 2 * Math.PI * r;

  return (
    <button
      onClick={onClick}
      aria-label="Retour au haut"
      className={`fixed bottom-8 right-8 z-40 grid h-12 w-12 place-items-center rounded-full
                 bg-[#0B4E9B] text-white shadow-lg shadow-[#0B4E9B]/30 transition-all duration-300
                 hover:scale-110 active:scale-95
                 ${visible ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,.2)"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#FFD100"
          strokeWidth="2"
          strokeDasharray={c}
          strokeDashoffset={c - (p / 100) * c}
          strokeLinecap="round"
        />
      </svg>
      <I.up className="relative h-5 w-5" />
    </button>
  );
}
