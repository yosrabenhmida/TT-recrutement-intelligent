import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";

const STATUTS = {
  nouveau: { label: "Nouveau", cls: "bg-slate-100 text-slate-600" },
  shortliste: {
    label: "Entretien programmé",
    cls: "bg-[#29ABE2]/15 text-[#0B7BB5]",
  },
  chatbot_en_cours: {
    label: "Chatbot en cours",
    cls: "bg-[#F7941E]/15 text-[#b3660a]",
  },
  chatbot_termine: {
    label: "Chatbot terminé",
    cls: "bg-[#E6007E]/12 text-[#c2005f]",
  },
  invite_chatbot: {
    label: "Invité au chatbot",
    cls: "bg-[#E6007E]/10 text-[#c2005f]",
  },
  refuse: { label: "Refusé", cls: "bg-red-50 text-red-600" },
  embauche: { label: "Embauché", cls: "bg-[#8DC63F]/15 text-[#4c7a1a]" },
};

const I = {
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
  x: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M18 6 6 18M6 6l12 12" />
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
  sparkles: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2 13.6 8.4 20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
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
};

function ScoreRing({ label, value, color }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const pct = (value ?? 0) / 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative grid h-20 w-20 place-items-center">
        <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="#eef2f7"
            strokeWidth="6"
          />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{
              transition: "stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </svg>
        <span className="absolute text-lg font-black text-[#062F6E]">
          {value ?? "—"}
        </span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}

export default function CandidatDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [deciding, setDeciding] = useState(false);

  const load = () =>
    api.get(`/applications/${id}`).then((res) => setApp(res.data));
  useEffect(() => {
    load();
  }, [id]);

  const [justChanged, setJustChanged] = useState(false);

  const decide = async (statut) => {
    setDeciding(true);
    try {
      await api.patch(`/applications/${id}/status`, { statut });
      await load();
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 2500);
    } finally {
      setDeciding(false);
    }
  };

  if (!app) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="ml-64 flex flex-1 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B4E9B]/20 border-t-[#0B4E9B]" />
        </main>
      </div>
    );
  }

  const c = app.candidate;
  const initials = `${c.prenom?.[0] || ""}${c.nom?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <Link
          to={`/admin/offres/${app.jobOffer?._id || app.jobOffer}/candidats`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-[#0B4E9B]"
        >
          <I.back className="h-3.5 w-3.5" />
          Retour à la liste
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0B4E9B] to-[#29ABE2] text-xl font-black text-white shadow-lg shadow-[#0B4E9B]/25">
            {initials}
          </span>
          <div>
            <h1 className="text-2xl font-black text-[#062F6E]">
              {c.prenom} {c.nom}
            </h1>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-[11px] font-black ${STATUTS[app.statut]?.cls || STATUTS.nouveau.cls}`}
            >
              {STATUTS[app.statut]?.label || "Nouveau"}
            </span>
            <p className="text-sm text-slate-500">{c.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Colonne infos */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_30px_80px_-40px_rgba(6,47,110,.2)]">
              <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">
                Informations
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Téléphone : </span>
                  <b className="text-[#062F6E]">{c.telephone || "—"}</b>
                </div>

                <div>
                  <span className="text-slate-400">Université : </span>
                  <b className="text-[#062F6E]">
                    {c.academics?.[0]?.etablissement || c.universite || "—"}
                  </b>
                </div>
                <div>
                  <span className="text-slate-400">Diplôme : </span>
                  <b className="text-[#062F6E]">
                    {c.academics?.[0]?.diplomePrepare || c.diplome || "—"}
                  </b>
                </div>
                <div>
                  <span className="text-slate-400">Ville : </span>
                  <b className="text-[#062F6E]">
                    {c.localisation?.ville || "—"}
                  </b>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {c.cvUrl && (
                  <a
                    href={`http://localhost:5000${c.cvUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0B4E9B]/10 px-4 py-2 text-xs font-black text-[#0B4E9B] transition hover:bg-[#0B4E9B]/20"
                  >
                    <I.doc className="h-4 w-4" />
                    Télécharger le CV
                  </a>
                )}
                <Link
                  to={`/admin/candidats/${id}/chatbot-review`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E6007E]/10 px-4 py-2 text-xs font-black text-[#c2005f] transition hover:bg-[#E6007E]/20"
                >
                  Réponses au chatbot →
                </Link>
              </div>
            </div>

            {/* Analyse IA */}
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_30px_80px_-40px_rgba(6,47,110,.2)]">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <I.sparkles className="h-3.5 w-3.5 text-[#E6007E]" />
                Analyse de l'IA
              </h2>

              {app.commentaireIA && (
                <p className="mb-5 rounded-2xl bg-[#0B4E9B]/5 px-4 py-3 text-sm italic leading-relaxed text-[#062F6E]">
                  « {app.commentaireIA} »
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Compétences trouvées
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.competencesTrouvees?.length ? (
                      app.competencesTrouvees.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[#8DC63F]/15 px-3 py-1 text-[11px] font-black text-[#4c7a1a]"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Compétences manquantes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.competencesManquantes?.length ? (
                      app.competencesManquantes.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border-2 border-red-100 bg-red-50 px-3 py-1 text-[11px] font-black text-red-500"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne scores + décision */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white bg-white p-6 text-center shadow-[0_30px_80px_-40px_rgba(6,47,110,.2)]">
              <h2 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-400">
                Scores
              </h2>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <ScoreRing
                  label="CV"
                  value={app.matchingScore}
                  color="#29ABE2"
                />
                <ScoreRing
                  label="Soft Skills"
                  value={app.softSkillsScore}
                  color="#E6007E"
                />
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#0B4E9B]/5 to-[#29ABE2]/5 py-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Score global
                </p>
                <p className="text-4xl font-black text-[#062F6E]">
                  {app.scoreGlobal ?? "—"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_30px_80px_-40px_rgba(6,47,110,.2)]">
              <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">
                Décision
              </h2>
              {justChanged && (
                <p className="mb-3 rounded-xl bg-[#8DC63F]/10 px-3 py-2 text-xs font-black text-[#4c7a1a]">
                  ✓ Statut mis à jour
                </p>
              )}
              <div className="space-y-2.5">
                <button
                  onClick={() => decide("embauche")}
                  disabled={deciding}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8DC63F] to-[#3AAA35] py-3 text-sm font-black text-white shadow-lg shadow-[#8DC63F]/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <I.check className="h-4 w-4" />
                  Embaucher
                </button>
                <button
                  onClick={() => decide("shortliste")}
                  disabled={deciding}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0B4E9B] to-[#29ABE2] py-3 text-sm font-black text-white shadow-lg shadow-[#0B4E9B]/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <I.calendar className="h-4 w-4" />
                  Inviter au chatbot
                </button>
                <button
                  onClick={() => decide("refuse")}
                  disabled={deciding}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-100 bg-red-50 py-3 text-sm font-black text-red-500 transition-all hover:scale-[1.02] hover:bg-red-100 active:scale-95 disabled:opacity-50"
                >
                  <I.x className="h-4 w-4" />
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
