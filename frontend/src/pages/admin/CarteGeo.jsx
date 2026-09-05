import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../../api/axios";
import Sidebar from "../../components/admin/Sidebar";
import "leaflet/dist/leaflet.css";

export default function CarteGeo() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    api.get("/dashboard/geo").then((res) => setCandidates(res.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-slate-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">
          Répartition géographique des candidats
        </h1>
        <div
          className="bg-white rounded-xl shadow overflow-hidden"
          style={{ height: "600px" }}
        >
          <MapContainer
            center={[36.8, 10.18]}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {candidates.map((c) => (
              <Marker
                key={c._id}
                position={[c.localisation.lat, c.localisation.lng]}
              >
                <Popup>
                  {c.prenom} {c.nom} — {c.localisation.ville}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
