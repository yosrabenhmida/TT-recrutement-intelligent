import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";

const I = {
  chevronLeft: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  chevronRight: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="m9 18 6-6-6-6" />
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
  pin: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
};

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

/** Retourne "YYYY-MM-DD" en heure locale (évite le décalage UTC de toISOString) */
function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendrier() {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mois, setMois] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [jourSelectionne, setJourSelectionne] = useState(null);

  useEffect(() => {
    api
      .get("/applications/entretiens/all")
      .then((res) => setEntretiens(res.data || []))
      .catch(() => setEntretiens([]))
      .finally(() => setLoading(false));
  }, []);

  /* ---- Groupe les entretiens par jour ---- */
  const parJour = useMemo(() => {
    const map = {};
    entretiens.forEach((e) => {
      if (!e.dateEntretien) return;
      const key = toKey(new Date(e.dateEntretien));
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [entretiens]);

  /* ---- Construction de la grille du mois ---- */
  const grille = useMemo(() => {
    const annee = mois.getFullYear();
    const moisIndex = mois.getMonth();
    const premierJour = new Date(annee, moisIndex, 1);
    const nbJours = new Date(annee, moisIndex + 1, 0).getDate();

    // décalage pour commencer la semaine un Lundi (0 = Lundi ... 6 = Dimanche)
    let decalage = premierJour.getDay() - 1;
    if (decalage < 0) decalage = 6;

    const cases = [];
    for (let i = 0; i < decalage; i++) cases.push(null);
    for (let j = 1; j <= nbJours; j++) cases.push(new Date(annee, moisIndex, j));
    return cases;
  }, [mois]);

  const aujourdHui = toKey(new Date());

  const listeJourSelectionne = jourSelectionne
    ? parJour[toKey(jourSelectionne)] || []
    : [];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0B4E9B]/10 text-[#0B4E9B]">
            <I.calendar className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[#062F6E]">
              Calendrier des entretiens
            </h1>
            <p className="text-sm text-slate-500">
              {entretiens.length} entretien{entretiens.length > 1 ? "s" : ""}{" "}
              planifié{entretiens.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B4E9B]/20 border-t-[#0B4E9B]" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* ---- Calendrier mensuel ---- */}
            <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_30px_80px_-40px_rgba(6,47,110,.25)]">
              <span className="block h-1.5 bg-gradient-to-r from-[#29ABE2] via-[#8DC63F] to-[#E6007E]" />
              <div className="p-6">
                {/* navigation mois */}
                <div className="mb-5 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setMois((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
                    }
                    className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#0B4E9B]"
                  >
                    <I.chevronLeft className="h-4 w-4" />
                  </button>
                  <h2 className="text-lg font-black text-[#062F6E]">
                    {MOIS[mois.getMonth()]} {mois.getFullYear()}
                  </h2>
                  <button
                    onClick={() =>
                      setMois((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
                    }
                    className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#0B4E9B]"
                  >
                    <I.chevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* en-têtes jours */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {JOURS.map((j) => (
                    <span
                      key={j}
                      className="pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400"
                    >
                      {j}
                    </span>
                  ))}

                  {/* jours du mois */}
                  {grille.map((date, i) => {
                    if (!date) return <span key={`vide-${i}`} />;
                    const key = toKey(date);
                    const evts = parJour[key] || [];
                    const estAujourdHui = key === aujourdHui;
                    const estSelectionne =
                      jourSelectionne && toKey(jourSelectionne) === key;

                    return (
                      <button
                        key={key}
                        onClick={() => setJourSelectionne(date)}
                        className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl text-sm font-bold transition
                          ${
                            estSelectionne
                              ? "bg-[#0B4E9B] text-white shadow-lg shadow-[#0B4E9B]/25"
                              : estAujourdHui
                                ? "bg-[#29ABE2]/10 text-[#0B4E9B]"
                                : "text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {date.getDate()}
                        {evts.length > 0 && (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              estSelectionne ? "bg-white" : "bg-[#E6007E]"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ---- Détail du jour sélectionné ---- */}
            <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_30px_80px_-40px_rgba(6,47,110,.25)]">
              <span className="block h-1.5 bg-gradient-to-r from-[#29ABE2] via-[#8DC63F] to-[#E6007E]" />
              <div className="p-6">
                <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-400">
                  {jourSelectionne
                    ? jourSelectionne.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    : "Sélectionnez un jour"}
                </h3>

                {jourSelectionne && listeJourSelectionne.length === 0 && (
                  <p className="text-sm text-slate-400">
                    Aucun entretien ce jour-là.
                  </p>
                )}

                <div className="space-y-3">
                  {listeJourSelectionne.map((e) => (
                    <div
                      key={e._id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <p className="font-black text-[#062F6E]">
                        {e.candidate?.prenom} {e.candidate?.nom}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500">
                        {e.jobOffer?.titrePoste}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <I.clock className="h-3.5 w-3.5 text-[#29ABE2]" />
                          {new Date(e.dateEntretien).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {e.lieuEntretien && (
                          <span className="inline-flex items-center gap-1.5">
                            <I.pin className="h-3.5 w-3.5 text-[#E6007E]" />
                            {e.lieuEntretien}
                          </span>
                        )}
                      </div>
                      {e.noteEntretien && (
                        <p className="mt-2 text-xs italic text-slate-400">
                          {e.noteEntretien}
                        </p>
                      )}
                      <Link
                        to={`/admin/candidats/${e._id}`}
                        className="mt-3 inline-block text-xs font-black text-[#0B4E9B] hover:underline"
                      >
                        Voir la fiche →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}