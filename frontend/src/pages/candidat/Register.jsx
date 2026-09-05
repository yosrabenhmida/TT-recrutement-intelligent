import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import TTLogo from "../../components/TTLogo";
import { useAuth } from "../../context/AuthContext";

const I = {
  user: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
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
  mailCheck: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
      <path d="m15.5 15.5 2 2 4-4" />
    </svg>
  ),
};

function Field({ icon: Icon, ...props }) {
  return (
    <label className="group relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-[#29ABE2]" />
      <input
        {...props}
        className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-12 pr-4 text-sm
                   font-medium text-white placeholder:text-white/40 outline-none transition
                   focus:border-[#29ABE2] focus:bg-white/10 focus:ring-4 focus:ring-[#29ABE2]/15"
      />
    </label>
  );
}

// Petit composant pour la saisie du code à 4 chiffres, une case par chiffre
function CodeInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, digit) => {
    if (!/^\d?$/.test(digit)) return; // uniquement un chiffre ou vide
    const chars = value.split("");
    chars[index] = digit;
    const newValue = chars.join("").slice(0, 4);
    onChange(newValue);
    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      refs[Math.min(pasted.length, 4) - 1]?.current?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-16 w-14 rounded-2xl border border-white/15 bg-white/5 text-center text-3xl
                     font-black text-white outline-none transition
                     focus:border-[#29ABE2] focus:bg-white/10 focus:ring-4 focus:ring-[#29ABE2]/15"
        />
      ))}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "code"
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      return setError("Les mots de passe ne correspondent pas");
    }
    if (form.password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères");
    }

    setLoading(true);
    try {
      await api.post("/candidate-auth/register", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
      });
      setStep("code"); // on reste sur la page, on passe à l'écran de code
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (code.length !== 4) {
      return setError("Veuillez saisir les 4 chiffres du code");
    }

    setVerifying(true);
    try {
      const { data } = await api.post("/candidate-auth/verify-code", {
        email: form.email,
        code,
      });
      login(data.token, data.candidate);
      navigate("/mon-espace");
      navigate("/mon-espace");
    } catch (err) {
      setError(err.response?.data?.error || "Code invalide");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMsg("");
    try {
      await api.post("/candidate-auth/resend-verification", {
        email: form.email,
      });
      setResendMsg("Un nouveau code a été envoyé.");
    } catch (err) {
      setError(err.response?.data?.error || "Impossible de renvoyer le code");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03214f] font-[Inter,system-ui,sans-serif]">
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

          <div className="rounded-[32px] border border-white/20 tt-glass-dark p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,.6)] sm:p-10">
            {step === "code" ? (
              // --- ÉCRAN DE SAISIE DU CODE ---
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#29ABE2]/15 text-[#29ABE2]">
                  <I.mailCheck className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-black text-white sm:text-3xl">
                  Entrez votre <span className="tt-gradient-text">code</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-blue-100/70">
                  Veuillez accéder à votre email pour récupérer le code de
                  vérification envoyé à{" "}
                  <span className="font-bold text-white">{form.email}</span>.
                </p>

                {error && (
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-[#E6007E]/30 bg-[#E6007E]/10 px-4 py-3 text-sm font-semibold text-[#ff6fb8]">
                    <I.alert className="h-4.5 w-4.5 shrink-0" />
                    {error}
                  </div>
                )}
                {resendMsg && (
                  <div className="mt-5 rounded-2xl border border-[#00A99D]/30 bg-[#00A99D]/10 px-4 py-3 text-sm font-semibold text-[#5fe0d3]">
                    {resendMsg}
                  </div>
                )}

                <form onSubmit={handleVerify} className="mt-6 space-y-6">
                  <CodeInput value={code} onChange={setCode} />

                  <button
                    type="submit"
                    disabled={verifying}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden
                               rounded-full bg-white px-8 py-4 text-sm font-black text-[#0B4E9B] shadow-2xl
                               transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="absolute inset-0 tt-gradient-bar opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="relative transition-colors group-hover:text-white">
                      {verifying ? "Vérification..." : "Vérifier mon compte"}
                    </span>
                    {!verifying && (
                      <I.arrow className="relative h-4 w-4 transition-all group-hover:translate-x-1 group-hover:text-white" />
                    )}
                  </button>
                </form>

                <button
                  onClick={handleResend}
                  className="mt-5 text-xs font-bold text-white/60 underline hover:text-white"
                >
                  Renvoyer le code
                </button>
              </div>
            ) : (
              // --- FORMULAIRE D'INSCRIPTION ---
              <>
                <div className="mb-8 text-center">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 tt-glass-dark
                               px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-white/90"
                  >
                    Espace Candidat
                  </span>
                  <h1 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                    Créez votre <span className="tt-gradient-text">compte</span>
                  </h1>
                  <p className="mt-2 text-sm text-blue-100/70">
                    Suivez toutes vos candidatures depuis un seul endroit.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-center gap-2 rounded-2xl border border-[#E6007E]/30 bg-[#E6007E]/10 px-4 py-3 text-sm font-semibold text-[#ff6fb8]">
                    <I.alert className="h-4.5 w-4.5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      icon={I.user}
                      placeholder="Nom"
                      required
                      value={form.nom}
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                    />
                    <Field
                      icon={I.user}
                      placeholder="Prénom"
                      required
                      value={form.prenom}
                      onChange={(e) =>
                        setForm({ ...form, prenom: e.target.value })
                      }
                    />
                  </div>

                  <Field
                    icon={I.mail}
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />

                  <Field
                    icon={I.lock}
                    type="password"
                    placeholder="Mot de passe (min. 6 caractères)"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <Field
                    icon={I.lock}
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    required
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden
                               rounded-full bg-white px-8 py-4 text-sm font-black text-[#0B4E9B] shadow-2xl
                               transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="absolute inset-0 tt-gradient-bar opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="relative transition-colors group-hover:text-white">
                      {loading ? "Création..." : "Créer mon compte"}
                    </span>
                    {!loading && (
                      <I.arrow className="relative h-4 w-4 transition-all group-hover:translate-x-1 group-hover:text-white" />
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {step === "form" && (
            <p className="mt-6 text-center text-xs text-blue-100/50">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-bold text-white/80 hover:text-white"
              >
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
