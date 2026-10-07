import {
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        padding: "24px 0 30px",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "5px",
          }}
        >
          INTELLIGENT COMMERCE
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          O-BUY
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "7px 11px 7px 7px",
          borderRadius: "999px",
          border:
            "1px solid rgba(255,255,255,0.08)",
          background:
            "rgba(255,255,255,0.035)",
          color: "rgba(255,255,255,0.55)",
          fontSize: "10px",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#72e6c2",
            background:
              "rgba(114,230,194,0.1)",
          }}
        >
          <Sparkles size={12} />
        </div>

        <span>
          AI-powered commerce
        </span>

        <ShieldCheck
          size={13}
          style={{
            color: "#72e6c2",
          }}
        />
      </div>

      <style>{`
        @media (max-width: 600px) {
          header {
            padding-top: 18px !important;
            padding-bottom: 22px !important;
          }

          header > div:last-child span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}