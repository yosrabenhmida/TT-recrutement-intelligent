import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Constantes — palette Tunisie Telecom                               */
/* ------------------------------------------------------------------ */

const COLORS = [
  "#0B4E9B",
  "#29ABE2",
  "#00A99D",
  "#8DC63F",
  "#FFD100",
  "#F7941E",
  "#E6007E",
  "#92278F",
];

const STATUT_LABELS = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  presel: "Présélectionné",
  preselectionne: "Présélectionné",
  entretien: "Entretien",
  accepte: "Accepté",
  refuse: "Refusé",
  null: "Non défini",
};

const STATUT_COLORS = [
  "#0B4E9B",
  "#29ABE2",
  "#FFD100",
  "#8DC63F",
  "#3AAA35",
  "#E6007E",
];

/* ------------------------------------------------------------------ */
/*  Petits composants UI                                               */
/* ------------------------------------------------------------------ */

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

const ICONS = {
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  building: (
    <>
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
      <path d="M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
    </>
  ),
  refresh: (
    <>
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
};

function StatCard({ label, value, sub, icon, from, to, ring }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-6">
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${from} ${to} opacity-10`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold text-[#062F6E] mt-2 tracking-tight">
            {value}
          </p>
          {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${from} ${to} text-white shadow-md ${ring}`}
        >
          <Icon path={icon} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-black text-[#062F6E]">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text = "Aucune donnée disponible" }) {
  return (
    <div className="h-[250px] flex flex-col items-center justify-center text-slate-300 gap-2">
      <Icon path={ICONS.inbox} className="w-10 h-10" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

function ChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#062F6E]/95 backdrop-blur text-white text-xs rounded-lg px-3 py-2 shadow-xl">
      <p className="font-semibold mb-0.5">{label ?? payload[0].name}</p>
      <p className="text-blue-100/80">
        {payload[0].value} {suffix}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen animate-pulse">
        <div className="h-1.5 w-full tt-gradient-bar rounded-full mb-8 opacity-30" />
        <div className="h-8 w-72 bg-slate-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-2xl border border-slate-200"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-white rounded-2xl border border-slate-200"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadStats = useCallback(async (silent = false) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
      setUpdatedAt(new Date());
      setError(null);
    } catch (e) {
      setError(
        e?.response?.data?.message || "Impossible de charger les statistiques.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const onFocus = () => loadStats(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadStats]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
          <div className="bg-[#E6007E]/8 border border-[#E6007E]/25 text-[#c2005f] rounded-2xl p-6 max-w-lg">
            <p className="font-semibold mb-1">Erreur</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => loadStats()}
              className="bg-[#0B4E9B] hover:bg-[#093f80] text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- Normalisation des données ---------- */
  const competences = stats.competences ?? [];
  const diplomes = (stats.diplomes ?? []).filter((d) => d._id);
  const universites = (stats.universites ?? [])
    .filter((u) => u._id)
    .slice(0, 8);
  const funnel = (stats.funnel ?? []).map((f) => ({
    ...f,
    label: STATUT_LABELS[f._id] ?? f._id ?? "Non défini",
  }));
  const candidaturesParOffre = (stats.candidaturesParOffre ?? []).slice(0, 8);
  const postesParLieu = (stats.postesParLieu ?? []).slice(0, 8);
  const genre = (stats.genre ?? []).filter((g) => g._id);

  const totalDiplomes = diplomes.reduce((s, d) => s + d.count, 0);
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-gradient-to-b from-slate-50 to-slate-100/60 min-h-screen">
        {/* barre de marque en haut */}
        <div className="-mt-8 -mx-8 mb-8 h-1.5 tt-gradient-bar" />

        {/* ---------- Header ---------- */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0B4E9B]/8 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-[#0B4E9B]">
              TT Recruit · Admin
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#062F6E] tracking-tight">
              Dashboard Intelligent RH
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Vue d'ensemble des offres et des candidatures
              {updatedAt && (
                <span className="text-slate-400">
                  {" · "}mis à jour à{" "}
                  {updatedAt.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => loadStats(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0B4E9B] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-60"
          >
            <Icon
              path={ICONS.refresh}
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
        </header>

        {/* ---------- KPI ---------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Offres publiées"
            value={stats.totalOffres ?? "—"}
            sub={
              stats.offresActives != null
                ? `${stats.offresActives} active(s)`
                : "Ajoutez les stats offres au backend"
            }
            icon={ICONS.briefcase}
            from="from-[#0B4E9B]"
            to="to-[#29ABE2]"
            ring="shadow-[#0B4E9B]/20"
          />
          <StatCard
            label="Postes ouverts"
            value={stats.totalPostes ?? "—"}
            sub="Toutes affectations confondues"
            icon={ICONS.building}
            from="from-[#00A99D]"
            to="to-[#8DC63F]"
            ring="shadow-[#00A99D]/20"
          />
          <StatCard
            label="Candidatures"
            value={stats.totalApplications ?? 0}
            sub={`${diplomes.length} profil(s) de diplôme`}
            icon={ICONS.users}
            from="from-[#92278F]"
            to="to-[#E6007E]"
            ring="shadow-[#92278F]/20"
          />
          <StatCard
            label="Score moyen"
            value={stats.scoreMoyen ?? 0}
            sub={`${universites.length} université(s) représentée(s)`}
            icon={ICONS.star}
            from="from-[#FFD100]"
            to="to-[#F7941E]"
            ring="shadow-[#F7941E]/20"
          />
        </section>

        {/* ---------- Graphiques ---------- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compétences */}
          <Card
            title="Compétences les plus demandées"
            subtitle="Top 10 extrait des CV"
          >
            {competences.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={competences} margin={{ top: 10 }}>
                  <defs>
                    <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B4E9B" />
                      <stop offset="100%" stopColor="#29ABE2" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eef2f7"
                  />
                  <XAxis
                    dataKey="_id"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={55}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    content={<ChartTooltip suffix="candidat(s)" />}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gBlue)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Aucune compétence extraite" />
            )}
          </Card>

          {/* Diplômes */}
          <Card title="Diplômes fréquents" subtitle="Répartition des candidats">
            {diplomes.length ? (
              <div className="relative">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={diplomes}
                      dataKey="count"
                      nameKey="_id"
                      innerRadius={62}
                      outerRadius={95}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {diplomes.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip suffix="candidat(s)" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-[#062F6E]">
                    {totalDiplomes}
                  </span>
                  <span className="text-xs text-slate-400">candidats</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
                  {diplomes.slice(0, 6).map((d, i) => (
                    <div key={d._id} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-xs text-slate-600">
                        {d._id}{" "}
                        <span className="text-slate-400">
                          ({Math.round((d.count / totalDiplomes) * 100)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState text="Aucun diplôme renseigné" />
            )}
          </Card>

          {/* Universités */}
          <Card title="Candidatures par université" subtitle="Top 8">
            {universites.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={universites}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                >
                  <defs>
                    <linearGradient id="gViolet" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#c896c6" />
                      <stop offset="100%" stopColor="#92278F" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#eef2f7"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="_id"
                    type="category"
                    width={140}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={<ChartTooltip />}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gViolet)"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={22}
                  >
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fontSize: 11, fill: "#64748b" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Aucune université renseignée" />
            )}
          </Card>

          {/* Candidatures par offre */}
          <Card
            title="Candidatures par offre"
            subtitle="Attractivité de chaque annonce"
          >
            {candidaturesParOffre.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={candidaturesParOffre}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                >
                  <defs>
                    <linearGradient id="gAmber" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FFD100" />
                      <stop offset="100%" stopColor="#F7941E" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#eef2f7"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="_id"
                    type="category"
                    width={150}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#fffbeb" }}
                    content={<ChartTooltip />}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gAmber)"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={22}
                  >
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fontSize: 11, fill: "#64748b" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Ajoutez « candidaturesParOffre » au backend" />
            )}
          </Card>
          {/* Entonnoir */}
          <Card
            title="Entonnoir de recrutement"
            subtitle="Répartition par statut"
          >
            {funnel.length ? (
              <div className="space-y-4 py-2">
                {funnel.map((f, i) => (
                  <div key={f._id ?? i}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-medium text-slate-700">
                        {f.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {f.count}
                        <span className="text-xs text-slate-400 font-normal ml-1">
                          (
                          {Math.round(
                            (f.count / (stats.totalApplications || 1)) * 100,
                          )}
                          %)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.max((f.count / maxFunnel) * 100, 3)}%`,
                          background: `linear-gradient(90deg, ${
                            STATUT_COLORS[i % STATUT_COLORS.length]
                          }99, ${STATUT_COLORS[i % STATUT_COLORS.length]})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Aucune candidature enregistrée" />
            )}
          </Card>

          {/* Postes par lieu d'affectation */}
          <Card
            title="Postes par lieu d'affectation"
            subtitle="Répartition géographique des recrutements"
          >
            {postesParLieu.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={postesParLieu} margin={{ top: 10 }}>
                  <defs>
                    <linearGradient id="gEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00A99D" />
                      <stop offset="100%" stopColor="#8DC63F" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eef2f7"
                  />
                  <XAxis
                    dataKey="_id"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f0fdf4" }}
                    content={<ChartTooltip suffix="poste(s)" />}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gEmerald)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={44}
                  >
                    <LabelList
                      dataKey="count"
                      position="top"
                      style={{ fontSize: 11, fill: "#64748b" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Ajoutez « postesParLieu » au backend" />
            )}
          </Card>

          {/* Répartition par genre */}
          <Card title="Répartition par genre" subtitle="Profil des candidats">
            {genre.length ? (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="55%" height={230}>
                  <PieChart>
                    <Pie
                      data={genre}
                      dataKey="count"
                      nameKey="_id"
                      innerRadius={55}
                      outerRadius={88}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {genre.map((_, i) => (
                        <Cell
                          key={i}
                          fill={["#29ABE2", "#E6007E", "#94a3b8"][i % 3]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip suffix="candidat(s)" />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex-1 space-y-3">
                  {genre.map((g, i) => {
                    const total = genre.reduce((s, x) => s + x.count, 0) || 1;
                    const pct = Math.round((g.count / total) * 100);
                    return (
                      <div key={g._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 capitalize">
                            {g._id}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: ["#29ABE2", "#E6007E", "#94a3b8"][
                                i % 3
                              ],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState text="Aucune donnée de genre" />
            )}
          </Card>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="mt-10 pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            Données calculées en temps réel depuis MongoDB ·{" "}
            <span className="text-slate-500 font-medium">
              {stats.totalApplications ?? 0}
            </span>{" "}
            candidature(s) analysée(s)
          </p>
          <p>
            {updatedAt &&
              `Dernière synchronisation : ${updatedAt.toLocaleString("fr-FR")}`}
          </p>
        </footer>
      </main>
    </div>
  );
}
