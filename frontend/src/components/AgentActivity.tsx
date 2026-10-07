import {
  Check,
  Circle,
  LoaderCircle,
} from "lucide-react";

interface AgentActivityProps {
  active: boolean;
  complete: boolean;
}

export default function AgentActivity({
  active,
  complete,
}: AgentActivityProps) {
  const steps = [
    "Understanding your request",
    "Finding relevant products",
    "Checking your budget",
    "Optimizing purchase plan",
    "Preparing checkout",
  ];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px",
        padding: "22px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: "rgba(255,255,255,0.42)",
          marginBottom: "18px",
        }}
      >
        O-BUY ACTIVITY
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {steps.map((step, index) => {
          const isComplete =
            complete || (active && index < 3);

          const isActive =
            active &&
            !complete &&
            index === 3;

          return (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
                minHeight: "20px",
                color: isComplete
                  ? "rgba(255,255,255,0.82)"
                  : isActive
                    ? "#ffffff"
                    : "rgba(255,255,255,0.32)",
                fontSize: "12px",
                transition: "all 0.25s ease",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: isComplete
                    ? "#72e6c2"
                    : isActive
                      ? "#ffffff"
                      : "rgba(255,255,255,0.28)",
                  background: isComplete
                    ? "rgba(114,230,194,0.08)"
                    : isActive
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                }}
              >
                {isComplete ? (
                  <Check size={13} />
                ) : isActive ? (
                  <LoaderCircle
                    size={14}
                    style={{
                      animation: "obuy-spin 1s linear infinite",
                    }}
                  />
                ) : (
                  <Circle size={9} />
                )}
              </div>

              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes obuy-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}