import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import TTLogo from "../../components/TTLogo";

const I = {
  check: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M20 6 9 17l-5-5" />
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
      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10 1.8 6.4 4.9 5.1 7 4.2 9.2 5 12 7.6 14.8 5 17 4.2 19.1 5.1c3.1 1.3 3.9 4.9 2.2 7.7C18.7 16.65 12 21 12 21Z" />
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
      <path d="M12 7v5l3 3" />
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
  briefcase: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  mail: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  ),
  phone: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10.1a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z" />
    </svg>
  ),
  arrow: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M5 12h13" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
};

const AnimStyles = () => (
  <style>{`
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.7); }
      60% { opacity: 1; transform: scale(1.06); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-24px) rotate(0deg); opacity: 1; }
      85% { opacity: 1; }
      100% { transform: translateY(440px) rotate(560deg); opacity: 0; }
    }
    .anim-pop { animation: popIn .55s cubic-bezier(.22,1.4,.36,1) both; }
    .anim-fade-up { animation: fadeUp .5s ease both; }
    .confetti-piece {
      position: absolute;
      top: -24px;
      border-radius: 2px;
      animation-name: confettiFall;
      animation-timing-function: cubic-bezier(.25,.46,.45,.94);
      animation-fill-mode: forwards;
    }
  `}</style>
);

function Confetti() {
  const colors = ["#0B4E9B", "#29ABE2", "#8DC63F", "#E6007E", "#F7941E"];
  const pieces = Array.from({ length: 42 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2.4 + Math.random() * 1.6;
        const color = colors[i % colors.length];
        const w = 5 + Math.random() * 6;
        const h = w * (0.35 + Math.random() * 0.3);
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              width: w,
              height: h,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

const STATUS_STYLE = {
  embauche: {
    icon: I.check,
    from: "from-[#3AAA35]",
    to: "to-[#8DC63F]",
    ring: "shadow-[#3AAA35]/25",
  },
  refuse: {
    icon: I.heart,
    from: "from-[#0B4E9B]",
    to: "to-[#29ABE2]",
    ring: "shadow-[#0B4E9B]/20",
  },
  default: {
    icon: I.clock,
    from: "from-[#29ABE2]",
    to: "to-[#0B4E9B]",
    ring: "shadow-[#29ABE2]/25",
  },
};

function Skeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md animate-pulse rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-20 w-20 rounded-full bg-slate-200" />
        <div className="mx-auto mt-6 h-5 w-48 rounded bg-slate-200" />
        <div className="mx-auto mt-3 h-4 w-64 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Resultat() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/applications/${id}`)
      .then((res) => setApp(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-black text-[#062F6E]">
            Impossible de charger cette candidature
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Réessayez dans quelques instants, ou revenez à votre espace.
          </p>
          <Link
            to="/mon-espace"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#0B4E9B]"
          >
            <I.back className="h-4 w-4" />
            Retour à mes candidatures
          </Link>
        </div>
      </div>
    );
  }

  if (!app) return <Skeleton />;

  const posteLabel = app.jobOffer?.titrePoste;

  const messages = {
    embauche: {
      title: "Félicitations !",
      text: posteLabel
        ? `Vous avez été retenu pour le poste de ${posteLabel}. Notre équipe RH vous contactera prochainement.`
        : "Vous avez été retenu pour ce poste. Notre équipe RH vous contactera prochainement.",
    },
    refuse: {
      title: "Merci pour votre candidature",
      text: posteLabel
        ? `Après analyse, votre profil ne correspond pas totalement aux besoins du poste de ${posteLabel} pour le moment. Ce n'est que partie remise !`
        : "Après analyse, votre profil ne correspond pas totalement aux besoins de ce poste pour le moment. Ce n'est que partie remise !",
    },
  };
  const m = messages[app.statut] || {
    title: "Candidature en cours d'examen",
    text: "Votre candidature est en cours de traitement par notre équipe RH. Vous serez notifié dès qu'une décision sera prise.",
  };
  const s = STATUS_STYLE[app.statut] || STATUS_STYLE.default;
  const Icon = s.icon;
  const showConfetti = app.statut === "embauche";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-10">
      <AnimStyles />

      <Link to="/" className="mb-8 flex items-center gap-2">
        <TTLogo className="h-9 w-auto" showText={false} animated />
        <span className="text-sm font-black text-[#062F6E]">
          TT <span className="tt-gradient-text">RECRUIT</span>
        </span>
      </Link>

      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-[0_30px_80px_-40px_rgba(6,47,110,.45)]">
        {showConfetti && <Confetti />}

        <span
          className={`anim-pop relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${s.from} ${s.to} text-white shadow-xl ${s.ring}`}
        >
          <Icon className="h-7 w-7" />
        </span>

        <h1 className="relative mt-5 text-2xl font-black text-[#062F6E]">
          {m.title}
        </h1>
        <p className="relative mt-2 leading-relaxed text-slate-500">{m.text}</p>

        {posteLabel && (
          <div className="anim-fade-up relative mt-5 inline-flex items-center gap-2 rounded-full bg-[#0B4E9B]/8 px-4 py-1.5 text-xs font-black text-[#0B4E9B]">
            <I.briefcase className="h-3.5 w-3.5" />
            {posteLabel}
          </div>
        )}

        {app.statut === "embauche" && (
          <div className="anim-fade-up relative mt-6 rounded-2xl bg-gradient-to-br from-[#3AAA35]/8 to-[#8DC63F]/8 p-4 text-left">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#3AAA35]">
              Prochaines étapes
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <I.mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3AAA35]" />
                Vous recevrez un e-mail de confirmation à l'adresse fournie lors
                de votre candidature.
              </li>
              <li className="flex items-start gap-2">
                <I.phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3AAA35]" />
                Un membre de l'équipe RH vous contactera pour organiser la suite
                du processus.
              </li>
            </ul>
          </div>
        )}

        {app.statut === "refuse" && (
          <Link
            to="/mon-espace"
            className="anim-fade-up relative mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#0B4E9B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#0B4E9B]/25 transition hover:scale-105"
          >
            Voir d'autres offres
            <I.arrow className="h-4 w-4" />
          </Link>
        )}

        <div className="anim-fade-up relative mt-7 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
          <I.heart className="h-4 w-4 shrink-0 text-[#E6007E]" />
          <p className="text-xs leading-relaxed text-slate-500">
            Merci pour l'intérêt que vous portez à Tunisie Telecom.
          </p>
        </div>

        <Link
          to="/mon-espace"
          className="relative mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-[#0B4E9B] transition hover:gap-2.5"
        >
          <I.back className="h-4 w-4" />
          Retour à mes candidatures
        </Link>
      </div>
    </div>
  );
}
