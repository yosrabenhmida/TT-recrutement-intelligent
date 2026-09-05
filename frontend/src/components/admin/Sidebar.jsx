import { NavLink, useLocation } from "react-router-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useAuth } from "../../context/AuthContext";

/* ============================================================
   TT RECRUTEMENT SIDEBAR — VERSION ULTRA-ANIMÉE PRO
   ============================================================ */

const links = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: IconGrid,
    tooltip: "Tableau de bord principal",
  },
  {
    to: "/admin/offres",
    label: "Offres d'emploi",
    icon: IconBriefcase,
    tooltip: "Gérer les offres d'emploi",
  },
  {
    to: "/admin/comparaison",
    label: "Comparaison Top 10",
    icon: IconPodium,
    tooltip: "Comparer le Top 10",
  },
  {
    to: "/admin/calendrier",
    label: "Calendrier",
    icon: IconCalendar,
    tooltip: "Calendrier des entretiens",
  },
  {
    to: "/admin/parametres",
    label: "Paramètres IA",
    icon: IconSliders,
    tooltip: "Paramètres de l'IA",
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const itemRefs = useRef([]);
  const navRef = useRef(null);
  const canvasRef = useRef(null);
  const [rail, setRail] = useState({ top: 0, height: 0, ready: false });
  const [particles, setParticles] = useState([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  const activeIndex = links.findIndex((l) =>
    location.pathname.startsWith(l.to),
  );

  /* ---- Rail magique ---- */
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    const nav = navRef.current;
    if (el && nav) {
      const navBox = nav.getBoundingClientRect();
      const elBox = el.getBoundingClientRect();
      setRail({
        top: elBox.top - navBox.top,
        height: elBox.height,
        ready: true,
      });
    }
  }, [activeIndex, location.pathname]);

  /* ---- Système de particules Canvas ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sidebar = canvas.parentElement;

    const resize = () => {
      canvas.width = sidebar.offsetWidth;
      canvas.height = sidebar.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#00C2B8", "#FFCF3D", "#F0157E"];
    const particleArray = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 200 + 100,
    }));

    const handleMouseMove = (e) => {
      const rect = sidebar.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    sidebar.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particleArray.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        // Interaction souris
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        if (
          p.life > p.maxLife ||
          p.x < 0 ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height
        ) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
          p.maxLife = Math.random() * 200 + 100;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Connexions entre particules proches
      for (let i = 0; i < particleArray.length; i++) {
        for (let j = i + 1; j < particleArray.length; j++) {
          const dx = particleArray[i].x - particleArray[j].x;
          const dy = particleArray[i].y - particleArray[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.strokeStyle = "#00C2B8";
            ctx.globalAlpha = 0.08 * (1 - d / 80);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      sidebar.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  /* ---- Ripple au clic ---- */
  const createRipple = useCallback((e, index) => {
    const item = itemRefs.current[index];
    if (!item) return;
    const ripple = document.createElement("span");
    ripple.className = "tt-ripple";
    ripple.style.cssText = `
      position: absolute; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,194,184,0.3), transparent);
      width: 100px; height: 100px; left: 20px; top: 50%; margin-top: -50px;
      transform: scale(0); animation: ttRipple 0.6s ease-out forwards;
      pointer-events: none;
    `;
    item.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return (
    <aside
      className="tt-sidebar"
      style={{
        width: 280,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        padding: "24px 20px",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #03214F 0%, #021736 40%, #010d24 70%, #010a1a 100%)",
        borderRight: "1px solid rgba(0, 194, 184, 0.08)",
        boxShadow:
          "4px 0 30px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(0, 194, 184, 0.03)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Canvas Particules */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Orbes lumineux flottants */}
      <div className="tt-glow-orb orb-1" />
      <div className="tt-glow-orb orb-2" />
      <div className="tt-glow-orb orb-3" />

      {/* Ligne de scan */}
      <div className="tt-scan-line" />

      {/* Réseau télécom SVG animé */}
      <NetworkField />

      {/* Logo */}
      <div
        className="tt-logo-section"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 32,
          padding: "0 4px",
          animation:
            "ttSlideInLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
      >
        <div
          style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}
        >
          <div className="tt-logo-glow" />
          <svg
            viewBox="0 0 100 100"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 2,
              animation: "ttLogoBreathe 3s ease-in-out infinite",
            }}
          >
            <defs>
              <linearGradient
                id="ttLogoGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#00C2B8" />
                <stop offset="50%" stopColor="#FFCF3D" />
                <stop offset="100%" stopColor="#F0157E" />
              </linearGradient>
            </defs>
            <path
              d="M50 5 C25 5 8 25 8 50 C8 72 25 90 45 94 L92 50 L45 6 C46.5 5.3 48 5 50 5 Z"
              fill="url(#ttLogoGrad)"
            />
          </svg>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 900,
              fontSize: 18,
              color: "white",
              letterSpacing: "-0.5px",
              zIndex: 3,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            TT
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p
            className="tt-brand-title"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: "-0.3px",
              background:
                "linear-gradient(90deg, #fff 0%, #a8e6ff 50%, #fff 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "ttShimmerText 4s linear infinite",
            }}
          >
            TT Recrutement
          </p>
          <p
            style={{
              fontSize: 11,
              color: "rgba(100, 200, 255, 0.5)",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Espace administrateur
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Rail magique */}
        {rail.ready && (
          <span
            aria-hidden="true"
            className="tt-magic-rail"
            style={{
              position: "absolute",
              left: 0,
              width: 4,
              borderRadius: "0 4px 4px 0",
              background: "linear-gradient(180deg, #00C2B8, #FFCF3D, #F0157E)",
              boxShadow:
                "0 0 12px rgba(0,194,184,0.6), 0 0 24px rgba(0,194,184,0.3), 0 0 40px rgba(240,21,126,0.2)",
              transform: `translateY(${rail.top}px)`,
              height: `${rail.height}px`,
              transition:
                "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          />
        )}

        {links.map((l, i) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              ref={(el) => (itemRefs.current[i] = el)}
              to={l.to}
              onClick={(e) => createRipple(e, i)}
              className={({ isActive }) =>
                `tt-nav-item ${isActive ? "tt-nav-active" : ""}`
              }
              style={({ isActive }) => ({
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                textDecoration: "none",
                overflow: "hidden",
                border: "1px solid transparent",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                opacity: 0,
                transform: "translateX(-20px)",
                animation: `ttStaggerIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.2 + i * 0.1}s forwards`,
                background: isActive
                  ? "linear-gradient(90deg, rgba(0,194,184,0.18), rgba(0,194,184,0.04))"
                  : "transparent",
                borderColor: isActive
                  ? "rgba(0, 194, 184, 0.25)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 0 20px rgba(0, 194, 184, 0.1), inset 0 0 20px rgba(0, 194, 184, 0.05)"
                  : "none",
              })}
              title={l.tooltip}
            >
              <Icon
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                  color: location.pathname.startsWith(l.to)
                    ? "#00C2B8"
                    : "rgba(150, 200, 255, 0.5)",
                  filter: location.pathname.startsWith(l.to)
                    ? "drop-shadow(0 0 6px rgba(0, 194, 184, 0.5))"
                    : "none",
                }}
              />
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: "0.2px",
                  transition: "all 0.3s ease",
                  color: location.pathname.startsWith(l.to)
                    ? "white"
                    : "rgba(150, 200, 255, 0.55)",
                  textShadow: location.pathname.startsWith(l.to)
                    ? "0 0 12px rgba(0, 194, 184, 0.3)"
                    : "none",
                }}
              >
                {l.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Section Utilisateur */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "auto",
          paddingTop: 20,
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          animation:
            "ttSlideInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards",
          opacity: 0,
        }}
      >
        {/* Carte utilisateur avec bordure animée */}
        <div className="tt-user-card">
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span className="tt-status-dot" />
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(100, 200, 150, 0.7)",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                Connecté
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "rgba(150, 200, 255, 0.6)",
                fontWeight: 500,
                wordBreak: "break-all",
                lineHeight: 1.4,
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <button
          onClick={logout}
          className="tt-logout-btn"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255, 84, 112, 0.3)",
            background:
              "linear-gradient(135deg, rgba(255,84,112,0.12), rgba(255,84,112,0.04))",
            color: "#FFD9DE",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            position: "relative",
            overflow: "hidden",
            letterSpacing: "0.3px",
          }}
        >
          <IconPower style={{ transition: "transform 0.3s ease" }} />
          Déconnexion
        </button>
      </div>

      {/* ===== STYLES GLOBAUX ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;600;700;800;900&display=swap');

        /* ---- Orbes lumineux ---- */
        .tt-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.15;
          animation: ttOrbFloat 8s ease-in-out infinite;
        }
        .tt-glow-orb.orb-1 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #00C2B8, transparent 70%);
          top: 10%; left: -20%;
          animation-delay: 0s;
        }
        .tt-glow-orb.orb-2 {
          width: 150px; height: 150px;
          background: radial-gradient(circle, #F0157E, transparent 70%);
          bottom: 20%; right: -10%;
          animation-delay: -3s;
          animation-duration: 10s;
        }
        .tt-glow-orb.orb-3 {
          width: 120px; height: 120px;
          background: radial-gradient(circle, #FFCF3D, transparent 70%);
          top: 50%; left: 30%;
          animation-delay: -5s;
          animation-duration: 12s;
        }
        @keyframes ttOrbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
          33% { transform: translate(20px, -15px) scale(1.1); opacity: 0.18; }
          66% { transform: translate(-10px, 10px) scale(0.95); opacity: 0.14; }
        }

        /* ---- Ligne de scan ---- */
        .tt-scan-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,194,184,0.4), transparent);
          animation: ttScanLine 6s linear infinite;
          z-index: 5;
          pointer-events: none;
        }
        @keyframes ttScanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ---- Glow du logo ---- */
        .tt-logo-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #00C2B8, #FFCF3D, #F0157E, #00C2B8);
          filter: blur(8px);
          opacity: 0.4;
          animation: ttLogoGlowRotate 4s linear infinite;
        }
        @keyframes ttLogoGlowRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ttLogoBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes ttShimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* ---- Rail magique ---- */
        .tt-magic-rail::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(180deg, #00C2B8, #F0157E);
          border-radius: 0 6px 6px 0;
          filter: blur(6px);
          opacity: 0.5;
          z-index: -1;
        }
        .tt-magic-rail::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 8px; height: 8px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(0,194,184,0.6);
          animation: ttRailPulse 2s ease-in-out infinite;
        }
        @keyframes ttRailPulse {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }

        /* ---- Nav items hover ---- */
        .tt-nav-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,194,184,0.15), rgba(0,194,184,0.02));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }
        .tt-nav-item:hover::before {
          opacity: 1;
        }
        .tt-nav-item:hover {
          border-color: rgba(0, 194, 184, 0.15) !important;
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0, 194, 184, 0.08);
        }
        .tt-nav-item:hover svg {
          color: rgba(200, 230, 255, 0.8) !important;
          transform: scale(1.15) rotate(-5deg);
        }
        .tt-nav-item:hover span {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        /* ---- Ripple ---- */
        @keyframes ttRipple {
          to { transform: scale(4); opacity: 0; }
        }

        /* ---- Carte utilisateur ---- */
        .tt-user-card {
          background: linear-gradient(135deg, rgba(0,194,184,0.08), rgba(240,21,126,0.04));
          border: 1px solid rgba(0, 194, 184, 0.12);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 14px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .tt-user-card::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(0,194,184,0.1), transparent, rgba(240,21,126,0.08), transparent);
          animation: ttCardRotate 8s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .tt-user-card:hover::before {
          opacity: 1;
        }
        .tt-user-card:hover {
          border-color: rgba(0, 194, 184, 0.25);
          box-shadow: 0 4px 24px rgba(0, 194, 184, 0.1);
        }
        @keyframes ttCardRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ---- Status dot ---- */
        .tt-status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #2FE0A8;
          position: relative;
          box-shadow: 0 0 8px rgba(47, 224, 168, 0.6);
        }
        .tt-status-dot::before,
        .tt-status-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(47, 224, 168, 0.4);
          animation: ttStatusRing 2s ease-out infinite;
        }
        .tt-status-dot::after {
          animation-delay: 0.5s;
        }
        @keyframes ttStatusRing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        /* ---- Bouton déconnexion ---- */
        .tt-logout-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }
        .tt-logout-btn:hover::before {
          left: 100%;
        }
        .tt-logout-btn:hover {
          background: linear-gradient(135deg, rgba(255,84,112,0.2), rgba(255,84,112,0.08)) !important;
          border-color: rgba(255, 84, 112, 0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 84, 112, 0.2);
        }
        .tt-logout-btn:hover svg {
          transform: rotate(180deg);
        }
        .tt-logout-btn:active {
          transform: translateY(0) scale(0.97);
        }

        /* ---- Entrées animées ---- */
        @keyframes ttSlideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ttSlideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ttStaggerIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* ---- Reduced motion ---- */
        @media (prefers-reduced-motion: reduce) {
          .tt-glow-orb, .tt-scan-line, .tt-logo-glow, .tt-magic-rail::after,
          .tt-status-dot::before, .tt-status-dot::after, .tt-user-card::before {
            animation: none !important;
          }
        }
      `}</style>
    </aside>
  );
}

/* ============================================================
   RÉSEAU TÉLÉCOM SVG ANIMÉ
   ============================================================ */
function NetworkField() {
  const nodes = [
    { x: 40, y: 100 },
    { x: 180, y: 60 },
    { x: 240, y: 150 },
    { x: 120, y: 220 },
    { x: 50, y: 300 },
    { x: 200, y: 350 },
    { x: 240, y: 450 },
    { x: 80, y: 520 },
    { x: 160, y: 600 },
    { x: 40, y: 680 },
    { x: 220, y: 750 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
  ];

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
      viewBox="0 0 280 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C2B8" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#FFCF3D" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F0157E" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g stroke="url(#netGrad)" strokeWidth="1" fill="none" opacity="0.3">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
          >
            <animate
              attributeName="stroke-opacity"
              values="0.2;0.5;0.2"
              dur={`${3.5 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </g>
      <g fill="#00C2B8">
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={2 + (i % 3) * 0.5}>
            <animate
              attributeName="opacity"
              values="0.4;0.9;0.4"
              dur={`${3 + (i % 4) * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}

/* ============================================================
   ICÔNES
   ============================================================ */
function IconGrid({ style }) {
  return (
    <svg
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconBriefcase({ style }) {
  return (
    <svg
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function IconPodium({ style }) {
  return (
    <svg
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21V11" />
      <path d="M12 21V4" />
      <path d="M20 21V14" />
    </svg>
  );
}

function IconCalendar({ style }) {
  return (
    <svg
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconSliders({ style }) {
  return (
    <svg
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h9" />
      <path d="M17 6h3" />
      <circle cx="14" cy="6" r="2.3" />
      <path d="M4 12h3" />
      <path d="M11 12h9" />
      <circle cx="8" cy="12" r="2.3" />
      <path d="M4 18h11" />
      <path d="M19 18h1" />
      <circle cx="17" cy="18" r="2.3" />
    </svg>
  );
}

function IconPower({ style }) {
  return (
    <svg
      style={style}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v9" />
      <path d="M6.5 6.5a8 8 0 1 0 11 0" />
    </svg>
  );
}
