import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";

export default function ChatbotReview() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/ai/chatbot/result/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div className="ml-64 p-8">Chargement...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Réponses au chatbot</h1>
        <div className="space-y-4">
          {data.conversation.map((c, i) => {
            const analyse = JSON.parse(c.analyseIA);
            return (
              <div key={i} className="bg-white rounded-xl shadow p-5">
                <p className="font-medium text-slate-700">Q: {c.question}</p>
                <p className="text-slate-600 mt-1">R: {c.reponse}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Score: {analyse.score}/10
                  </span>
                  <p className="text-sm text-slate-500 italic">
                    {analyse.commentaire}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
