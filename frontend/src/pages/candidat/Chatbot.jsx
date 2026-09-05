import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import TTLogo from "../../components/TTLogo";

const I = {
  bot: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  ),
  send: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />
    </svg>
  ),
  user: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  ),
};

const FAQS = [
  {
    q: "Comment postuler à une offre ?",
    a: "Rendez-vous sur la page d'accueil, cliquez sur une offre qui vous intéresse, puis remplissez le formulaire de candidature en 2 minutes.",
  },
  {
    q: "Puis-je postuler à plusieurs offres ?",
    a: "Oui, vous pouvez postuler à autant d'offres que vous souhaitez. Chaque candidature est traitée indépendamment.",
  },
  {
    q: "Comment fonctionne le matching IA ?",
    a: "Notre IA analyse votre CV, extrait vos compétences et expériences, puis calcule un score de compatibilité avec chaque offre disponible.",
  },
  {
    q: "Combien de temps dure le recrutement ?",
    a: "Le délai moyen est de 2 à 4 semaines selon le poste. Vous recevez une notification à chaque étape.",
  },
  {
    q: "Comment suivre ma candidature ?",
    a: "Connectez-vous à votre espace candidat. Votre tableau de bord affiche l'état de chaque candidature en temps réel.",
  },
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour ! Je suis l'assistant virtuel de TT Recruit. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const answer =
        findAnswer(userMsg) ||
        "Je n'ai pas trouvé de réponse précise. Je vous invite à contacter notre équipe RH à recruit@tt.tn ou à consulter la FAQ sur la page d'accueil.";
      setMessages((m) => [...m, { role: "bot", text: answer }]);
      setLoading(false);
    }, 800);
  };

  const findAnswer = (q) => {
    const lower = q.toLowerCase();
    const match = FAQS.find((f) =>
      lower.includes(f.q.toLowerCase().slice(0, 12)),
    );
    return match?.a;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
          <Link
            to="/"
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B4E9B] text-white"
          >
            <TTLogo className="h-5 w-5" showText={false} />
          </Link>
          <div>
            <h1 className="text-sm font-black text-[#062F6E]">
              TT Recruit Assistant
            </h1>
            <p className="text-[10px] font-semibold text-slate-400">
              En ligne · Réponses instantanées
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="space-y-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${msg.role === "bot" ? "bg-[#0B4E9B] text-white" : "bg-slate-200 text-slate-600"}`}
              >
                {msg.role === "bot" ? (
                  <I.bot className="h-4 w-4" />
                ) : (
                  <I.user className="h-4 w-4" />
                )}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "bot" ? "bg-white shadow-sm border border-slate-100 text-slate-700" : "bg-[#0B4E9B] text-white"}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0B4E9B] text-white">
                <I.bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-slate-100">
                <span className="flex gap-1">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-300"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-300"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-300"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {messages.length < 3 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {FAQS.slice(0, 3).map((f, i) => (
              <button
                key={i}
                onClick={() => handleSend(f.q)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#0B4E9B] transition hover:bg-[#0B4E9B] hover:text-white"
              >
                {f.q}
              </button>
            ))}
          </div>
        )}
      </main>
      <div className="fixed bottom-0 inset-x-0 border-t border-slate-200 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mx-auto flex max-w-3xl items-center gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition focus:border-[#29ABE2] focus:bg-white focus:ring-4 focus:ring-[#29ABE2]/15"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0B4E9B] text-white shadow-lg shadow-[#0B4E9B]/25 transition hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <I.send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
