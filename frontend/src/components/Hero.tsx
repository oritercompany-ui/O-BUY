import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface HeroProps {
  message: string;
  setMessage: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const examplePrompts = [
  {
    label: "Professional desk setup",
    value:
      "Build me a professional desk setup under $500 with a monitor, keyboard, and chair",
  },
  {
    label: "Productivity setup",
    value:
      "I need a productivity setup under $300",
  },
];

export default function Hero({
  message,
  setMessage,
  onSubmit,
  loading,
}: HeroProps) {
  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* EYEBROW */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          marginBottom: "13px",
          color: "#72e6c2",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.16em",
        }}
      >
        <Sparkles size={13} />
        YOUR AI SHOPPING AGENT
      </div>

      {/* TITLE */}
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(32px, 4vw, 48px)",
          lineHeight: 1.04,
          letterSpacing: "-0.045em",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        Tell O-BUY
        <br />
        what you need.
      </h2>

      {/* COMMAND BOX */}
      <div
        style={{
          marginTop: "25px",
          width: "100%",
          padding: "7px",
          borderRadius: "18px",
          border:
            "1px solid rgba(255,255,255,0.1)",
          background:
            "rgba(255,255,255,0.035)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.18)",
          boxSizing: "border-box",
        }}
      >
        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          placeholder="e.g. Build me a professional desk setup under $500..."
          rows={3}
          maxLength={2000}
          disabled={loading}
          style={{
            width: "100%",
            minHeight: "92px",
            resize: "vertical",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#fff",
            padding: "15px 15px 8px",
            fontFamily: "inherit",
            fontSize: "13px",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "6px",
          }}
        >
          <button
            type="button"
            onClick={onSubmit}
            disabled={
              loading ||
              !message.trim()
            }
            style={{
              minHeight: "42px",
              padding: "0 16px",
              border: "none",
              borderRadius: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background:
                loading || !message.trim()
                  ? "rgba(255,255,255,0.08)"
                  : "#fff",
              color:
                loading || !message.trim()
                  ? "rgba(255,255,255,0.35)"
                  : "#08080a",
              fontSize: "11px",
              fontWeight: 700,
              cursor:
                loading || !message.trim()
                  ? "not-allowed"
                  : "pointer",
              transition:
                "all 0.2s ease",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    border:
                      "2px solid rgba(255,255,255,0.2)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation:
                      "hero-spin 0.8s linear infinite",
                  }}
                />
                Planning your purchase...
              </>
            ) : (
              <>
                Plan my purchase
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* EXAMPLES */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "7px",
          marginTop: "12px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
            marginRight: "2px",
          }}
        >
          Try
        </span>

        {examplePrompts.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            onClick={() =>
              setMessage(prompt.value)
            }
            disabled={loading}
            style={{
              padding: "7px 10px",
              borderRadius: "999px",
              border:
                "1px solid rgba(255,255,255,0.07)",
              background:
                "rgba(255,255,255,0.025)",
              color:
                "rgba(255,255,255,0.48)",
              fontSize: "9px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              transition:
                "all 0.2s ease",
            }}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes hero-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        textarea::placeholder {
          color: rgba(255,255,255,0.28);
        }

        textarea:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}