import {
  ArrowRight,
  Check,
  LockKeyhole,
} from "lucide-react";

interface ApprovalCardProps {
  total: number;
  remaining: number;
  loading: boolean;
  onApprove: () => void;
}

export default function ApprovalCard({
  total,
  remaining,
  loading,
  onApprove,
}: ApprovalCardProps) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "22px",
        padding: "28px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "#72e6c2",
            marginBottom: "10px",
          }}
        >
          READY TO PURCHASE
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "24px",
            lineHeight: 1.2,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Your order is ready.
        </h2>

        <p
          style={{
            margin: "9px 0 0",
            maxWidth: "560px",
            fontSize: "13px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.48)",
          }}
        >
          Review the final purchase details before
          continuing securely with PayPal.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.36)",
              marginBottom: "7px",
            }}
          >
            ORDER TOTAL
          </span>

          <strong
            style={{
              display: "block",
              fontSize: "20px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            ${total.toFixed(2)}
          </strong>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.36)",
              marginBottom: "7px",
            }}
          >
            BUDGET REMAINING
          </span>

          <strong
            style={{
              display: "block",
              fontSize: "20px",
              fontWeight: 600,
              color:
                remaining >= 0
                  ? "#72e6c2"
                  : "#ff7b7b",
            }}
          >
            ${remaining.toFixed(2)}
          </strong>
        </div>
      </div>

      <button
        onClick={onApprove}
        disabled={loading}
        style={{
          width: "100%",
          minHeight: "50px",
          border: "none",
          borderRadius: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "9px",
          padding: "0 18px",
          background: loading
            ? "rgba(255,255,255,0.08)"
            : "#ffffff",
          color: loading
            ? "rgba(255,255,255,0.45)"
            : "#09090b",
          fontSize: "13px",
          fontWeight: 700,
          cursor: loading
            ? "not-allowed"
            : "pointer",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: "15px",
                height: "15px",
                border: "2px solid rgba(255,255,255,0.2)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation:
                  "approval-spin 0.8s linear infinite",
              }}
            />
            Preparing PayPal...
          </>
        ) : (
          <>
            <Check size={15} />
            Approve & Pay with PayPal
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          color: "rgba(255,255,255,0.36)",
          fontSize: "11px",
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        <LockKeyhole
          size={13}
          style={{ flexShrink: 0 }}
        />

        <span>
          You stay in control. Payment only happens
          after your approval.
        </span>
      </div>

      <style>{`
        @keyframes approval-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .approval-summary {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}