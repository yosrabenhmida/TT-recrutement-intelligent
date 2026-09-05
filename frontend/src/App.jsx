import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./pages/admin/Login";
import VerifyEmail from "./pages/candidat/VerifyEmail";
import Dashboard from "./pages/admin/Dashboard";
import Offres from "./pages/admin/Offres";
import OffreCandidats from "./pages/admin/OffreCandidats";
import CandidatDetail from "./pages/admin/CandidatDetail";
import Calendrier from "./pages/admin/Calendrier";
import ChatbotReview from "./pages/admin/ChatbotReview";
import Comparaison from "./pages/admin/Comparaison";
import CarteGeo from "./pages/admin/CarteGeo";
import Parametres from "./pages/admin/Parametres";
import Accueil from "./pages/candidat/Accueil";
import OffreDetail from "./pages/candidat/OffreDetail";
import Postuler from "./pages/candidat/Postuler";
import MonEspace from "./pages/candidat/MonEspace";
import Chatbot from "./pages/candidat/Chatbot";
import Resultat from "./pages/candidat/Resultat";
import CandidatLogin from "./pages/candidat/Login";
import CandidatRegister from "./pages/candidat/Register";
{
  /* ← ajouté */
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offres"
            element={
              <ProtectedRoute>
                <Offres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/calendrier"
            element={
              <ProtectedRoute>
                <Calendrier />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offres/:id/candidats"
            element={
              <ProtectedRoute>
                <OffreCandidats />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/admin/candidats/:id"
            element={
              <ProtectedRoute>
                <CandidatDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/candidats/:id/chatbot-review"
            element={
              <ProtectedRoute>
                <ChatbotReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/comparaison"
            element={
              <ProtectedRoute>
                <Comparaison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/carte-geo"
            element={
              <ProtectedRoute>
                <CarteGeo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/parametres"
            element={
              <ProtectedRoute>
                <Parametres />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Accueil />} />
          <Route path="/offres/:id" element={<OffreDetail />} />
          <Route path="/offres/:id/postuler" element={<Postuler />} />
          <Route path="/mon-espace" element={<MonEspace />} />
          <Route path="/mon-espace/chatbot/:appId" element={<Chatbot />} />
          <Route path="/mon-espace/resultat/:id" element={<Resultat />} />
          <Route path="/login" element={<CandidatLogin />} />
          <Route path="/register" element={<CandidatRegister />} />{" "}
          {/* ← ajouté */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
