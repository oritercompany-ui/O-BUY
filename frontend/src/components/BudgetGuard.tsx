import {
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

interface BudgetGuardProps {
  budget: number;
  total: number;
  remaining: number;
  optimized?: boolean;
}

export default function BudgetGuard({
  budget,
  total,
  remaining,
  optimized,
}: BudgetGuardProps) {
  const withinBudget = remaining >= 0;

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "22px",
        borderRadius: "20px",
        border: withinBudget
          ? "1px solid rgba(114,230,194,0.18)"
          : "1px solid rgba(255,100,100,0.2)",
        background: withinBudget
          ? "linear-gradient(145deg, rgba(114,230,194,0.055), rgba(255,255,255,0.02))"
          : "linear-gradient(145deg, rgba(255,80,80,0.055), rgba(255,255,255,0.02))",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: withinBudget
                ? "#72e6c2"
                : "#ff7777",
              background: withinBudget
                ? "rgba(114,230,194,0.09)"
                : "rgba(255,100,100,0.09)",
            }}
          >
            {withinBudget ? (
              <ShieldCheck size={17} />
            ) : (
              <AlertTriangle size={17} />
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: withinBudget
                  ? "#72e6c2"
                  : "#ff7777",
                marginBottom: "5px",
              }}
            >
              BUDGET GUARD
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.35,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {withinBudget
                ? "Purchase is within budget"
                : "Budget exceeded"}
            </h3>
          </div>
        </div>

        <span
          style={{
            padding: "6px 9px",
            borderRadius: "999px",
            flexShrink: 0,
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: withinBudget
              ? "#72e6c2"
              : "#ff7777",
            background: withinBudget
              ? "rgba(114,230,194,0.08)"
              : "rgba(255,100,100,0.08)",
            border: withinBudget
              ? "1px solid rgba(114,230,194,0.14)"
              : "1px solid rgba(255,100,100,0.14)",
          }}
        >
          {withinBudget
            ? "PROTECTED"
            : "ACTION NEEDED"}
        </span>
      </div>

      {/* VALUES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            padding: "13px",
            borderRadius: "12px",
            background:
              "rgba(255,255,255,0.025)",
            border:
              "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "9px",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "6px",
            }}
          >
            Budget
          </span>

          <strong
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            ${budget.toFixed(2)}
          </strong>
        </div>

        <div
          style={{
            padding: "13px",
            borderRadius: "12px",
            background:
              "rgba(255,255,255,0.025)",
            border:
              "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "9px",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "6px",
            }}
          >
            Purchase total
          </span>

          <strong
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            ${total.toFixed(2)}
          </strong>
        </div>

        <div
          style={{
            padding: "13px",
            borderRadius: "12px",
            background:
              "rgba(255,255,255,0.025)",
            border:
              "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "9px",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "6px",
            }}
          >
            {withinBudget
              ? "Remaining"
              : "Over budget"}
          </span>

          <strong
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: withinBudget
                ? "#72e6c2"
                : "#ff7777",
            }}
          >
            ${Math.abs(remaining).toFixed(2)}
          </strong>
        </div>
      </div>

      {/* OPTIMIZATION */}
      {optimized && withinBudget && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "9px",
            marginTop: "14px",
            padding: "11px 13px",
            borderRadius: "11px",
            background:
              "rgba(114,230,194,0.055)",
            border:
              "1px solid rgba(114,230,194,0.1)",
            color: "rgba(255,255,255,0.58)",
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              color: "#72e6c2",
              fontWeight: 700,
            }}
          >
            ✓
          </span>

          <span>
            O-BUY optimized your plan to stay
            within your spending limit.
          </span>
        </div>
      )}

      {/* WARNING */}
      {!withinBudget && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginTop: "14px",
            padding: "11px 13px",
            borderRadius: "11px",
            background:
              "rgba(255,100,100,0.055)",
            border:
              "1px solid rgba(255,100,100,0.1)",
            color: "rgba(255,255,255,0.55)",
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          <AlertTriangle
            size={12}
            style={{
              flexShrink: 0,
              marginTop: "2px",
              color: "#ff7777",
            }}
          />

          <span>
            Your current plan exceeds the spending
            limit. O-BUY must optimize it before
            checkout.
          </span>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .budget-values {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}