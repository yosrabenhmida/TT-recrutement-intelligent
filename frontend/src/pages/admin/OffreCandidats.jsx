import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";

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
  users: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
  trash: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M4 7h16M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
};

const STATUTS = {
  nouveau: { label: "Nouveau", cls: "bg-slate-100 text-slate-600" },
  shortliste: { label: "Entretien", cls: "bg-[#29ABE2]/15 text-[#0B7BB5]" },
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

function scoreColor(score) {
  if (score == null) return { text: "text-slate-300", bar: "bg-slate-200" };
  if (score >= 70)
    return {
      text: "text-[#4c7a1a]",
      bar: "bg-gradient-to-r from-[#8DC63F] to-[#3AAA35]",
    };
  if (score >= 40)
    return {
      text: "text-[#b3660a]",
      bar: "bg-gradient-to-r from-[#F7941E] to-[#e07d00]",
    };
  return {
    text: "text-[#c2005f]",
    bar: "bg-gradient-to-r from-[#E6007E] to-[#b3005f]",
  };
}

function ScoreBar({ label, value }) {
  const c = scoreColor(value);
  return (
    <div className="min-w-[110px]">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span className={`text-xs font-black ${c.text}`}>{value ?? "—"}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${c.bar}`}
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MODAL — Planifier un entretien
   ============================================================ */
function EntretienModal({ application, onClose, onSaved }) {
  const [date, setDate] = useState(
    application.dateEntretien
      ? new Date(application.dateEntretien).toISOString().slice(0, 10)
      : "",
  );
  const [heure, setHeure] = useState(
    application.dateEntretien
      ? new Date(application.dateEntretien).toISOString().slice(11, 16)
      : "09:00",
  );
  const [lieu, setLieu] = useState(application.lieuEntretien || "");
  const [note, setNote] = useState(application.noteEntretien || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Merci de choisir une date.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dateEntretien = new Date(`${date}T${heure}:00`);
      const { data } = await api.patch(
        `/applications/${application._id}/entretien`,
        {
          dateEntretien,
          lieuEntretien: lieu,
          noteEntretien: note,
        },
      );
      onSaved(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la planification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03214f]/50 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black text-[#062F6E]">
            Planifier un entretien
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <I.close className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-sm text-slate-500">
          Avec{" "}
          <span className="font-bold text-[#062F6E]">
            {application.candidate?.prenom} {application.candidate?.nom}
          </span>
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-[#E6007E]/25 bg-[#E6007E]/8 px-4 py-2.5 text-xs font-semibold text-[#c2005f]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Heure
              </span>
              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Lieu (optionnel)
            </span>
            <input
              type="text"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              placeholder="Ex : Siège TT Nabeul, salle 3"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Note interne (optionnel)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#29ABE2] focus:ring-4 focus:ring-[#29ABE2]/15"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[#0B4E9B] py-3 text-sm font-black text-white shadow-lg shadow-[#0B4E9B]/25 transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {loading ? "Enregistrement..." : "Confirmer l'entretien"}
          </button>
        </form>
      </div>
    </div>
  );
}
/* ============================================================
   MODAL — Confirmation de suppression
   ============================================================ */
function DeleteConfirmModal({ application, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/applications/${application._id}`);
      onConfirm(application._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la suppression");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03214f]/50 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
          <I.trash className="h-7 w-7" />
        </span>

        <h3 className="mt-5 text-lg font-black text-[#062F6E]">
          Supprimer ce candidat ?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Vous êtes sur le point de supprimer définitivement la candidature de{" "}
          <span className="font-bold text-[#062F6E]">
            {application.candidate?.prenom} {application.candidate?.nom}
          </span>
          . Cette action est irréversible.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-[#E6007E]/25 bg-[#E6007E]/8 px-4 py-2.5 text-xs font-semibold text-[#c2005f]">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-red-500 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function OffreCandidats() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCandidat, setModalCandidat] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const handleDeleted = (deletedId) => {
    setApplications((list) => list.filter((a) => a._id !== deletedId));
  };
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => {});
    api
      .get(`/applications/job/${id}`)
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const sorted = useMemo(
    () =>
      [...applications].sort(
        (a, b) => (b.scoreGlobal ?? -1) - (a.scoreGlobal ?? -1),
      ),
    [applications],
  );

  const handleEntretienSaved = (updated) => {
    setApplications((list) =>
      list.map((a) => (a._id === updated._id ? updated : a)),
    );
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <Link
          to="/admin/offres"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-[#0B4E9B]"
        >
          <I.back className="h-3.5 w-3.5" />
          Retour aux offres
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0B4E9B]/10 text-[#0B4E9B]">
            <I.users className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[#062F6E]">
              {job?.titrePoste || "Candidats"}
            </h1>
            <p className="text-sm text-slate-500">
              {sorted.length} candidature{sorted.length > 1 ? "s" : ""} — triées
              par score global
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B4E9B]/20 border-t-[#0B4E9B]" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="text-sm font-bold text-slate-400">
              Aucune candidature pour cette offre pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_30px_80px_-40px_rgba(6,47,110,.25)]">
            <span className="block h-1.5 bg-gradient-to-r from-[#29ABE2] via-[#8DC63F] to-[#E6007E]" />
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4">Candidat</th>
                  <th className="p-4">Matching CV</th>
                  <th className="p-4">Soft Skills</th>
                  <th className="p-4">Score global</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4"></th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a, i) => {
                  const st = STATUTS[a.statut] || STATUTS.nouveau;
                  return (
                    <tr
                      key={a._id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/60"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0B4E9B]/10 text-xs font-black text-[#0B4E9B]">
                            {i + 1}
                          </span>
                          <span className="font-black text-[#062F6E]">
                            {a.candidate?.prenom} {a.candidate?.nom}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <ScoreBar label="CV" value={a.matchingScore} />
                      </td>
                      <td className="p-4">
                        <ScoreBar label="Soft" value={a.softSkillsScore} />
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-lg font-black ${scoreColor(a.scoreGlobal).text}`}
                        >
                          {a.scoreGlobal ?? "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-black ${st.cls}`}
                        >
                          {st.label}
                        </span>
                        {a.dateEntretien && (
                          <p className="mt-1 text-[10px] font-bold text-slate-400">
                            {new Date(a.dateEntretien).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-black text-red-500 transition hover:border-red-200 hover:bg-red-50"
                        >
                          <I.trash className="h-3.5 w-3.5" />
                          Supprimer
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setModalCandidat(a)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-500 transition hover:border-[#0B4E9B]/40 hover:text-[#0B4E9B]"
                        >
                          <I.calendar className="h-3.5 w-3.5" />
                          {a.dateEntretien ? "Modifier" : "Planifier"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/admin/candidats/${a._id}`}
                          className="group inline-flex items-center gap-1 text-xs font-black text-[#0B4E9B] transition hover:underline"
                        >
                          Voir fiche
                          <I.arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modalCandidat && (
        <EntretienModal
          application={modalCandidat}
          onClose={() => setModalCandidat(null)}
          onSaved={handleEntretienSaved}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          application={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleted}
        />
      )}
    </div>
  );
}
