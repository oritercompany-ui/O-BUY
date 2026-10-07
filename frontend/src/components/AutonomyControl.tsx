interface AutonomyControlProps {
  autonomy: string;
  setAutonomy: (value: string) => void;
  budget: number;
}

const autonomyOptions = [
  {
    label: "Recommend",
    description: "Suggestions only",
  },
  {
    label: "Prepare purchase",
    description: "Plan & optimize",
  },
  {
    label: "Purchase",
    description: "Requires approval",
  },
];

export default function AutonomyControl({
  autonomy,
  setAutonomy,
  budget,
}: AutonomyControlProps) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "24px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "#72e6c2",
            marginBottom: "9px",
          }}
        >
          AI AUTONOMY
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            lineHeight: 1.3,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.015em",
          }}
        >
          How much should O-BUY do?
        </h3>

        <p
          style={{
            margin: "7px 0 0",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.42)",
          }}
        >
          You always have the final say before payment.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "9px",
          marginTop: "20px",
        }}
      >
        {autonomyOptions.map((option) => {
          const isActive =
            autonomy === option.label;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() =>
                setAutonomy(option.label)
              }
              aria-pressed={isActive}
              style={{
                minHeight: "76px",
                padding: "13px",
                borderRadius: "13px",
                border: isActive
                  ? "1px solid rgba(114,230,194,0.5)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: isActive
                  ? "rgba(114,230,194,0.08)"
                  : "rgba(255,255,255,0.025)",
                display: "flex",
                alignItems: "flex-start",
                gap: "9px",
                textAlign: "left",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  width: "15px",
                  height: "15px",
                  marginTop: "1px",
                  borderRadius: "50%",
                  border: isActive
                    ? "1px solid #72e6c2"
                    : "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#72e6c2",
                    }}
                  />
                )}
              </span>

              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  minWidth: 0,
                }}
              >
                <strong
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isActive
                      ? "#fff"
                      : "rgba(255,255,255,0.75)",
                  }}
                >
                  {option.label}
                </strong>

                <small
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.35,
                    color:
                      "rgba(255,255,255,0.38)",
                  }}
                >
                  {option.description}
                </small>
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "18px",
          paddingTop: "17px",
          borderTop:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.48)",
            }}
          >
            Spending limit
          </span>

          <strong
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            ${budget.toFixed(2)}
          </strong>
        </div>

        <div
          style={{
            width: "100%",
            height: "5px",
            borderRadius: "999px",
            overflow: "hidden",
            background:
              "rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              background: "#72e6c2",
            }}
          />
        </div>

        <small
          style={{
            display: "block",
            marginTop: "8px",
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          O-BUY cannot exceed this limit.
        </small>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .autonomy-options {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}