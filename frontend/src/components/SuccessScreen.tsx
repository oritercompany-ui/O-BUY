import {
  Check,
  CheckCircle2,
  Copy,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SuccessScreenProps {
  orderId?: string;
  total: number;
}

export default function SuccessScreen({
  orderId,
  total,
}: SuccessScreenProps) {
  async function handleCopyOrderId() {
    if (!orderId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(orderId);
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  }

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#070709",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(260px, 40vw, 620px)",
          lineHeight: 1,
          fontWeight: 800,
          color: "rgba(255,255,255,0.012)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        O
      </div>

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          top: "-220px",
          left: "-150px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(114,230,194,0.1), transparent 68%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          bottom: "-250px",
          right: "-150px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(130,100,255,0.08), transparent 68%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <header
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 42px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#72e6c2",
              background:
                "rgba(114,230,194,0.08)",
              border:
                "1px solid rgba(114,230,194,0.15)",
            }}
          >
            <Sparkles size={13} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <strong
              style={{
                fontSize: "13px",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              O-BUY
            </strong>

            <span
              style={{
                fontSize: "7px",
                letterSpacing: "0.16em",
                color:
                  "rgba(255,255,255,0.35)",
              }}
            >
              AI COMMERCE
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#72e6c2",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#72e6c2",
              boxShadow:
                "0 0 10px rgba(114,230,194,0.7)",
            }}
          />
          PAYMENT SECURED
        </div>
      </header>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          width: "100%",
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "35px 32px 60px",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(340px, 430px)",
          alignItems: "center",
          gap: "70px",
          boxSizing: "border-box",
        }}
      >
        {/* MESSAGE */}
        <div
          style={{
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                border:
                  "1px solid rgba(114,230,194,0.16)",
                borderRadius: "50%",
                animation:
                  "success-pulse 2.5s ease-out infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: "10px",
                border:
                  "1px solid rgba(114,230,194,0.1)",
                borderRadius: "50%",
                animation:
                  "success-pulse 2.5s ease-out 0.5s infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(114,230,194,0.18), transparent 70%)",
                filter: "blur(8px)",
              }}
            />

            <div
              style={{
                position: "relative",
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#72e6c2",
                background:
                  "rgba(114,230,194,0.07)",
                border:
                  "1px solid rgba(114,230,194,0.22)",
              }}
            >
              <CheckCircle2
                size={38}
                strokeWidth={1.6}
              />
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#72e6c2",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: "13px",
            }}
          >
            <Check size={11} />
            TRANSACTION CONFIRMED
          </div>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(46px, 6vw, 74px)",
              lineHeight: 0.93,
              letterSpacing: "-0.055em",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Purchase
            <br />
            <em
              style={{
                fontFamily:
                  "Georgia, serif",
                fontWeight: 400,
                color:
                  "rgba(255,255,255,0.7)",
              }}
            >
              complete.
            </em>
          </h1>

          <p
            style={{
              maxWidth: "470px",
              margin: "20px 0 0",
              fontSize: "13px",
              lineHeight: 1.7,
              color:
                "rgba(255,255,255,0.42)",
            }}
          >
            O-BUY has successfully completed
            your AI-powered purchase through
            PayPal.
          </p>

          {/* FLOW */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "30px",
              maxWidth: "470px",
            }}
          >
            {[
              "AI PLAN",
              "BUDGET",
              "PAYPAL",
              "DONE",
            ].map((label, index) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: index < 3 ? 1 : "0 0 auto",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#72e6c2",
                      background:
                        "rgba(114,230,194,0.08)",
                      border:
                        "1px solid rgba(114,230,194,0.18)",
                    }}
                  >
                    <Check size={10} />
                  </span>

                  <small
                    style={{
                      fontSize: "7px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color:
                        "rgba(255,255,255,0.35)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </small>
                </div>

                {index < 3 && (
                  <span
                    style={{
                      height: "1px",
                      flex: 1,
                      marginBottom: "19px",
                      background:
                        "rgba(114,230,194,0.15)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RECEIPT */}
        <div
          style={{
            width: "100%",
            padding: "22px",
            borderRadius: "20px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
            border:
              "1px solid rgba(255,255,255,0.09)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.3)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color:
                    "rgba(255,255,255,0.3)",
                }}
              >
                PAYMENT RECEIPT
              </span>

              <strong
                style={{
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                O-BUY ORDER
              </strong>
            </div>

            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#72e6c2",
                background:
                  "rgba(114,230,194,0.08)",
                border:
                  "1px solid rgba(114,230,194,0.14)",
              }}
            >
              <Check size={14} />
            </div>
          </div>

          <div
            style={{
              height: "1px",
              margin: "20px 0",
              background:
                "rgba(255,255,255,0.07)",
            }}
          />

          {/* TOTAL */}
          <div>
            <span
              style={{
                display: "block",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color:
                  "rgba(255,255,255,0.3)",
                marginBottom: "7px",
              }}
            >
              TOTAL PAID
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "32px",
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: "#fff",
              }}
            >
              ${total.toFixed(2)}
            </strong>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                marginTop: "9px",
                fontSize: "7px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color:
                  "rgba(255,255,255,0.32)",
              }}
            >
              <span>USD</span>
              <i
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background:
                    "rgba(255,255,255,0.2)",
                }}
              />
              <span>PAYPAL</span>
              <i
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background:
                    "rgba(255,255,255,0.2)",
                }}
              />
              <span
                style={{
                  color: "#72e6c2",
                }}
              >
                COMPLETED
              </span>
            </div>
          </div>

          <div
            style={{
              height: "1px",
              margin: "20px 0",
              background:
                "rgba(255,255,255,0.07)",
            }}
          />

          {/* ORDER ID */}
          {orderId && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color:
                      "rgba(255,255,255,0.3)",
                  }}
                >
                  PAYPAL ORDER ID
                </span>

                <strong
                  title={orderId}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                    fontWeight: 500,
                    color:
                      "rgba(255,255,255,0.65)",
                  }}
                >
                  {orderId}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleCopyOrderId}
                aria-label="Copy PayPal order ID"
                title="Copy order ID"
                style={{
                  width: "30px",
                  height: "30px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background:
                    "rgba(255,255,255,0.035)",
                  color:
                    "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
              >
                <Copy size={13} />
              </button>
            </div>
          )}

          {/* PAYMENT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              borderRadius: "11px",
              background:
                "rgba(114,230,194,0.035)",
              border:
                "1px solid rgba(114,230,194,0.08)",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#72e6c2",
                background:
                  "rgba(114,230,194,0.08)",
              }}
            >
              <ShieldCheck size={16} />
            </div>

            <div
              style={{
                minWidth: 0,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <strong
                style={{
                  fontSize: "10px",
                  color: "#fff",
                }}
              >
                Secure payment
              </strong>

              <span
                style={{
                  fontSize: "8px",
                  color:
                    "rgba(255,255,255,0.35)",
                }}
              >
                Processed securely by PayPal Sandbox
              </span>
            </div>

            <LockKeyhole
              size={13}
              style={{
                flexShrink: 0,
                color:
                  "rgba(255,255,255,0.3)",
              }}
            />
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
              paddingTop: "15px",
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
              fontSize: "7px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color:
                "rgba(255,255,255,0.25)",
            }}
          >
            <span>THANK YOU</span>
            <span>O-BUY</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <footer
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 42px",
          borderTop:
            "1px solid rgba(255,255,255,0.05)",
          color:
            "rgba(255,255,255,0.22)",
          fontSize: "7px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          boxSizing: "border-box",
        }}
      >
        <span>
          YOUR PURCHASE WAS SUCCESSFULLY COMPLETED
        </span>

        <div
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          {[1, 2, 3].map((item) => (
            <span
              key={item}
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background:
                  "rgba(114,230,194,0.45)",
              }}
            />
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes success-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.25);
            opacity: 0;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        @media (max-width: 850px) {
          section > div:nth-of-type(3) {
            grid-template-columns: 1fr !important;
            gap: 38px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          section > div:nth-of-type(3) > div:first-child {
            text-align: center !important;
          }

          section > div:nth-of-type(3) > div:first-child > p {
            margin-left: auto !important;
            margin-right: auto !important;
          }

          section > div:nth-of-type(3) > div:first-child > div:last-child {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }

        @media (max-width: 600px) {
          header {
            padding: 18px 20px !important;
          }

          section > div:nth-of-type(3) {
            padding: 20px 18px 35px !important;
            gap: 32px !important;
          }

          section > div:nth-of-type(3) > div:first-child {
            width: 100% !important;
          }

          section > div:nth-of-type(3) > div:first-child h1 {
            font-size: 48px !important;
            line-height: 0.95 !important;
          }

          section > div:nth-of-type(3) > div:first-child > p {
            max-width: 330px !important;
            font-size: 12px !important;
            line-height: 1.6 !important;
          }

          section > div:nth-of-type(3) > div:first-child > div:last-child {
            width: 100% !important;
            max-width: 350px !important;
            gap: 5px !important;
          }

          section > div:nth-of-type(3) > div:last-child {
            width: 100% !important;
            padding: 18px !important;
          }

          footer {
            padding: 14px 20px !important;
          }

          footer > span {
            font-size: 6px !important;
          }
        }

        @media (max-width: 430px) {
          section > div:nth-of-type(3) {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          section > div:nth-of-type(3) > div:first-child h1 {
            font-size: 43px !important;
          }

          section > div:nth-of-type(3) > div:first-child > div:first-child {
            width: 82px !important;
            height: 82px !important;
            margin-bottom: 22px !important;
          }

          section > div:nth-of-type(3) > div:first-child > div:last-child {
            max-width: 330px !important;
          }

          section > div:nth-of-type(3) > div:last-child {
            padding: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}