// app/icon.tsx
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#143326",
          borderRadius: "16px",
        }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Montaña sutil al fondo */}
          <path
            d="M6 34L17 15L25 27L30 20L38 34H6Z"
            fill="#24543F"
          />
          {/* Sendero curvo */}
          <path
            d="M13 36C13 29 29 27 29 20C29 15 23 13 23 9"
            stroke="#F4F1EA"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Marcador de destino */}
          <circle cx="23" cy="8.5" r="3.5" fill="#E09F3E" />
        </svg>
      </div>
    ),
    { ...size }
  );
}