import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";
import TTLogo from "../../components/TTLogo";
import { useAuth } from "../../context/AuthContext";

const VILLES_TUNISIE = {
  Tunis: { lat: 36.8065, lng: 10.1815 },
  Ariana: { lat: 36.8625, lng: 10.1956 },
  "Ben Arous": { lat: 36.7533, lng: 10.2282 },
  Manouba: { lat: 36.8081, lng: 10.0972 },
  Nabeul: { lat: 36.4561, lng: 10.7376 },
  Zaghouan: { lat: 36.4028, lng: 10.1428 },
  Bizerte: { lat: 37.2746, lng: 9.8739 },
  Béja: { lat: 36.7256, lng: 9.1817 },
  Jendouba: { lat: 36.5011, lng: 8.7803 },
  "Le Kef": { lat: 36.1826, lng: 8.7148 },
  Siliana: { lat: 36.0847, lng: 9.3708 },
  Sousse: { lat: 35.8256, lng: 10.6084 },
  Monastir: { lat: 35.7643, lng: 10.8113 },
  Mahdia: { lat: 35.5047, lng: 11.0622 },
  Kairouan: { lat: 35.6781, lng: 10.0963 },
  Kasserine: { lat: 35.1676, lng: 8.8365 },
  "Sidi Bouzid": { lat: 35.0381, lng: 9.4858 },
  Sfax: { lat: 34.7406, lng: 10.7603 },
  Gabès: { lat: 33.8815, lng: 10.0982 },
  Médenine: { lat: 33.3399, lng: 10.5054 },
  Tataouine: { lat: 32.9297, lng: 10.4518 },
  Gafsa: { lat: 34.425, lng: 8.7842 },
  Tozeur: { lat: 33.9197, lng: 8.1335 },
  Kébili: { lat: 33.7044, lng: 8.969 },
};

/* ============================================================
   ANIMATIONS CSS CUSTOM
   ============================================================ */
const AnimStyles = () => (
  <style>{`
    @keyframes floatBlob {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -40px) scale(1.08); }
      66% { transform: translate(-20px, 20px) scale(0.94); }
    }
    @keyframes slideInStep {
      from { opacity: 0; transform: translateX(24px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.7); }
      60% { opacity: 1; transform: scale(1.06); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes bounceCheck {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(140px) rotate(360deg); opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes dotPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.35); }
    }
    @keyframes lockShake {
      0%, 100% { transform: rotate(0deg); }
      20% { transform: rotate(-8deg); }
      40% { transform: rotate(8deg); }
      60% { transform: rotate(-5deg); }
      80% { transform: rotate(5deg); }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(10px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .anim-blob { animation: floatBlob 12s ease-in-out infinite; }
    .anim-blob-slow { animation: floatBlob 16s ease-in-out infinite reverse; }
    .anim-step-in { animation: slideInStep .38s cubic-bezier(.22,1,.36,1) both; }
    .anim-pop { animation: popIn .5s cubic-bezier(.22,1.4,.36,1) both; }
    .anim-bounce-check { animation: bounceCheck .6s cubic-bezier(.22,1.4,.36,1) both; }
    .anim-confetti { animation: confettiFall 1.4s ease-in forwards; }
    .anim-shimmer {
      background-image: linear-gradient(110deg, transparent 40%, rgba(255,255,255,.5) 50%, transparent 60%);
      background-size: 200% 100%;
      animation: shimmer 2.2s ease-in-out infinite;
    }
    .anim-dot-active { animation: dotPulse 1.6s ease-in-out infinite; }
    .anim-lock { animation: lockShake 2.5s ease-in-out infinite; animation-delay: 1s; }
    .anim-card-in { animation: cardIn .35s cubic-bezier(.22,1,.36,1) both; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

/* ============================================================
   ICÔNES
   ============================================================ */
const I = {
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
  back: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
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
  upload: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  ),
  check: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  alert: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 9v4M12 17h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  trash: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6" />
    </svg>
  ),
  zap: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  ),
  lock: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  userPlus: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M18 9v5M15.5 11.5h5" />
    </svg>
  ),
  plus: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  calendar: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  ),
  mapPin: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  grad: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M2 9 12 4l10 5-10 5-10-5Z" />
      <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  ),
  briefcase: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.2" />
      <path d="M8 7.5V6a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 16 6v1.5M3 12.5h18" />
    </svg>
  ),
  idCard: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
      <circle cx="8" cy="12" r="2" />
      <path d="M5.5 16.2c.6-1.4 1.8-2.2 2.5-2.2s1.9.8 2.5 2.2M14 9.5h5M14 13h5M14 16.5h3.2" />
    </svg>
  ),
  sparkles: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2 13.6 8.4 20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
    </svg>
  ),
  chevron: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};

const STEPS = [
  { id: 1, label: "Connexion" },
  { id: 2, label: "Profil" },
  { id: 3, label: "Parcours" },
  { id: 4, label: "Expérience" },
  { id: 5, label: "Emploi" },
  { id: 6, label: "Documents" },
  { id: 7, label: "Récap" },
];

const CONFETTI_COLORS = ["#29ABE2", "#8DC63F", "#F7941E", "#E6007E", "#0B4E9B"];

const SALUTATIONS = ["M.", "Mme", "Mlle"];
const GENRES = ["Homme", "Femme"];
const NIVEAUX = [
  "BAC",
  "BAC + 1",
  "BAC + 2",
  "BAC + 3",
  "BAC + 4",
  "BAC + 5",
  "Doctorat",
];
const DISPONIBILITES = [
  "Immédiate",
  "Sous 1 mois",
  "Sous 2 mois",
  "Sous 3 mois",
  "À définir",
];

const uid = () => Math.random().toString(36).slice(2, 10);

/* ============================================================
   COMPOSANT D'ERREUR DE CHAMP
   ============================================================ */
function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#E6007E]">
      <I.alert className="h-3.5 w-3.5" />
      {error}
    </p>
  );
}

/* ============================================================
   ANNEAU DE PROGRESSION CIRCULAIRE
   ============================================================ */
function ProgressRing({ step, total }) {
  const pct = step / total;
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-14 w-14 shrink-0 place-items-center">
      <svg viewBox="0 0 52 52" className="h-14 w-14 -rotate-90">
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{
            transition: "stroke-dashoffset .5s cubic-bezier(.22,1,.36,1)",
          }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#29ABE2" />
            <stop offset="100%" stopColor="#E6007E" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-black text-[#062F6E]">
        {step}/{total}
      </span>
    </div>
  );
}

/* ============================================================
   FOND ANIMÉ RÉUTILISABLE
   ============================================================ */
function AnimatedShell({ children, wide }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-[#29ABE2]/5">
      <AnimStyles />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#29ABE2]/20 blur-3xl anim-blob" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#E6007E]/15 blur-3xl anim-blob-slow" />
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-[#8DC63F]/15 blur-3xl anim-blob"
        style={{ animationDelay: "3s" }}
      />
      <div
        className={`relative w-full px-5 py-12 sm:px-8 lg:px-14 xl:px-20 ${wide ? "" : "mx-auto max-w-xl"}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   HOOK DE VALIDATION
   ============================================================ */
function useFormValidation() {
  const validateStep = (step, data) => {
    const errors = {};

    switch (step) {
      case 2: // Profil
        if (!data.prenom?.trim()) errors.prenom = "Le prénom est requis";
        if (!data.nom?.trim()) errors.nom = "Le nom est requis";
        if (!data.email?.trim()) {
          errors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.email = "Email invalide";
        }
        if (!data.telephone?.trim()) {
          errors.telephone = "Le téléphone est requis";
        } else if (!/^[0-9+\s\-()]{8,15}$/.test(data.telephone)) {
          errors.telephone = "Numéro invalide (8-15 chiffres)";
        }
        if (!data.salutation) errors.salutation = "La civilité est requise";
        if (!data.genre) errors.genre = "Le genre est requis";
        break;

      case 3: // Académique
        data.academics.forEach((a, i) => {
          if (!a.etablissement?.trim())
            errors[`academic_${i}_etablissement`] = "Établissement requis";
          if (!a.domaine?.trim())
            errors[`academic_${i}_domaine`] = "Domaine requis";
          if (!a.specialite?.trim())
            errors[`academic_${i}_specialite`] = "Spécialité requise";
          if (!a.diplomePrepare?.trim())
            errors[`academic_${i}_diplome`] = "Diplôme requis";
          if (!a.niveauEtudes)
            errors[`academic_${i}_niveau`] = "Niveau d'études requis";
        });
        break;

      case 4: // Expérience (facultative mais validation si présente)
        data.experiences.forEach((e, i) => {
          if (e.entreprise?.trim() || e.posteOccupe?.trim()) {
            if (!e.entreprise?.trim())
              errors[`exp_${i}_entreprise`] = "Entreprise requise";
            if (!e.posteOccupe?.trim())
              errors[`exp_${i}_poste`] = "Poste requis";
            if (!e.dateDebut)
              errors[`exp_${i}_dateDebut`] = "Date de début requise";
            if (!e.posteActuel && !e.dateFin)
              errors[`exp_${i}_dateFin`] =
                "Date de fin requise (ou cochez 'Poste actuel')";
          }
        });
        break;

      case 5: // Emploi
        if (!data.jobInfo.disponibilite)
          errors.disponibilite = "La disponibilité est requise";
        if (!data.jobInfo.permisConduire)
          errors.permisConduire = "Veuillez indiquer si vous avez le permis";
        if (!data.jobInfo.lieuAffectation)
          errors.lieuAffectation = "Le lieu d'affectation est requis";
        break;

      case 6: // Documents
        if (!data.cvFile) errors.cv = "Le CV est requis (PDF ou DOC)";
        break;

      case 7: // Récap
        if (!data.certifieExact)
          errors.certification =
            "Vous devez certifier l'exactitude des informations";
        break;
    }

    return errors;
  };

  return { validateStep };
}

/* ============================================================
   CHAMPS RÉUTILISABLES
   ============================================================ */
function FloatingField({ label, value, icon: Icon, ...props }) {
  return (
    <label className="group relative block">
      <input
        {...props}
        value={value}
        placeholder=" "
        className={`peer w-full rounded-2xl border-2 border-slate-200 bg-white ${Icon ? "pl-11" : "px-4"} pr-4 pb-2.5 pt-5 text-sm font-bold
                   text-[#062F6E] outline-none transition-all
                   focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15`}
      />
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors peer-focus:text-[#29ABE2]" />
      )}
      <span
        className={`pointer-events-none absolute ${Icon ? "left-11" : "left-4"} font-bold text-slate-400 transition-all duration-200
          ${
            value
              ? "top-2 text-[10px] uppercase tracking-wider text-[#29ABE2]"
              : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#29ABE2]"
          }`}
      >
        {label}
      </span>
    </label>
  );
}

function FloatingSelect({ label, value, onChange, options, icon: Icon }) {
  return (
    <label className="group relative block">
      <select
        value={value}
        onChange={onChange}
        className={`peer w-full appearance-none rounded-2xl border-2 border-slate-200 bg-white ${Icon ? "pl-11" : "px-4"} pr-9 pb-2.5 pt-5 text-sm font-bold
                   text-[#062F6E] outline-none transition-all
                   focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15`}
      >
        <option value="" disabled hidden></option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors peer-focus:text-[#29ABE2]" />
      )}
      <I.chevron className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
      <span
        className={`pointer-events-none absolute ${Icon ? "left-11" : "left-4"} font-bold text-slate-400 transition-all duration-200
          ${
            value
              ? "top-2 text-[10px] uppercase tracking-wider text-[#29ABE2]"
              : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#29ABE2]"
          }`}
      >
        {label}
      </span>
    </label>
  );
}

function FloatingTextarea({ label, value, ...props }) {
  return (
    <label className="group relative block">
      <textarea
        {...props}
        value={value}
        placeholder=" "
        rows={3}
        className="peer w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-4 pb-2.5 pt-5 text-sm font-bold
                   text-[#062F6E] outline-none transition-all
                   focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15"
      />
      <span
        className={`pointer-events-none absolute left-4 font-bold text-slate-400 transition-all duration-200
          ${
            value
              ? "top-2 text-[10px] uppercase tracking-wider text-[#29ABE2]"
              : "top-5 text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#29ABE2]"
          }`}
      >
        {label}
      </span>
    </label>
  );
}

function ChoiceGroup({ label, value, onChange, options }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border-2 px-4 py-2 text-xs font-black transition-all
              ${
                value === o
                  ? "border-transparent bg-gradient-to-r from-[#0B4E9B] to-[#29ABE2] text-white shadow-md shadow-[#0B4E9B]/20"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#29ABE2]/40 hover:text-[#0B4E9B]"
              }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Petit bloc d'upload de fichier réutilisable (CV, lettre de motivation, etc.) */
function FileUploadField({
  label,
  hint,
  file,
  onChange,
  onRemove,
  required,
  accept = ".pdf,.doc,.docx",
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputId = `upl-${label.replace(/\s+/g, "-")}`;

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
        {required && <span className="text-[#E6007E]">*</span>}
      </p>
      {file ? (
        <div className="anim-pop flex items-center justify-between rounded-2xl border-2 border-[#8DC63F]/30 bg-[#8DC63F]/5 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#8DC63F]/20 text-[#5f8a1f]">
              <I.doc className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#062F6E]">
                {file.name}
              </p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} Ko
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <I.trash className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) onChange(f);
          }}
          className={`relative flex cursor-pointer flex-col items-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all
            ${
              dragOver
                ? "scale-[1.01] border-[#29ABE2] bg-[#29ABE2]/10"
                : "border-slate-200 hover:border-[#29ABE2] hover:bg-[#29ABE2]/5"
            }`}
        >
          {dragOver && <span className="anim-shimmer absolute inset-0" />}
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl bg-[#29ABE2]/10 text-[#0B7BB5] transition-transform ${dragOver ? "scale-110" : ""}`}
          >
            <I.upload className="h-5 w-5" />
          </span>
          <p className="relative text-xs font-bold text-slate-600">
            Glissez le fichier ici ou cliquez
          </p>
          {hint && (
            <p className="relative text-[11px] text-slate-400">{hint}</p>
          )}
          <input
            id={inputId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange(f);
            }}
          />
        </label>
      )}
    </div>
  );
}

/* Carte pour une entrée répétable (parcours académique, expérience...) */
function RepeatCard({ index, title, onRemove, removable, children }) {
  return (
    <div className="anim-card-in relative rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0B4E9B]">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0B4E9B]/10 text-[10px]">
            {index + 1}
          </span>
          {title}
        </span>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <I.trash className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0B4E9B]/25 py-3.5 text-xs font-black uppercase tracking-wider text-[#0B4E9B] transition hover:border-[#0B4E9B]/50 hover:bg-[#0B4E9B]/5"
    >
      <I.plus className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ============================================================
   ÉTAPE 1 — Connexion
   ============================================================ */
function StepConnexion({ isAuthenticated, offerId, user }) {
  const redirectTo = `/offres/${offerId}/postuler`;

  if (isAuthenticated) {
    const items = [
      {
        icon: I.idCard,
        title: "Profil complet",
        text: "Identité, coordonnées et informations civiles.",
      },
      {
        icon: I.grad,
        title: "Parcours académique",
        text: "Un ou plusieurs diplômes, écoles et spécialités.",
      },
      {
        icon: I.briefcase,
        title: "Expérience (facultatif)",
        text: "Postes occupés, durée et disponibilité.",
      },
      {
        icon: I.doc,
        title: "Documents",
        text: "CV, lettre de motivation et pièces jointes.",
      },
    ];
    return (
      <div className="space-y-6">
        <div className="anim-pop flex items-center gap-3 rounded-2xl border-2 border-[#8DC63F]/30 bg-[#8DC63F]/5 px-5 py-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#8DC63F]/20 text-[#5f8a1f]">
            <I.check className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-[#062F6E]">
              Vous êtes connecté
            </p>
            <p className="text-xs text-slate-500">
              {user?.email || "Compte candidat vérifié"}
            </p>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
            Bienvenue dans votre candidature ✨
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Cette candidature se déroule en {STEPS.length} étapes rapides. Vous
            pouvez revenir en arrière à tout moment.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0B4E9B]/10 text-[#0B4E9B]">
                <it.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-[#062F6E]">{it.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <span className="anim-lock grid h-20 w-20 place-items-center rounded-full bg-[#0B4E9B]/8 text-[#0B4E9B]">
        <I.lock className="h-9 w-9" />
      </span>
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Un compte candidat est requis
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          Pour postuler à cette offre, vous devez d'abord vous connecter ou
          créer votre compte candidat.
        </p>
      </div>
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <Link
          to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0B4E9B] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0B4E9B]/25 transition-all hover:scale-105 active:scale-95"
        >
          Se connecter
          <I.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to={`/register?redirect=${encodeURIComponent(redirectTo)}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#0B4E9B]/15 bg-white px-6 py-3.5 text-sm font-black text-[#0B4E9B] transition hover:border-[#0B4E9B]/30 hover:bg-[#0B4E9B]/5"
        >
          <I.userPlus className="h-4 w-4" />
          Créer un compte
        </Link>
      </div>
      <Link
        to={`/offres/${offerId}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-[#0B4E9B]"
      >
        <I.back className="h-3.5 w-3.5" />
        Retour à l'offre
      </Link>
    </div>
  );
}

/* ============================================================
   ÉTAPE 2 — Profil
   ============================================================ */
function StepProfil({ form, setForm, errors = {}, onBlur }) {
  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target?.value ?? e });
    if (onBlur) onBlur(k);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Faisons connaissance 👋
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Vos informations personnelles et coordonnées.
        </p>
      </div>

      <div data-error={!!errors.salutation}>
        <ChoiceGroup
          label="Civilité"
          value={form.salutation}
          onChange={(v) => {
            setForm({ ...form, salutation: v });
            if (onBlur) onBlur("salutation");
          }}
          options={SALUTATIONS}
        />
        <FieldError error={errors.salutation} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div data-error={!!errors.prenom}>
          <FloatingField
            label="Prénom"
            value={form.prenom}
            onChange={set("prenom")}
            onBlur={() => onBlur && onBlur("prenom")}
            className={errors.prenom ? "border-[#E6007E]" : ""}
          />
          <FieldError error={errors.prenom} />
        </div>
        <div data-error={!!errors.nom}>
          <FloatingField
            label="Nom"
            value={form.nom}
            onChange={set("nom")}
            onBlur={() => onBlur && onBlur("nom")}
            className={errors.nom ? "border-[#E6007E]" : ""}
          />
          <FieldError error={errors.nom} />
        </div>
        <div data-error={!!errors.email}>
          <FloatingField
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            onBlur={() => onBlur && onBlur("email")}
            className={errors.email ? "border-[#E6007E]" : ""}
          />
          <FieldError error={errors.email} />
        </div>
        <div data-error={!!errors.telephone}>
          <FloatingField
            label="Téléphone"
            value={form.telephone}
            onChange={set("telephone")}
            onBlur={() => onBlur && onBlur("telephone")}
            className={errors.telephone ? "border-[#E6007E]" : ""}
          />
          <FieldError error={errors.telephone} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FloatingField
          label="Adresse"
          icon={I.mapPin}
          value={form.adresse}
          onChange={set("adresse")}
        />
        <FloatingSelect
          label="Ville"
          value={form.ville}
          onChange={set("ville")}
          options={Object.keys(VILLES_TUNISIE)}
        />
        <FloatingField
          label="Code postal"
          value={form.codePostal}
          onChange={set("codePostal")}
        />
      </div>

      <div data-error={!!errors.genre}>
        <ChoiceGroup
          label="Genre"
          value={form.genre}
          onChange={(v) => {
            setForm({ ...form, genre: v });
            if (onBlur) onBlur("genre");
          }}
          options={GENRES}
        />
        <FieldError error={errors.genre} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <FloatingField
          label="Date de naissance"
          type="date"
          icon={I.calendar}
          value={form.dateNaissance}
          onChange={set("dateNaissance")}
        />
        <FloatingField
          label="Lieu de naissance"
          value={form.lieuNaissance}
          onChange={set("lieuNaissance")}
        />
        <FloatingField
          label="N° de CIN ou passeport"
          icon={I.idCard}
          value={form.cin}
          onChange={set("cin")}
        />
      </div>
    </div>
  );
}

/* ============================================================
   ÉTAPE 3 — Académique
   ============================================================ */
function StepAcademique({ academics, update, add, remove, errors = {} }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Votre formation 🎓
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Ajoutez chaque diplôme préparé ou obtenu.
        </p>
        {Object.keys(errors).length > 0 && (
          <div className="mt-3 rounded-xl bg-[#E6007E]/5 border border-[#E6007E]/20 px-4 py-3">
            <p className="text-xs font-bold text-[#E6007E]">
              {Object.keys(errors).length} champ
              {Object.keys(errors).length > 1 ? "s" : ""} à corriger
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {academics.map((a, idx) => {
          const prefix = `academic_${idx}`;
          return (
            <RepeatCard
              key={a.id}
              index={idx}
              title="Formation"
              removable={academics.length > 1}
              onRemove={() => remove(idx)}
            >
              <div data-error={!!errors[`${prefix}_etablissement`]}>
                <FloatingField
                  label="Établissement / Université"
                  value={a.etablissement}
                  onChange={(e) =>
                    update(idx, { etablissement: e.target.value })
                  }
                  className={
                    errors[`${prefix}_etablissement`] ? "border-[#E6007E]" : ""
                  }
                />
                <FieldError error={errors[`${prefix}_etablissement`]} />
              </div>
              <FloatingField
                label="Autre (si non listé)"
                value={a.autre}
                onChange={(e) => update(idx, { autre: e.target.value })}
              />
              <div data-error={!!errors[`${prefix}_domaine`]}>
                <FloatingField
                  label="Domaine"
                  value={a.domaine}
                  onChange={(e) => update(idx, { domaine: e.target.value })}
                  className={
                    errors[`${prefix}_domaine`] ? "border-[#E6007E]" : ""
                  }
                />
                <FieldError error={errors[`${prefix}_domaine`]} />
              </div>
              <div data-error={!!errors[`${prefix}_specialite`]}>
                <FloatingField
                  label="Spécialité"
                  value={a.specialite}
                  onChange={(e) => update(idx, { specialite: e.target.value })}
                  className={
                    errors[`${prefix}_specialite`] ? "border-[#E6007E]" : ""
                  }
                />
                <FieldError error={errors[`${prefix}_specialite`]} />
              </div>
              <div data-error={!!errors[`${prefix}_diplome`]}>
                <FloatingField
                  label="Diplôme préparé"
                  value={a.diplomePrepare}
                  onChange={(e) =>
                    update(idx, { diplomePrepare: e.target.value })
                  }
                  className={
                    errors[`${prefix}_diplome`] ? "border-[#E6007E]" : ""
                  }
                />
                <FieldError error={errors[`${prefix}_diplome`]} />
              </div>
              <div data-error={!!errors[`${prefix}_niveau`]}>
                <FloatingSelect
                  label="Niveau d'études"
                  value={a.niveauEtudes}
                  onChange={(e) =>
                    update(idx, { niveauEtudes: e.target.value })
                  }
                  options={NIVEAUX}
                  className={
                    errors[`${prefix}_niveau`] ? "border-[#E6007E]" : ""
                  }
                />
                <FieldError error={errors[`${prefix}_niveau`]} />
              </div>
            </RepeatCard>
          );
        })}
      </div>

      <AddButton onClick={add} label="Ajouter une formation" />
    </div>
  );
}

/* ============================================================
   ÉTAPE 4 — Expérience
   ============================================================ */
function StepExperience({ experiences, update, add, remove }) {
  const hasExperience = experiences.length > 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Votre expérience 💼
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Cette étape est <b>facultative</b>. Vous pouvez l'ignorer et continuer
          directement.
        </p>
      </div>

      {!hasExperience && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0B4E9B]/10 text-[#0B4E9B]">
            <I.briefcase className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-slate-500">
            Aucune expérience ajoutée pour le moment
          </p>
          <p className="max-w-sm text-xs text-slate-400">
            Vous pouvez passer à l'étape suivante sans rien remplir ici.
          </p>
        </div>
      )}

      {hasExperience && (
        <div className="space-y-4">
          {experiences.map((e, idx) => (
            <RepeatCard
              key={e.id}
              index={idx}
              title="Expérience"
              removable
              onRemove={() => remove(idx)}
            >
              <FloatingField
                label="Entreprise"
                value={e.entreprise}
                onChange={(ev) => update(idx, { entreprise: ev.target.value })}
              />
              <FloatingField
                label="Poste occupé"
                value={e.posteOccupe}
                onChange={(ev) => update(idx, { posteOccupe: ev.target.value })}
              />
              <FloatingField
                label="Date de début"
                type="date"
                icon={I.calendar}
                value={e.dateDebut}
                onChange={(ev) => update(idx, { dateDebut: ev.target.value })}
              />
              <FloatingField
                label="Date de fin"
                type="date"
                icon={I.calendar}
                value={e.dateFin}
                disabled={e.posteActuel}
                onChange={(ev) => update(idx, { dateFin: ev.target.value })}
              />
              <label className="flex items-center gap-2 self-center text-xs font-bold text-slate-500">
                <input
                  type="checkbox"
                  checked={e.posteActuel}
                  onChange={(ev) =>
                    update(idx, {
                      posteActuel: ev.target.checked,
                      dateFin: ev.target.checked ? "" : e.dateFin,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#0B4E9B] focus:ring-[#29ABE2]"
                />
                Poste actuel
              </label>
              <div className="sm:col-span-2 lg:col-span-3">
                <FloatingTextarea
                  label="Description / missions principales (facultatif)"
                  value={e.description}
                  onChange={(ev) =>
                    update(idx, { description: ev.target.value })
                  }
                />
              </div>
            </RepeatCard>
          ))}
        </div>
      )}

      <AddButton
        onClick={add}
        label={
          hasExperience
            ? "Ajouter une autre expérience"
            : "Ajouter une expérience"
        }
      />
    </div>
  );
}

/* ============================================================
   ÉTAPE 5 — Emploi
   ============================================================ */
function StepEmploi({
  jobInfo,
  setJobInfo,
  competencesRequises = [],
  competencesCandidat = [],
  setCompetencesCandidat,
  lieuxDisponibles = [],
  errors = {},
  onBlur,
}) {
  const set = (k) => (e) => {
    setJobInfo({ ...jobInfo, [k]: e.target?.value ?? e });
    if (onBlur) onBlur(k);
  };

  const lieux = lieuxDisponibles.map((r) => r.lieu).filter(Boolean);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Quelques précisions 💼
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Ces informations nous aident à préparer votre intégration.
        </p>
      </div>

      {lieux.length > 1 && (
        <div data-error={!!errors.lieuAffectation}>
          <ChoiceGroup
            label="Lieu d'affectation souhaité (un seul choix possible)"
            value={jobInfo.lieuAffectation}
            onChange={(v) => {
              setJobInfo({ ...jobInfo, lieuAffectation: v });
              if (onBlur) onBlur("lieuAffectation");
            }}
            options={lieux}
          />
          <FieldError error={errors.lieuAffectation} />
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <I.alert className="h-3.5 w-3.5 shrink-0" />
            Conformément au règlement, vous ne pouvez postuler que pour un seul
            lieu d'affectation.
          </p>
        </div>
      )}

      {lieux.length === 1 && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#0B4E9B]/5 px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0B4E9B]/10 text-[#0B4E9B]">
            <I.mapPin className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold text-[#062F6E]">
            Lieu d'affectation : {lieux[0]}
          </p>
        </div>
      )}

      {competencesRequises.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Compétences que vous maîtrisez
          </p>
          <div className="flex flex-wrap gap-2">
            {competencesRequises.map((c) => {
              const active = competencesCandidat.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => {
                    const newList = competencesCandidat.includes(c)
                      ? competencesCandidat.filter((x) => x !== c)
                      : [...competencesCandidat, c];
                    setCompetencesCandidat(newList);
                  }}
                  className={`rounded-full border-2 px-4 py-2 text-xs font-black transition-all ${
                    active
                      ? "border-transparent bg-gradient-to-r from-[#8DC63F] to-[#3AAA35] text-white shadow-md shadow-[#8DC63F]/20"
                      : "border-slate-200 bg-white text-slate-500 hover:border-[#8DC63F]/40 hover:text-[#4c7a1a]"
                  }`}
                >
                  {active && <I.check className="mr-1.5 inline h-3 w-3" />}
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div data-error={!!errors.disponibilite}>
        <ChoiceGroup
          label="Disponibilité"
          value={jobInfo.disponibilite}
          onChange={(v) => {
            setJobInfo({ ...jobInfo, disponibilite: v });
            if (onBlur) onBlur("disponibilite");
          }}
          options={DISPONIBILITES}
        />
        <FieldError error={errors.disponibilite} />
      </div>

      <div data-error={!!errors.permisConduire}>
        <ChoiceGroup
          label="Permis de conduire"
          value={jobInfo.permisConduire}
          onChange={(v) => {
            setJobInfo({ ...jobInfo, permisConduire: v });
            if (onBlur) onBlur("permisConduire");
          }}
          options={["Oui", "Non"]}
        />
        <FieldError error={errors.permisConduire} />
      </div>

      <FloatingTextarea
        label="Autres informations complémentaires (facultatif)"
        value={jobInfo.experienceComplementaire}
        onChange={set("experienceComplementaire")}
      />
    </div>
  );
}

/* ============================================================
   ÉTAPE 6 — Documents
   ============================================================ */
function StepDocuments({
  cvFile,
  setCvFile,
  lettreMotivation,
  setLettreMotivation,
  lettreAffectation,
  setLettreAffectation,
  setError,
  errors = {},
}) {
  const validate = (file) => {
    const okTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (!okTypes.includes(file.type)) {
      setError("Format non accepté.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 10 Mo.");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Vos documents 📄
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Notre IA va les analyser en quelques secondes.
        </p>
        {errors.cv && (
          <div className="mt-3 rounded-xl bg-[#E6007E]/5 border border-[#E6007E]/20 px-4 py-3">
            <p className="text-xs font-bold text-[#E6007E]">
              <I.alert className="inline h-3.5 w-3.5 mr-1.5" />
              {errors.cv}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div data-error={!!errors.cv}>
          <FileUploadField
            label="CV"
            required
            hint="PDF, DOC ou DOCX — 10 Mo max"
            accept=".pdf,.doc,.docx"
            file={cvFile}
            onChange={(f) => validate(f) && setCvFile(f)}
            onRemove={() => setCvFile(null)}
          />
        </div>

        <FileUploadField
          label="Lettre de motivation (facultatif)"
          hint="PDF, DOC, DOCX, JPG ou PNG — 10 Mo max"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          file={lettreMotivation}
          onChange={(f) => validate(f) && setLettreMotivation(f)}
          onRemove={() => setLettreMotivation(null)}
        />

        <FileUploadField
          label="Lettre de recommandation (facultatif)"
          hint="PDF, DOC, DOCX, JPG ou PNG — 10 Mo max"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          file={lettreAffectation}
          onChange={(f) => validate(f) && setLettreAffectation(f)}
          onRemove={() => setLettreAffectation(null)}
        />
      </div>
    </div>
  );
}

/* ============================================================
   ÉTAPE 7 — Récapitulatif
   ============================================================ */
function RecapSection({ title, onEdit, children }) {
  return (
    <div className="anim-pop overflow-hidden rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between bg-slate-50 px-5 py-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#062F6E]">
          {title}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-black text-[#0B4E9B] transition hover:underline"
          >
            Modifier
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function RecapRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right text-sm font-bold text-[#062F6E]">
        {value || "—"}
      </span>
    </div>
  );
}

function StepRecap({
  form,
  academics,
  experiences,
  jobInfo,
  cvFile,
  lettreMotivation,
  lettreAffectation,
  goToStep,
  certifieExact,
  setCertifieExact,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
          Tout est bon ? ✨
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Vérifiez chaque section avant l'envoi final.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <RecapSection title="Profil" onEdit={() => goToStep(2)}>
            <RecapRow
              label="Nom complet"
              value={`${form.salutation || ""} ${form.prenom} ${form.nom}`.trim()}
            />
            <RecapRow label="Email" value={form.email} />
            <RecapRow label="Téléphone" value={form.telephone} />
            <RecapRow label="Genre" value={form.genre} />
            <RecapRow label="Adresse" value={form.adresse} />
            <RecapRow
              label="Ville / Code postal"
              value={[form.ville, form.codePostal].filter(Boolean).join(" — ")}
            />
            <RecapRow label="Date de naissance" value={form.dateNaissance} />
            <RecapRow label="Lieu de naissance" value={form.lieuNaissance} />
            <RecapRow label="CIN / Passeport" value={form.cin} />
          </RecapSection>
        </div>

        <RecapSection
          title={`Parcours académique (${academics.length})`}
          onEdit={() => goToStep(3)}
        >
          {academics.map((a, i) => (
            <RecapRow
              key={a.id}
              label={`Formation ${i + 1}`}
              value={[a.diplomePrepare, a.etablissement]
                .filter(Boolean)
                .join(" — ")}
            />
          ))}
        </RecapSection>

        <RecapSection
          title={`Expérience(s) (${experiences.length})`}
          onEdit={() => goToStep(4)}
        >
          {experiences.length === 0 ? (
            <p className="text-sm font-semibold text-slate-400 sm:col-span-2">
              Aucune expérience renseignée (facultatif)
            </p>
          ) : (
            experiences.map((e, i) => (
              <RecapRow
                key={e.id}
                label={`Expérience ${i + 1}`}
                value={[e.posteOccupe, e.entreprise]
                  .filter(Boolean)
                  .join(" — ")}
              />
            ))
          )}
        </RecapSection>

        <RecapSection title="Informations emploi" onEdit={() => goToStep(5)}>
          <RecapRow
            label="Lieu d'affectation"
            value={jobInfo.lieuAffectation}
          />
          <RecapRow label="Disponibilité" value={jobInfo.disponibilite} />
          <RecapRow label="Permis de conduire" value={jobInfo.permisConduire} />
        </RecapSection>

        <RecapSection title="Documents" onEdit={() => goToStep(6)}>
          <RecapRow label="CV" value={cvFile?.name} />
          <RecapRow
            label="Lettre de motivation"
            value={lettreMotivation?.name}
          />
          <RecapRow
            label="Lettre de recommandation"
            value={lettreAffectation?.name}
          />
        </RecapSection>
      </div>

      <label
        className={`anim-pop flex cursor-pointer items-start gap-3 rounded-2xl border-2 px-5 py-4 transition-all ${certifieExact ? "border-[#8DC63F]/40 bg-[#8DC63F]/5" : "border-[#E6007E]/25 bg-[#E6007E]/5"}`}
      >
        <input
          type="checkbox"
          checked={certifieExact}
          onChange={(e) => setCertifieExact(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[#0B4E9B] focus:ring-[#29ABE2]"
        />
        <span className="text-xs leading-relaxed text-slate-600">
          <b className="text-[#062F6E]">
            Je certifie l'exactitude des informations fournies
          </b>{" "}
          dans ce formulaire et leur conformité avec les pièces jointes. Je
          comprends que toute incohérence ou fausse déclaration entraîne
          l'annulation définitive de ma candidature.
        </span>
      </label>
    </div>
  );
}

/* ============================================================
   Écran de succès avec confettis
   ============================================================ */
function SuccessBlock({ reference }) {
  const confetti = Array.from({ length: 16 });
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    if (!reference) return;
    navigator.clipboard?.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative flex flex-col items-center gap-5 py-10 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
        {confetti.map((_, i) => (
          <span
            key={i}
            className="anim-confetti absolute top-0 h-2 w-2 rounded-sm"
            style={{
              left: `${(i * 6.5) % 100}%`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 8) * 0.12}s`,
            }}
          />
        ))}
      </div>
      <span className="anim-bounce-check grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#8DC63F] to-[#3AAA35] text-white shadow-lg shadow-[#8DC63F]/40">
        <I.check className="h-9 w-9" />
      </span>
      <div>
        <h2 className="text-2xl font-black text-[#062F6E]">
          Candidature envoyée ! 🎉
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Notre IA analyse votre profil, redirection en cours...
        </p>
      </div>

      {reference && (
        <div className="anim-pop flex flex-col items-center gap-2 rounded-2xl border-2 border-[#0B4E9B]/15 bg-[#0B4E9B]/5 px-6 py-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Votre numéro de dossier — à conserver
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-black tracking-wide text-[#062F6E]">
              {reference}
            </span>
            <button
              onClick={copyRef}
              className="rounded-full bg-[#0B4E9B]/10 px-3 py-1.5 text-[11px] font-black text-[#0B4E9B] transition hover:bg-[#0B4E9B]/20"
            >
              {copied ? "Copié ✓" : "Copier"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-[#0B4E9B]"
            style={{
              animation: `dotPulse 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   COMPOSANT PRINCIPAL
   ============================================================ */
export default function Postuler() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobOffer, setJobOffer] = useState(null);
  const [competencesCandidat, setCompetencesCandidat] = useState([]);
  const [stepErrors, setStepErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const { validateStep } = useFormValidation();

  // ⬇️ Auth centralisée via le contexte, au lieu de lire localStorage("candidateToken") en dur
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJobOffer(res.data))
      .catch(() => {});
  }, [id]);

  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    salutation: "",
    genre: "",
    dateNaissance: "",
    lieuNaissance: "",
    cin: "",
  });

  const [academics, setAcademics] = useState([
    {
      id: uid(),
      etablissement: "",
      autre: "",
      domaine: "",
      specialite: "",
      diplomePrepare: "",
      niveauEtudes: "",
    },
  ]);

  const [experiences, setExperiences] = useState([]);

  const [jobInfo, setJobInfo] = useState({
    disponibilite: "",
    permisConduire: "",
    experienceComplementaire: "",
    lieuAffectation: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [lettreMotivation, setLettreMotivation] = useState(null);
  const [lettreAffectation, setLettreAffectation] = useState(null);
  const [certifieExact, setCertifieExact] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dossierRef, setDossierRef] = useState("");

  useEffect(() => {
    if (!jobOffer?.repartitionPostes) return;
    if (jobOffer.repartitionPostes.length === 1 && !jobInfo.lieuAffectation) {
      setJobInfo((f) => ({
        ...f,
        lieuAffectation: jobOffer.repartitionPostes[0].lieu,
      }));
    }
  }, [jobOffer]);

  const isOffreExpiree =
    !!jobOffer?.dateFinInscription &&
    new Date() > new Date(jobOffer.dateFinInscription);

  // ⬇️ Préremplissage de l'email depuis le contexte auth (plus fiable que localStorage direct)
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    setForm((f) => (f.email ? f : { ...f, email: user.email }));
  }, [isAuthenticated, user]);

  const updateAcademic = (idx, patch) =>
    setAcademics((list) =>
      list.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    );
  const addAcademic = () =>
    setAcademics((list) => [
      ...list,
      {
        id: uid(),
        etablissement: "",
        autre: "",
        domaine: "",
        specialite: "",
        diplomePrepare: "",
        niveauEtudes: "",
      },
    ]);
  const removeAcademic = (idx) =>
    setAcademics((list) => list.filter((_, i) => i !== idx));

  const updateExperience = (idx, patch) =>
    setExperiences((list) =>
      list.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
    );
  const addExperience = () =>
    setExperiences((list) => [
      ...list,
      {
        id: uid(),
        entreprise: "",
        posteOccupe: "",
        dateDebut: "",
        dateFin: "",
        posteActuel: false,
        description: "",
      },
    ]);
  const removeExperience = (idx) =>
    setExperiences((list) => list.filter((_, i) => i !== idx));

  const validateCurrentStep = () => {
    const data = {
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      salutation: form.salutation,
      genre: form.genre,
      adresse: form.adresse,
      ville: form.ville,
      codePostal: form.codePostal,
      dateNaissance: form.dateNaissance,
      lieuNaissance: form.lieuNaissance,
      cin: form.cin,
      academics,
      experiences,
      jobInfo,
      cvFile,
      certifieExact,
    };
    const errors = validateStep(currentStep, data);
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return isAuthenticated;
      case 2:
        return !!(
          form.nom &&
          form.prenom &&
          form.email &&
          form.telephone &&
          form.salutation &&
          form.genre
        );
      case 3:
        return academics.every(
          (a) =>
            a.etablissement &&
            a.domaine &&
            a.specialite &&
            a.diplomePrepare &&
            a.niveauEtudes,
        );
      case 4:
        return (
          experiences.length === 0 ||
          experiences.every(
            (e) =>
              e.entreprise &&
              e.posteOccupe &&
              e.dateDebut &&
              (e.posteActuel || e.dateFin),
          )
        );
      case 5:
        return !!(jobInfo.disponibilite && jobInfo.lieuAffectation);
      case 6:
        return !!cvFile;
      case 7:
        return certifieExact;
      default:
        return true;
    }
  };

  const canAdvance = isStepValid(currentStep);

  const goNext = () => {
    if (!canAdvance) {
      validateCurrentStep();
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        firstError.focus();
      }
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
      setStepErrors({});
    }
  };

  const goPrev = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!canAdvance) return;
    if (!certifieExact) {
      setError(
        "Veuillez certifier l'exactitude de vos informations avant l'envoi.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("cv", cvFile);
      if (lettreMotivation) fd.append("lettreMotivation", lettreMotivation);
      if (lettreAffectation) fd.append("lettreAffectation", lettreAffectation);
      const uploadRes = await api.post("/applications/upload-cv", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const villeCoords = VILLES_TUNISIE[form.ville];

      const { data } = await api.post("/applications", {
        candidateData: {
          ...form,
          cvUrl: uploadRes.data.cvUrl,
          lettreMotivationUrl: uploadRes.data.lettreMotivationUrl,
          lettreAffectationUrl: uploadRes.data.lettreAffectationUrl,
          localisation: villeCoords
            ? { ville: form.ville, lat: villeCoords.lat, lng: villeCoords.lng }
            : undefined,
        },
        academics,
        experiences,
        jobInfo: { ...jobInfo, competencesCandidat },
        jobOfferId: id,
      });

      await api.post("/ai/parse-cv", { candidateId: data.candidate });
      await api.post("/ai/match", { applicationId: data._id });

      const rawId = data._id || data.candidate || "";
      const ref = `TT-${new Date().getFullYear()}-${rawId.toString().slice(-6).toUpperCase()}`;
      setDossierRef(ref);

      setSuccess(true);
      setTimeout(
        () => navigate("/mon-espace", { state: { applicationId: data._id } }),
        2200,
      );
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  if (isOffreExpiree) {
    return (
      <AnimatedShell>
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#E6007E]/10 text-[#E6007E]">
            <I.alert className="h-9 w-9" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[#062F6E] sm:text-3xl">
              Cette offre n'accepte plus de candidatures
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              La date limite d'inscription pour cette offre était fixée au{" "}
              <b>
                {new Date(jobOffer.dateFinInscription).toLocaleDateString(
                  "fr-FR",
                )}
              </b>
              .
            </p>
          </div>
          <Link
            to="/#jobs"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4E9B] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0B4E9B]/25 transition-all hover:scale-105 active:scale-95"
          >
            <I.back className="h-4 w-4" />
            Voir les offres ouvertes
          </Link>
        </div>
      </AnimatedShell>
    );
  }

  return (
    <AnimatedShell wide>
      <div className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <TTLogo className="h-9 w-auto" showText={false} animated />
          <span className="text-sm font-black text-[#062F6E]">
            TT <span className="tt-gradient-text">RECRUIT</span>
          </span>
        </Link>
        {!success && <ProgressRing step={currentStep} total={STEPS.length} />}
      </div>

      {!success && (
        <div className="no-scrollbar mx-auto mb-10 flex w-full max-w-6xl items-center gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const locked = s.id > 1 && !isAuthenticated;
            return (
              <div key={s.id} className="flex shrink-0 items-center">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() =>
                    !locked && s.id < currentStep && setCurrentStep(s.id)
                  }
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-black transition-all ${
                    locked
                      ? "cursor-not-allowed bg-slate-50 text-slate-300"
                      : s.id === currentStep
                        ? "bg-gradient-to-r from-[#0B4E9B] to-[#29ABE2] text-white shadow-md shadow-[#0B4E9B]/25"
                        : s.id < currentStep
                          ? "cursor-pointer bg-[#8DC63F]/15 text-[#4c7a1a]"
                          : "bg-slate-100 text-slate-300"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                      locked
                        ? "bg-slate-100"
                        : s.id === currentStep
                          ? "bg-white/25"
                          : s.id < currentStep
                            ? "bg-[#8DC63F]/30"
                            : "bg-slate-200"
                    }`}
                  >
                    {locked ? (
                      <I.lock className="h-2.5 w-2.5" />
                    ) : s.id < currentStep ? (
                      <I.check className="h-2.5 w-2.5" />
                    ) : (
                      s.id
                    )}
                  </span>
                  {s.label}
                  {s.id === 4 && (
                    <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-black normal-case">
                      facultatif
                    </span>
                  )}
                </button>
                {i < STEPS.length - 1 && (
                  <span className="mx-1 h-px w-4 shrink-0 bg-slate-200" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-white bg-white/80 p-7 shadow-[0_40px_100px_-40px_rgba(6,47,110,.35)] backdrop-blur-xl sm:p-10 lg:p-14">
        <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#29ABE2] via-[#8DC63F] to-[#E6007E]" />

        {error && !success && (
          <div className="anim-pop mb-6 flex items-center gap-2 rounded-2xl border border-[#E6007E]/25 bg-[#E6007E]/8 px-4 py-3 text-sm font-semibold text-[#c2005f]">
            <I.alert className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {success ? (
          <SuccessBlock reference={dossierRef} />
        ) : (
          <div key={currentStep} className="anim-step-in">
            {currentStep === 1 && (
              <StepConnexion
                isAuthenticated={isAuthenticated}
                offerId={id}
                user={user}
              />
            )}
            {currentStep === 2 && (
              <StepProfil
                form={form}
                setForm={setForm}
                errors={stepErrors}
                onBlur={(field) => {
                  setTouchedFields({ ...touchedFields, [field]: true });
                  validateCurrentStep();
                }}
              />
            )}
            {currentStep === 3 && (
              <StepAcademique
                academics={academics}
                update={updateAcademic}
                add={addAcademic}
                remove={removeAcademic}
                errors={stepErrors}
              />
            )}
            {currentStep === 4 && (
              <StepExperience
                experiences={experiences}
                update={updateExperience}
                add={addExperience}
                remove={removeExperience}
              />
            )}
            {currentStep === 5 && (
              <StepEmploi
                jobInfo={jobInfo}
                setJobInfo={setJobInfo}
                competencesRequises={jobOffer?.competencesTechniques || []}
                competencesCandidat={competencesCandidat}
                setCompetencesCandidat={setCompetencesCandidat}
                lieuxDisponibles={jobOffer?.repartitionPostes || []}
                errors={stepErrors}
                onBlur={(field) => {
                  setTouchedFields({ ...touchedFields, [field]: true });
                  validateCurrentStep();
                }}
              />
            )}
            {currentStep === 6 && (
              <StepDocuments
                cvFile={cvFile}
                setCvFile={setCvFile}
                lettreMotivation={lettreMotivation}
                setLettreMotivation={setLettreMotivation}
                lettreAffectation={lettreAffectation}
                setLettreAffectation={setLettreAffectation}
                setError={setError}
                errors={stepErrors}
              />
            )}
            {currentStep === 7 && (
              <StepRecap
                form={form}
                academics={academics}
                experiences={experiences}
                jobInfo={jobInfo}
                cvFile={cvFile}
                lettreMotivation={lettreMotivation}
                lettreAffectation={lettreAffectation}
                goToStep={(step) => {
                  setCurrentStep(step);
                  setStepErrors({});
                }}
                certifieExact={certifieExact}
                setCertifieExact={setCertifieExact}
              />
            )}

            {!(currentStep === 1 && !isAuthenticated) && (
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-100 hover:text-[#062F6E] disabled:opacity-0"
                >
                  <I.back className="h-4 w-4" />
                  Retour
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    onClick={goNext}
                    disabled={!canAdvance}
                    className="group flex items-center gap-2 rounded-full bg-[#062F6E] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-[#062F6E]/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#0B4E9B]/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                  >
                    Continuer
                    <I.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !certifieExact}
                    className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#0B4E9B] via-[#29ABE2] to-[#E6007E] bg-[length:200%_100%] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0B4E9B]/30 transition-all hover:scale-105 hover:bg-[length:100%_100%] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <I.zap className="h-4 w-4" />
                        Envoyer ma candidature
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedShell>
  );
}
