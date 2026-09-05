import { useId } from "react";

/** Palette TT dans l'ordre horaire, en partant du haut */
const TT_COLORS = [
  "#29ABE2",
  "#00B5C9",
  "#00A99D",
  "#3AAA35", // haut → droite (cyan/teal/vert)
  "#8DC63F",
  "#FFD100",
  "#FBB03B",
  "#F7941E", // pointe → bas (lime/jaune/orange)
  "#F15A22",
  "#E6007E",
  "#C4198B",
  "#92278F", // bas → gauche (rouge/magenta/violet)
  "#662D91",
  "#2E3192",
  "#1B75BB",
  "#0B4E9B", // gauche → haut (indigo/bleu)
];

export default function TTLogo({
  className = "h-14 w-auto",
  showText = true,
  animated = true,
}) {
  const uid = useId().replace(/:/g, "");
  const cx = 122,
    cy = 102,
    R = 380,
    step = 360 / TT_COLORS.length;

  const wedge = (i) => {
    const a1 = ((i * step - 90) * Math.PI) / 180;
    const a2 = (((i + 1) * step - 90) * Math.PI) / 180;
    return [
      `${cx},${cy}`,
      `${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)}`,
      `${cx + R * Math.cos(a2)},${cy + R * Math.sin(a2)}`,
    ].join(" ");
  };

  // facettes internes (effet low-poly / cristal)
  const facet = (i, r) => {
    const a1 = ((i * step - 90) * Math.PI) / 180;
    const a2 = (((i + 1) * step - 90) * Math.PI) / 180;
    return [
      `${cx},${cy}`,
      `${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}`,
      `${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}`,
    ].join(" ");
  };

  return (
    <svg
      viewBox="0 0 330 200"
      className={className}
      role="img"
      aria-label="Tunisie Telecom"
    >
      <defs>
        {/* La goutte / feuille TT */}
        <clipPath id={`drop-${uid}`}>
          <path
            d="M162 8 C 84 8, 16 48, 16 101 C 16 154, 84 192, 162 192
                   C 234 192, 288 152, 318 101 C 288 50, 234 8, 162 8 Z"
          />
        </clipPath>
        <radialGradient id={`gloss-${uid}`} cx="35%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".38" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#drop-${uid})`}>
        {/* mosaïque de couleurs */}
        <g
          className={animated ? "tt-spin-slow" : ""}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {TT_COLORS.map((c, i) => (
            <polygon key={c + i} points={wedge(i)} fill={c} />
          ))}
          {/* facettes claires/sombres pour le relief */}
          {TT_COLORS.map((_, i) => (
            <polygon
              key={"f" + i}
              points={facet(i, i % 2 ? 132 : 86)}
              fill={i % 3 ? "#fff" : "#000"}
              opacity={i % 3 ? 0.13 : 0.07}
            />
          ))}
        </g>
        <rect
          x="0"
          y="0"
          width="330"
          height="200"
          fill={`url(#gloss-${uid})`}
        />
      </g>
      {/* Les deux T */}
      <g fill="#fff">
        <rect x="58" y="50" width="66" height="24" rx="7" />
        <rect x="80" y="50" width="24" height="82" rx="7" />
        <rect x="136" y="50" width="66" height="24" rx="7" />
        <rect x="158" y="50" width="24" height="82" rx="7" />
      </g>{" "}
      {/* Les deux T */}
      <g fill="#fff">
        <rect x="58" y="50" width="66" height="24" rx="7" />
        <rect x="80" y="50" width="24" height="82" rx="7" />
        <rect x="136" y="50" width="66" height="24" rx="7" />
        <rect x="158" y="50" width="24" height="82" rx="7" />
      </g>
      {/* Baseline "TUNISIE TELECOM" */}
      {showText && (
        <g>
          <text
            x="196"
            y="92"
            fontSize="27"
            fontWeight="800"
            letterSpacing="1"
            fill="#0B4E9B"
            fontFamily="Poppins, Inter, system-ui, sans-serif"
          >
            Tunisie
          </text>
          <text
            x="196"
            y="122"
            fontSize="27"
            fontWeight="800"
            letterSpacing="1"
            fill="#0B4E9B"
            fontFamily="Poppins, Inter, system-ui, sans-serif"
          >
            Telecom
          </text>
        </g>
      )}
    </svg>
  );
}

/* --- Variante compacte (favicon / navbar / footer) --- */
export function TTMark({ className = "h-9 w-auto", animated = false }) {
  return (
    <div className={`relative ${className}`}>
      <TTLogo className="h-full w-auto" showText={false} animated={animated} />
    </div>
  );
}

/* --- Version "sur fond bleu" : le texte passe en blanc --- */
export function TTLogoLight({ className = "h-14 w-auto", animated = true }) {
  return (
    <div className={`${className} [&_text]:fill-white`}>
      <TTLogo className="h-full w-auto" animated={animated} />
    </div>
  );
}
