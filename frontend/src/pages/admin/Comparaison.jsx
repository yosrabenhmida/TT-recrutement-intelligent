import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";

/* Petit libellé bilingue : français en priorité, arabe en dessous, plus discret */
function Bilingual({ fr, ar, className = "" }) {
  return (
    <span className={className}>
      <span>{fr}</span>
      <span className="block text-[0.85em] opacity-60" dir="rtl" lang="ar">
        {ar}
      </span>
    </span>
  );
}

export default function Comparaison() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vue, setVue] = useState("cartes"); // "cartes" | "tableau"

  useEffect(() => {
    api.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      api
        .get(`/dashboard/top10/${jobId}`)
        .then((res) => setTop10(res.data))
        .finally(() => setLoading(false));
    } else {
      setTop10([]);
    }
  }, [jobId]);

  const medaille = (i) => ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;
  const couleurRang = (i) =>
    [
      "border-yellow-400 bg-yellow-50",
      "border-slate-300 bg-slate-50",
      "border-orange-300 bg-orange-50",
    ][i] || "border-slate-200 bg-white";

  return (
    <div className="flex" dir="ltr">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-1">
          <Bilingual
            fr="Comparaison des 10 meilleurs candidats"
            ar="مقارنة أفضل 10 مترشحين"
          />
        </h1>
        <p className="text-slate-500 mb-6 text-sm">
          <Bilingual
            fr="Choisissez une offre d'emploi pour afficher le classement des candidats selon le score global."
            ar="اختر عرض شغل لعرض ترتيب المترشحين حسب النتيجة الإجمالية"
          />
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="border rounded-lg px-3 py-2 min-w-[280px]"
          >
            <option value="">
              -- Choisir une offre d'emploi / اختر عرض شغل --
            </option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.titrePoste} {j.reference ? `(Réf ${j.reference})` : ""}
              </option>
            ))}
          </select>

          {jobId && (
            <div className="flex gap-2">
              <button
                onClick={() => setVue("cartes")}
                className={`px-3 py-2 rounded-lg text-sm text-center leading-tight ${
                  vue === "cartes"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                <Bilingual fr="Vue cartes" ar="عرض بطاقات" />
              </button>
              <button
                onClick={() => setVue("tableau")}
                className={`px-3 py-2 rounded-lg text-sm text-center leading-tight ${
                  vue === "tableau"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                <Bilingual fr="Vue tableau" ar="عرض جدول" />
              </button>
            </div>
          )}
        </div>

        {!jobId && (
          <div className="bg-white rounded-xl shadow p-10 text-center text-slate-400">
            <Bilingual
              fr="Veuillez choisir une offre d'emploi dans la liste ci-dessus pour afficher la comparaison."
              ar="الرجاء اختيار عرض شغل من القائمة أعلاه لعرض المقارنة"
            />
          </div>
        )}

        {jobId && loading && (
          <div className="bg-white rounded-xl shadow p-10 text-center text-slate-400">
            <Bilingual fr="Chargement..." ar="جاري التحميل..." />
          </div>
        )}

        {jobId && !loading && top10.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center text-slate-400">
            <Bilingual
              fr="Aucun candidat pour cette offre pour le moment."
              ar="لا يوجد مترشحون لهذا العرض حتى الآن"
            />
          </div>
        )}

        {jobId && !loading && top10.length > 0 && vue === "cartes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {top10.map((a, i) => (
              <div
                key={a._id}
                className={`rounded-xl shadow p-4 text-center border-2 ${couleurRang(i)}`}
              >
                <p className="text-2xl mb-1">{medaille(i)}</p>
                <p className="font-semibold text-sm">
                  {a.candidate?.prenom} {a.candidate?.nom}
                </p>
                <p className="text-slate-500 text-xs mb-2">
                  {a.candidate?.universite || "—"}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {a.scoreGlobal ?? "—"}
                </p>
                <p className="text-xs text-slate-400 mb-2">
                  <Bilingual fr="Score global" ar="النتيجة الإجمالية" />
                </p>
                <div className="text-xs text-slate-500 space-y-1 border-t pt-2 mt-2 text-left">
                  <p>
                    <Bilingual
                      fr="Correspondance CV"
                      ar="مطابقة السيرة الذاتية"
                    />
                    {" : "}
                    <b>{a.matchingScore ?? "—"}</b>
                  </p>
                  <p>
                    <Bilingual
                      fr="Compétences comportementales"
                      ar="المهارات الشخصية"
                    />
                    {" : "}
                    <b>{a.softSkillsScore ?? "—"}</b>
                  </p>
                  <p>
                    <Bilingual fr="Statut" ar="الحالة" />
                    {" : "}
                    <span className="font-medium">{a.statut}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {jobId && !loading && top10.length > 0 && vue === "tableau" && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3">
                    <Bilingual fr="Rang" ar="الترتيب" />
                  </th>
                  <th className="p-3">
                    <Bilingual fr="Candidat" ar="المترشح" />
                  </th>
                  <th className="p-3">
                    <Bilingual fr="Université" ar="الجامعة" />
                  </th>
                  <th className="p-3">
                    <Bilingual fr="Correspondance CV" ar="مطابقة السيرة" />
                  </th>
                  <th className="p-3">
                    <Bilingual
                      fr="Compétences comportementales"
                      ar="المهارات الشخصية"
                    />
                  </th>
                  <th className="p-3">
                    <Bilingual fr="Score global" ar="النتيجة الإجمالية" />
                  </th>
                  <th className="p-3">
                    <Bilingual fr="Statut" ar="الحالة" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {top10.map((a, i) => (
                  <tr key={a._id} className="border-t">
                    <td className="p-3 font-semibold">{medaille(i)}</td>
                    <td className="p-3">
                      {a.candidate?.prenom} {a.candidate?.nom}
                    </td>
                    <td className="p-3 text-slate-500">
                      {a.candidate?.universite || "—"}
                    </td>
                    <td className="p-3">{a.matchingScore ?? "—"}</td>
                    <td className="p-3">{a.softSkillsScore ?? "—"}</td>
                    <td className="p-3 font-bold text-green-600">
                      {a.scoreGlobal ?? "—"}
                    </td>
                    <td className="p-3">{a.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
