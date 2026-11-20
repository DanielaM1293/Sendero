// app/apple-icon.tsx
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B263B",
          borderRadius: "38px",
        }}
      >
        <svg
          width="116"
          height="116"
          viewBox="0 0 116 116"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* S estilizada tipo sendero */}
          <path
            d="M78 30C78 21 68 16 56 16C41 16 32 24 32 35C32 56 84 52 84 78C84 91 71 100 55 100C40 100 30 93 30 83"
            stroke="#FAF8F5"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Punto guía */}
          <circle cx="78" cy="30" r="7" fill="#E07A5F" />
        </svg>
      </div>
    ),
    { ...size }
  );
}