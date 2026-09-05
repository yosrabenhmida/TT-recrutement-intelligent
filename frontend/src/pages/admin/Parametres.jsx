import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";

export default function Parametres() {
  const [seuil, setSeuil] = useState(70);
  const [ponderationCv, setPonderationCv] = useState(60);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Paramètres de matching IA</h1>
        <div className="bg-white rounded-xl shadow p-6 max-w-md space-y-6">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Seuil de score pour accès au chatbot ({seuil}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={seuil}
              onChange={(e) => setSeuil(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Pondération CV vs Soft Skills ({ponderationCv}% /{" "}
              {100 - ponderationCv}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={ponderationCv}
              onChange={(e) => setPonderationCv(e.target.value)}
              className="w-full"
            />
          </div>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
            Sauvegarder
          </button>
          <p className="text-xs text-slate-400">
            Note: ces paramètres devront être connectés au backend (table de
            config) pour être persistés.
          </p>
        </div>
      </main>
    </div>
  );
}
