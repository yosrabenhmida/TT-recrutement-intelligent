import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import TTLogo from "../../components/TTLogo";

const I = {
  pin: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
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
  info: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M12 12v4" />
    </svg>
  ),
  list: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...p}
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
};

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-6 h-4 w-32 rounded bg-slate-200" />
        <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mx-auto h-5 w-72 rounded bg-slate-200" />
          <div className="mx-auto mt-3 h-4 w-56 rounded bg-slate-200" />
          <div className="mt-8 h-48 w-full rounded-2xl bg-slate-100" />
          <div className="mt-6 h-10 w-40 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function OffreDetail() {
  const { id } = useParams();
  const [offre, setOffre] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setOffre(res.data));
  }, [id]);

  if (!offre) return <Skeleton />;

  const totalPostes =
    offre.repartitionPostes?.reduce((s, r) => s + r.nombre, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="mx-auto max-w-4xl">
        {/* header TT hors zone RTL */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/#jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B4E9B] transition hover:gap-2.5"
          >
            <I.back className="h-4 w-4" />
            Retour aux offres
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <TTLogo className="h-8 w-auto" showText={false} animated />
            <span className="text-sm font-black text-[#062F6E]">
              TT <span className="tt-gradient-text">RECRUIT</span>
            </span>
          </Link>
        </div>

        {/* badge poste */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3AAA35]/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#2f8a2b]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3AAA35]" />
            Poste ouvert
          </span>
          {offre.localisation && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <I.pin className="h-4 w-4 text-[#29ABE2]" />
              {offre.localisation}
            </span>
          )}
        </div>

        {/* carte contenu — RTL préservé */}
        <div
          dir="rtl"
          className="overflow-hidden rounded-[32px] border border-slate-100 bg-white p-8 text-right shadow-[0_30px_80px_-40px_rgba(6,47,110,.35)]"
        >
          {/* barre TT en haut de la carte */}
          <div className="-mx-8 -mt-8 mb-8 h-1.5 tt-gradient-bar" />

          <div className="mb-8 text-center">
            <h1 className="text-xl font-black text-[#062F6E]">
              الشركة الوطنية للاتصالات "اتصالات تونس"
            </h1>
            <h2 className="mt-2 text-lg font-bold text-slate-600">
              عرض شغل عدد {offre.reference}
            </h2>
          </div>

          <p className="mb-6 leading-relaxed text-slate-700">
            تعتزم الشركة الوطنية للاتصالات "اتصالات تونس" انتداب{" "}
            <b className="text-[#0B4E9B]">
              {totalPostes} {offre.titrePoste}
            </b>{" "}
            بصفة متعاقدين كما هو مبين بالجدول التالي:
          </p>

          <div className="mb-8 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0B4E9B] text-white">
                  <th className="p-3 font-bold">فترة التسجيل على موقع الواب</th>
                  <th className="p-3 font-bold">مقر التعيين</th>
                  <th className="p-3 font-bold">عدد الخطط المعروضة</th>
                  <th className="p-3 font-bold">الاختصاص المطلوب</th>
                  <th className="p-3 font-bold">الشهادة المطلوبة</th>
                  <th className="p-3 font-bold">الخطة المعروضة</th>
                </tr>
              </thead>
              <tbody>
                {offre.repartitionPostes?.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-200 even:bg-slate-50/60"
                  >
                    {i === 0 && (
                      <td
                        rowSpan={offre.repartitionPostes.length}
                        className="border-l border-slate-200 p-3 text-center align-middle font-semibold text-[#E6007E]"
                      >
                        من {offre.dateDebutInscription?.slice(0, 10)}
                        <br />
                        إلى
                        <br />
                        {offre.dateFinInscription?.slice(0, 10)}
                      </td>
                    )}
                    <td className="border-l border-slate-200 p-3">{r.lieu}</td>
                    <td className="border-l border-slate-200 p-3 text-center font-bold text-[#0B4E9B]">
                      {r.nombre}
                    </td>
                    {i === 0 && (
                      <>
                        <td
                          rowSpan={offre.repartitionPostes.length}
                          className="border-l border-slate-200 p-3 text-center align-middle"
                        >
                          {offre.specialiteRequise}
                        </td>
                        <td
                          rowSpan={offre.repartitionPostes.length}
                          className="border-l border-slate-200 p-3 text-center align-middle"
                        >
                          {offre.diplomeRequis}
                        </td>
                        <td
                          rowSpan={offre.repartitionPostes.length}
                          className="p-3 text-center align-middle font-semibold"
                        >
                          {offre.titrePoste}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                <tr className="border-t border-slate-200 bg-slate-50 font-bold">
                  <td
                    colSpan={2}
                    className="border-l border-slate-200 p-3 text-center"
                  >
                    المجموع
                  </td>
                  <td className="border-l border-slate-200 p-3 text-center text-[#0B4E9B]">
                    {totalPostes}
                  </td>
                  <td colSpan={3} className="p-3" />
                </tr>
              </tbody>
            </table>
          </div>

          {offre.remarquesImportantes?.length > 0 && (
            <div className="mb-6 rounded-2xl bg-[#FFD100]/10 p-5">
              <h3 className="mb-3 flex items-center justify-end gap-2 font-black text-[#062F6E]">
                ملاحظات هامة
                <I.info className="h-5 w-5 text-[#F7941E]" />
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-sm leading-relaxed text-slate-700">
                {offre.remarquesImportantes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ol>
            </div>
          )}

          {offre.procedureShugh?.length > 0 && (
            <div className="mb-2 rounded-2xl bg-[#29ABE2]/8 p-5">
              <h3 className="mb-3 flex items-center justify-end gap-2 font-black text-[#062F6E]">
                صيغة إجراء عرض الشغل
                <I.list className="h-5 w-5 text-[#29ABE2]" />
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-sm leading-relaxed text-slate-700">
                {offre.procedureShugh.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              to={`/offres/${id}/postuler`}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full
                         bg-[#0B4E9B] px-8 py-4 text-sm font-black text-white shadow-lg
                         shadow-[#0B4E9B]/25 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 tt-gradient-bar opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative">الترشح لهذا العرض</span>
              <I.arrow className="relative h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
