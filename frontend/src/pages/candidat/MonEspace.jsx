import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import TTLogo from "../../components/TTLogo";

const I = {
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
    </svg>
  ),
  eye: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
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
  inbox: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
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
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  calendar: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
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
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  x: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  chevronLeft: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
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
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
};

const STATUS_CONFIG = {
  nouveau: {
    label: "En cours d'analyse",
    color: "#29ABE2",
    bg: "bg-[#29ABE2]/10",
    text: "text-[#0B7BB5]",
  },
  shortliste: {
    label: "Présélectionné",
    color: "#8DC63F",
    bg: "bg-[#8DC63F]/12",
    text: "text-[#5f8a1f]",
  },
  chatbot_en_cours: {
    label: "Chatbot en cours",
    color: "#F7941E",
    bg: "bg-[#F7941E]/12",
    text: "text-[#c26a10]",
  },
  chatbot_termine: {
    label: "Évaluation terminée",
    color: "#92278F",
    bg: "bg-[#92278F]/10",
    text: "text-[#7c2179]",
  },
  refuse: {
    label: "Non retenu",
    color: "#94a3b8",
    bg: "bg-slate-100",
    text: "text-slate-500",
  },
  embauche: {
    label: "Recruté 🎉",
    color: "#3AAA35",
    bg: "bg-[#3AAA35]/12",
    text: "text-[#2f8a2b]",
  },
};

const PAGE_SIZE_OFFRES = 5;
const PAGE_SIZE_APPS = 6;

function StatusBadge({ statut }) {
  const c = STATUS_CONFIG[statut] || {
    label: "Statut inconnu",
    color: "#94a3b8",
    bg: "bg-slate-100",
    text: "text-slate-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${c.bg} ${c.text}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse border-b border-slate-100 p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 h-4 rounded bg-slate-200" />
        <div className="col-span-3 h-4 rounded bg-slate-200" />
        <div className="col-span-2 h-4 rounded bg-slate-200" />
        <div className="col-span-2 h-4 rounded bg-slate-200" />
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-xs">
      <I.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0B4E9B] focus:ring-2 focus:ring-[#0B4E9B]/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <I.x className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
      <span className="text-xs font-semibold text-slate-400">
        Page {page} sur {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <I.chevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition ${
              n === page
                ? "bg-[#0B4E9B] text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <I.chevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function MonEspace() {
  const [applications, setApplications] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingOffres, setLoadingOffres] = useState(true);
  const email = localStorage.getItem("candidateEmail");

  // Recherche & filtres
  const [searchOffres, setSearchOffres] = useState("");
  const [searchApps, setSearchApps] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");

  // Pagination
  const [pageOffres, setPageOffres] = useState(1);
  const [pageApps, setPageApps] = useState(1);

  useEffect(() => {
    if (!email) {
      setLoadingApps(false);
    } else {
      api
        .get(`/applications/candidate?email=${email}`)
        .then((res) => setApplications(res.data))
        .finally(() => setLoadingApps(false));
    }

    api
      .get("/jobs")
      .then((res) => setOffres(res.data))
      .finally(() => setLoadingOffres(false));
  }, [email]);

  const appliedJobIds = new Set(
    applications.map((a) => a.jobOffer?._id).filter(Boolean),
  );

  const offresDisponibles = useMemo(() => {
    const base = offres.filter((o) => !appliedJobIds.has(o._id));
    const q = searchOffres.trim().toLowerCase();
    if (!q) return base;
    return base.filter((o) =>
      [o.titrePoste, o.reference, o.localisation]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offres, applications, searchOffres]);

  const applicationsFiltrees = useMemo(() => {
    let base = applications;
    if (filterStatut !== "tous") {
      base = base.filter((a) => a.statut === filterStatut);
    }
    const q = searchApps.trim().toLowerCase();
    if (q) {
      base = base.filter((a) =>
        (a.jobOffer?.titrePoste || "").toLowerCase().includes(q),
      );
    }
    return base;
  }, [applications, filterStatut, searchApps]);

  // Reset pagination quand un filtre change
  useEffect(() => setPageOffres(1), [searchOffres, offres, applications]);
  useEffect(() => setPageApps(1), [searchApps, filterStatut, applications]);

  const totalPagesOffres = Math.max(
    1,
    Math.ceil(offresDisponibles.length / PAGE_SIZE_OFFRES),
  );
  const totalPagesApps = Math.max(
    1,
    Math.ceil(applicationsFiltrees.length / PAGE_SIZE_APPS),
  );

  const offresPage = offresDisponibles.slice(
    (pageOffres - 1) * PAGE_SIZE_OFFRES,
    pageOffres * PAGE_SIZE_OFFRES,
  );
  const applicationsPage = applicationsFiltrees.slice(
    (pageApps - 1) * PAGE_SIZE_APPS,
    pageApps * PAGE_SIZE_APPS,
  );

  const stats = {
    total: applications.length,
    enCours: applications.filter(
      (a) =>
        a.statut === "shortliste" ||
        a.statut === "chatbot_en_cours" ||
        a.statut === "chatbot_termine",
    ).length,
    refuses: applications.filter((a) => a.statut === "refuse").length,
    recrutes: applications.filter((a) => a.statut === "embauche").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header avec TT Logo bien visible */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#062F6E] to-[#0B4E9B] p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                Espace Candidat
              </span>
              <h1 className="mt-3 text-3xl font-black">Bienvenue 🌟</h1>
              <p className="mt-1 text-blue-100/80">
                Suivez vos candidatures et découvrez de nouvelles opportunités
              </p>
            </div>
            {/* Logo TT avec texte */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <TTLogo className="h-14 w-auto" showText={false} animated />
              <div className="hidden sm:block leading-tight">
                <span className="block text-xl font-black text-white tracking-tight">
                  TT <span className="text-[#FFD100]">RECRUIT</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[.22em] text-blue-100/60">
                  Smart System · AI
                </span>
              </div>
            </Link>
          </div>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold transition hover:bg-white/25"
          >
            <I.back className="h-4 w-4" />
            Retour aux offres
          </Link>
        </div>

        {/* Statistiques */}
        {!loadingApps && applications.length > 0 && (
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm border border-slate-100">
              <div className="text-2xl font-black text-[#0B4E9B]">
                {stats.total}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Total candidatures
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm border border-slate-100">
              <div className="text-2xl font-black text-[#8DC63F]">
                {stats.enCours}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                En cours
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm border border-slate-100">
              <div className="text-2xl font-black text-slate-400">
                {stats.refuses}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Non retenues
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm border border-slate-100">
              <div className="text-2xl font-black text-[#3AAA35]">
                {stats.recrutes}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Recrutements
              </div>
            </div>
          </div>
        )}

        {/* Offres disponibles - TABLEAU */}
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#062F6E]">
              📋 Offres disponibles
            </h2>
            <div className="flex items-center gap-3">
              <SearchInput
                value={searchOffres}
                onChange={setSearchOffres}
                placeholder="Rechercher un poste, une réf..."
              />
              {!loadingOffres && offresDisponibles.length > 0 && (
                <span className="whitespace-nowrap rounded-full bg-[#0B4E9B]/10 px-3 py-1 text-xs font-bold text-[#0B4E9B]">
                  {offresDisponibles.length} résultat
                  {offresDisponibles.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* En-tête du tableau */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="col-span-5">Poste</div>
                <div className="col-span-3">Référence / Localisation</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
            </div>

            {/* Corps du tableau */}
            <div>
              {loadingOffres && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {!loadingOffres && offresDisponibles.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <p className="text-sm text-slate-500">
                    {searchOffres
                      ? "Aucune offre ne correspond à votre recherche"
                      : "Aucune nouvelle offre disponible"}
                  </p>
                </div>
              )}

              {!loadingOffres &&
                offresPage.map((o) => (
                  <div
                    key={o._id}
                    className="border-b border-slate-100 px-6 py-4 hover:bg-slate-50/50 transition"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <h3 className="font-bold text-[#062F6E] text-sm">
                          {o.titrePoste}
                        </h3>
                      </div>
                      <div className="col-span-3">
                        <div className="text-xs text-slate-500">
                          <div className="font-medium text-slate-700">
                            Réf. {o.reference}
                          </div>
                          {o.localisation && (
                            <div className="flex items-center gap-1 mt-0.5 text-slate-400">
                              <I.pin className="h-3 w-3" />
                              {o.localisation}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <I.calendar className="h-3 w-3" />
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString("fr-FR")
                            : "Nouvelle"}
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <Link
                          to={`/offres/${o._id}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#0B4E9B] px-4 py-1.5 text-xs font-bold text-white transition hover:scale-105 hover:shadow-md"
                        >
                          Postuler
                          <I.arrow className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <Pagination
              page={pageOffres}
              totalPages={totalPagesOffres}
              onChange={setPageOffres}
            />
          </div>
        </div>

        {/* Mes candidatures - TABLEAU */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#062F6E]">
              📌 Mes candidatures
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                value={searchApps}
                onChange={setSearchApps}
                placeholder="Rechercher un poste..."
              />
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="rounded-full border border-slate-200 bg-white py-2 pl-4 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#0B4E9B] focus:ring-2 focus:ring-[#0B4E9B]/15"
              >
                <option value="tous">Tous les statuts</option>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
              {!loadingApps && applicationsFiltrees.length > 0 && (
                <span className="whitespace-nowrap rounded-full bg-[#0B4E9B]/10 px-3 py-1 text-xs font-bold text-[#0B4E9B]">
                  {applicationsFiltrees.length} résultat
                  {applicationsFiltrees.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* En-tête du tableau */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="col-span-4">Poste</div>
                <div className="col-span-3">Statut</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3 text-right">Action</div>
              </div>
            </div>

            {/* Corps du tableau */}
            <div>
              {loadingApps && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {!loadingApps && applications.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 text-3xl text-slate-300">
                    <I.inbox className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-black text-[#062F6E]">
                    Aucune candidature
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                    Parcourez les offres ci-dessus et postulez en quelques
                    minutes.
                  </p>
                </div>
              )}

              {!loadingApps &&
                applications.length > 0 &&
                applicationsFiltrees.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <div className="text-3xl mb-3">🔍</div>
                    <p className="text-sm text-slate-500">
                      Aucune candidature ne correspond à ces filtres
                    </p>
                  </div>
                )}

              {!loadingApps &&
                applicationsPage.map((a) => (
                  <div
                    key={a._id}
                    className="border-b border-slate-100 px-6 py-4 hover:bg-slate-50/50 transition"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0B4E9B]/10 text-[#0B4E9B]">
                            <I.briefcase className="h-4 w-4" />
                          </span>
                          <span className="font-bold text-[#062F6E] text-sm">
                            {a.jobOffer?.titrePoste || "Offre"}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <StatusBadge statut={a.statut} />
                      </div>
                      <div className="col-span-2">
                        {a.dateEntretien ? (
                          <div className="text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-[#F7941E]">
                              <I.calendar className="h-3 w-3" />
                              {new Date(a.dateEntretien).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </div>
                            {a.lieuEntretien && (
                              <div className="mt-0.5 flex items-center gap-1 text-slate-400">
                                <I.pin className="h-3 w-3" />
                                {a.lieuEntretien}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <I.calendar className="h-3 w-3" />-
                          </div>
                        )}
                      </div>
                      <div className="col-span-3 text-right">
                        <div className="flex justify-end gap-2">
                          {a.statut === "shortliste" && (
                            <Link
                              to={`/mon-espace/chatbot/${a._id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#8DC63F] px-4 py-1.5 text-xs font-bold text-white transition hover:scale-105"
                            >
                              <I.chat className="h-3.5 w-3.5" />
                              Chatbot
                            </Link>
                          )}
                          {(a.statut === "chatbot_termine" ||
                            a.statut === "embauche" ||
                            a.statut === "refuse") && (
                            <Link
                              to={`/mon-espace/resultat/${a._id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#0B4E9B] px-4 py-1.5 text-xs font-bold text-white transition hover:scale-105"
                            >
                              <I.eye className="h-3.5 w-3.5" />
                              Résultat
                            </Link>
                          )}
                          {a.statut === "chatbot_en_cours" && (
                            <Link
                              to={`/mon-espace/chatbot/${a._id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#F7941E] px-4 py-1.5 text-xs font-bold text-white transition hover:scale-105"
                            >
                              <I.chat className="h-3.5 w-3.5" />
                              Continuer
                            </Link>
                          )}
                          {a.statut === "nouveau" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-400">
                              ⏳ En cours
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <Pagination
              page={pageApps}
              totalPages={totalPagesApps}
              onChange={setPageApps}
            />
          </div>
        </div>

        {/* Footer avec TT */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 hover:opacity-80 transition"
          >
            <TTLogo className="h-10 w-auto" showText={false} animated />
            <div className="text-left">
              <span className="block text-sm font-black text-[#062F6E] tracking-tight">
                TT <span className="tt-gradient-text">RECRUIT</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[.22em] text-slate-400">
                Smart System · AI
              </span>
            </div>
          </Link>
          <p className="mt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} Tunisie Telecom. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
