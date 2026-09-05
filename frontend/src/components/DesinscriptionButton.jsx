import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DesinscriptionButton({ userId, variant = "footer" }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDesinscrire = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/candidate-auth/${userId}/desactiver`, {
        statut: "inactif",
        desinscritLe: new Date().toISOString(),
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowModal(false);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`group inline-flex items-center gap-2 rounded-full border-2 border-red-100 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:border-red-200 hover:bg-red-100 hover:text-red-700 active:scale-95 ${variant === "inline" ? "" : "w-full justify-center sm:w-auto"}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4 transition-transform group-hover:rotate-12"
        >
          <path d="M18 6 6 18M6 6l12 12" />
          <circle cx="12" cy="12" r="9" opacity="0.3" />
        </svg>
        Désactiver mon compte
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#03214f]/60 backdrop-blur-sm transition-opacity"
            onClick={() => !loading && setShowModal(false)}
          />
          <div className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-8 w-8"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
            <h3 className="mt-5 text-center text-xl font-black text-[#062F6E]">
              Confirmer la désinscription
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate-500">
              Êtes-vous sûr de vouloir{" "}
              <strong className="text-red-600">désactiver votre compte</strong>{" "}
              ?<br />
              Cette action est <strong>irréversible</strong>. Vos données seront
              conservées pendant 30 jours puis supprimées définitivement.
            </p>
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-600">
                {error}
              </div>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDesinscrire}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.3"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
                      />
                    </svg>
                    Traitement...
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                    Confirmer la désinscription
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
