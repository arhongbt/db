import React from "react";

export default function LogoPreview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: "#F7F9F8" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="300" height="300">
        <g transform="translate(245, 245) scale(1.1)">
          <path
            d="M30,-50 Q65,-30 60,20 Q55,60 20,80 Q-5,90 -25,70 Q-50,45 -45,0 Q-42,-35 -15,-52 Q10,-60 30,-50 Z"
            fill="none"
            stroke="#2C4A6E"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          <path
            d="M-15,-40 C-35,-65 -70,-100 -110,-115 C-90,-90 -60,-62 -35,-45 C-60,-60 -85,-82 -105,-95 C-82,-72 -50,-45 -25,-30 L-10,-25 Z"
            fill="#2C4A6E"
          />
          <path
            d="M0,-35 C-8,-62 -20,-95 -40,-120 C-25,-105 -12,-82 0,-62 C-12,-78 -25,-98 -35,-110 C-18,-90 -2,-65 8,-45 L5,-32 Z"
            fill="#2C4A6E"
          />
          <path
            d="M35,-40 C42,-50 50,-62 52,-72 C54,-82 50,-90 42,-88 C35,-86 33,-76 35,-68"
            fill="none"
            stroke="#2C4A6E"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="46" cy="-80" r="13" fill="#2C4A6E" />
          <path d="M56,-84 L74,-90 L58,-76 Z" fill="#2C4A6E" />
          <path
            d="M-30,60 C-42,75 -58,92 -78,108 C-88,115 -95,118 -100,120"
            fill="none"
            stroke="#2C4A6E"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M-20,70 C-35,85 -55,100 -75,112 C-85,118 -92,120 -100,120"
            fill="none"
            stroke="#2C4A6E"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M-100,120 L-112,128 L-98,114 Z" fill="#2C4A6E" />
        </g>
      </svg>
      <p style={{ fontFamily: "system-ui", color: "#2C4A6E", fontSize: 32, fontWeight: 600, marginTop: 20 }}>
        Sista Resan
      </p>
      <p style={{ fontFamily: "system-ui", color: "#7A9E8E", fontSize: 16, marginTop: 8 }}>
        En trygg hantering av dödsbon
      </p>
    </div>
  );
}
