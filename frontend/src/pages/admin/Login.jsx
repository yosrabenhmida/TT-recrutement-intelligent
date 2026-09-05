import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import TTLogo from "../../components/TTLogo";

const I = {
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
  lock: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
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
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03214f] font-[Inter,system-ui,sans-serif]">
      {/* fond mesh — identique à la Hero */}
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
      <div className="absolute -left-24 top-24 -z-10 h-80 w-80 rounded-full bg-[#29ABE2]/25 blur-[100px] tt-float" />
      <div className="absolute right-10 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#E6007E]/20 blur-[110px] tt-float-slow" />
      <div className="h-1 tt-gradient-bar fixed top-0 inset-x-0 z-[60]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          {/* logo + retour accueil */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-3">
            <TTLogo className="h-12 w-auto" showText={false} animated />
            <span className="leading-none">
              <span className="block text-lg font-black tracking-tight text-white">
                TT <span className="tt-gradient-text">RECRUIT</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[.22em] text-blue-100/70">
                Smart System · AI
              </span>
            </span>
          </Link>

          {/* carte glass */}
          <div className="rounded-[32px] border border-white/20 tt-glass-dark p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,.6)] sm:p-10">
            <div className="mb-8 text-center">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/25 tt-glass-dark
                           px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-white/90"
              >
                Espace Administrateur
              </span>
              <h1 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                Bon retour <span className="tt-gradient-text">RH</span>
              </h1>
              <p className="mt-2 text-sm text-blue-100/70">
                Connectez-vous pour gérer les offres et candidatures.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl border border-[#E6007E]/30 bg-[#E6007E]/10 px-4 py-3 text-sm font-semibold text-[#ff6fb8]">
                <I.alert className="h-4.5 w-4.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="group relative block">
                <I.mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-[#29ABE2]" />
                <input
                  type="email"
                  placeholder="Email professionnel"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-4 pl-12 pr-4 text-sm
                             font-medium text-white placeholder:text-white/40 outline-none transition
                             focus:border-[#29ABE2] focus:bg-white/10 focus:ring-4 focus:ring-[#29ABE2]/15"
                />
              </label>

              <label className="group relative block">
                <I.lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-[#29ABE2]" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-4 pl-12 pr-4 text-sm
                             font-medium text-white placeholder:text-white/40 outline-none transition
                             focus:border-[#29ABE2] focus:bg-white/10 focus:ring-4 focus:ring-[#29ABE2]/15"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden
                           rounded-full bg-white px-8 py-4 text-sm font-black text-[#0B4E9B] shadow-2xl
                           transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 tt-gradient-bar opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative transition-colors group-hover:text-white">
                  {loading ? "Connexion..." : "Se connecter"}
                </span>
                {!loading && (
                  <I.arrow className="relative h-4 w-4 transition-all group-hover:translate-x-1 group-hover:text-white" />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-blue-100/50">
            Vous êtes candidat ?{" "}
            <Link
              to="/login"
              className="font-bold text-white/80 hover:text-white"
            >
              Connexion candidat
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
