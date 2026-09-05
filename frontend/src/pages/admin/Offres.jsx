import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";

const emptyForm = {
  reference: "",
  titrePoste: "",
  diplomeRequis: "",
  specialiteRequise: "",
  dateDebutInscription: "",
  dateFinInscription: "",
  mission: "",
  profilRecherche: "",
  principalesActivites: "",
  competencesTechniques: "",
};

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = création, sinon id de l'offre modifiée
  const [form, setForm] = useState(emptyForm);
  const [repartition, setRepartition] = useState([{ lieu: "", nombre: 0 }]);

  const loadOffres = () => api.get("/jobs").then((res) => setOffres(res.data));
  useEffect(() => {
    loadOffres();
  }, []);

  const addLigne = () =>
    setRepartition([...repartition, { lieu: "", nombre: 0 }]);
  const removeLigne = (i) =>
    setRepartition(repartition.filter((_, idx) => idx !== i));
  const updateLigne = (i, field, value) => {
    const copy = [...repartition];
    copy[i][field] = field === "nombre" ? Number(value) : value;
    setRepartition(copy);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setRepartition([{ lieu: "", nombre: 0 }]);
    setEditingId(null);
    setShowForm(false);
  };

  // Ouvre le formulaire pré-rempli avec les données de l'offre cliquée
  const handleEdit = (o) => {
    setForm({
      reference: o.reference || "",
      titrePoste: o.titrePoste || "",
      diplomeRequis: o.diplomeRequis || "",
      specialiteRequise: o.specialiteRequise || "",
      dateDebutInscription: o.dateDebutInscription?.slice(0, 10) || "",
      dateFinInscription: o.dateFinInscription?.slice(0, 10) || "",
      mission: o.mission || "",
      profilRecherche: o.profilRecherche || "",
      principalesActivites: (o.principalesActivites || []).join("\n"),
      competencesTechniques: (o.competencesTechniques || []).join("\n"),
    });
    setRepartition(
      o.repartitionPostes?.length
        ? o.repartitionPostes
        : [{ lieu: "", nombre: 0 }],
    );
    setEditingId(o._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      repartitionPostes: repartition.filter((r) => r.lieu.trim() !== ""),
      principalesActivites: form.principalesActivites
        .split("\n")
        .filter(Boolean),
      competencesTechniques: form.competencesTechniques
        .split("\n")
        .filter(Boolean),
    };

    if (editingId) {
      await api.put(`/jobs/${editingId}`, payload); // modification
    } else {
      await api.post("/jobs", payload); // création
    }

    resetForm();
    loadOffres();
  };

  const handleDelete = async (id) => {
    if (confirm("حذف هذا العرض ؟")) {
      await api.delete(`/jobs/${id}`);
      loadOffres();
    }
  };

  const totalPostes = repartition.reduce((sum, r) => sum + (r.nombre || 0), 0);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">عروض الشغل</h1>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? "إلغاء" : "+ عرض شغل جديد"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            dir="rtl"
            className="bg-white rounded-xl shadow p-6 mb-6 space-y-4 text-right"
          >
            {editingId && (
              <p className="text-sm text-blue-600 font-semibold">
                وضع التعديل — أنت تقوم بتحديث عرض شغل موجود
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="عدد عرض الشغل (مثال: 2024/03)"
                value={form.reference}
                onChange={(e) =>
                  setForm({ ...form, reference: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-right"
              />
              <input
                placeholder="الخطة المعروضة (مثال: تقني في شبكات الاتصال)"
                value={form.titrePoste}
                onChange={(e) =>
                  setForm({ ...form, titrePoste: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-right"
                required
              />
              <input
                placeholder="الشهادة المطلوبة"
                value={form.diplomeRequis}
                onChange={(e) =>
                  setForm({ ...form, diplomeRequis: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-right"
              />
              <input
                placeholder="الاختصاص المطلوب"
                value={form.specialiteRequise}
                onChange={(e) =>
                  setForm({ ...form, specialiteRequise: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-right"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                توزيع الخطط حسب مقر التعيين
              </label>
              {repartition.map((r, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    placeholder="مقر التعيين (مثال: الإدارة الجهوية بتونس)"
                    value={r.lieu}
                    onChange={(e) => updateLigne(i, "lieu", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-right flex-1"
                  />
                  <input
                    type="number"
                    placeholder="العدد"
                    value={r.nombre}
                    onChange={(e) => updateLigne(i, "nombre", e.target.value)}
                    className="border rounded-lg px-3 py-2 w-24 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => removeLigne(i)}
                    className="bg-red-50 text-red-600 px-3 rounded-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLigne}
                className="text-blue-600 text-sm mt-1"
              >
                + إضافة مقر تعيين
              </button>
              <p className="text-sm text-slate-500 mt-2">
                المجموع: {totalPostes}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500">
                  بداية فترة التسجيل
                </label>
                <input
                  type="date"
                  value={form.dateDebutInscription}
                  onChange={(e) =>
                    setForm({ ...form, dateDebutInscription: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full text-right"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">
                  نهاية فترة التسجيل
                </label>
                <input
                  type="date"
                  value={form.dateFinInscription}
                  onChange={(e) =>
                    setForm({ ...form, dateFinInscription: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full text-right"
                />
              </div>
            </div>

            <div dir="ltr" className="border-t pt-4 mt-4 text-left">
              <h3 className="font-semibold mb-3">
                Fiche de poste détaillée (FR)
              </h3>

              <textarea
                placeholder="Mission"
                value={form.mission}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full mb-3"
                rows={3}
              />

              <input
                placeholder="Profil recherché (ex: BTS Réseaux Télécom ou équivalent)"
                value={form.profilRecherche}
                onChange={(e) =>
                  setForm({ ...form, profilRecherche: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full mb-3"
              />

              <textarea
                placeholder="Principales activités (une par ligne)"
                value={form.principalesActivites}
                onChange={(e) =>
                  setForm({ ...form, principalesActivites: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full mb-3"
                rows={4}
              />

              <textarea
                placeholder="Compétences techniques (une par ligne)"
                value={form.competencesTechniques}
                onChange={(e) =>
                  setForm({ ...form, competencesTechniques: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full"
                rows={3}
              />
            </div>
            <button className="bg-green-600 text-white rounded-lg py-2 w-full">
              {editingId ? "حفظ التعديلات" : "إنشاء عرض الشغل"}
            </button>
          </form>
        )}

        <div className="grid gap-4">
          {offres.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
              dir="rtl"
            >
              <div>
                <h3 className="font-semibold text-lg">{o.titrePoste}</h3>
                <p className="text-sm text-slate-500">
                  عرض شغل عدد {o.reference}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/offres/${o._id}/candidats`}
                  className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm"
                >
                  عرض المترشحين
                </Link>
                <button
                  onClick={() => handleEdit(o)}
                  className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg text-sm"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(o._id)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          {offres.length === 0 && (
            <p className="text-slate-400" dir="rtl">
              لا يوجد عرض شغل حاليا.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
