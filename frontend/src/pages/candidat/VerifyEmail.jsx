import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide");
      return;
    }

    api
      .post("/candidate-auth/verify-email", { token })
      .then(({ data }) => {
        localStorage.setItem("candidateToken", data.token);
        localStorage.setItem("candidateEmail", data.candidate.email);
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.error || "Erreur de vérification");
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03214f] text-white">
      <div className="rounded-3xl border border-white/20 bg-white/5 p-10 text-center">
        {status === "loading" && <p>Vérification en cours...</p>}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-black">Email vérifié ✅</h1>
            <p className="mt-2 text-blue-100/70">{message}</p>
            <Link
              to="/mon-espace"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-bold text-[#0B4E9B]"
            >
              Accéder à mon espace
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-black text-[#ff6fb8]">
              Échec de la vérification
            </h1>
            <p className="mt-2 text-blue-100/70">{message}</p>
            <Link to="/register" className="mt-6 inline-block underline">
              Réessayer
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
