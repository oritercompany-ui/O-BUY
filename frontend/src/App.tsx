import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CreditCard,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Sparkles,
  Wallet,
  Menu,
  X,
} from "lucide-react";

import AgentActivity from "./components/AgentActivity";
import AutonomyControl from "./components/AutonomyControl";
import PurchasePlan from "./components/PurchasePlan";
import BudgetGuard from "./components/BudgetGuard";
import ApprovalCard from "./components/ApprovalCard";
import SuccessScreen from "./components/SuccessScreen";
import robotImage from "./assets/robot.png";

import {
  createAgentPlan,
  prepareCheckout,
  createPayPalOrder,
  capturePayPalOrder,
  API_BASE_URL,
} from "./services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  reason?: string;
}

interface AgentPlan {
  intent: string;
  budget: number | null;
  products: Product[];
  total: number;
  withinBudget: boolean;
  summary: string;
}

interface BudgetCheck {
  valid: boolean;
  withinBudget: boolean;
  budget: number;
  total: number;
  remaining: number;
  message: string;
}

interface Optimization {
  success: boolean;
  optimized: boolean;
  withinBudget: boolean;
  budget: number;
  total: number;
  remaining: number;
  products: Product[];
}

interface Checkout {
  status: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  budget: number;
  remaining: number;
  currency: string;
  approved: boolean;
}

export default function App() {
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [message, setMessage] = useState(
    "Build me a professional desk setup under $500 with a monitor and keyboard"
  );

  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [plan, setPlan] = useState<AgentPlan | null>(null);

  const [budgetCheck, setBudgetCheck] =
    useState<BudgetCheck | null>(null);

  const [optimization, setOptimization] =
    useState<Optimization | null>(null);

  const [checkout, setCheckout] =
    useState<Checkout | null>(null);

  const [autonomy, setAutonomy] =
    useState("Prepare purchase");

  const [error, setError] = useState("");

  const [paymentComplete, setPaymentComplete] =
    useState(false);

  const [paidOrderId, setPaidOrderId] =
    useState("");

  const [paidTotal, setPaidTotal] =
    useState(0);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /* =========================
     SCROLL TO RESULTS
  ========================= */

  useEffect(() => {
    if (!loading && plan) {
      const timeout = window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [loading, plan]);

  /* =========================
     PAYPAL RETURN
  ========================= */

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const paypalStatus = params.get("paypal");
    const orderId = params.get("token");

    if (paypalStatus === "cancel") {
      setError(
        "PayPal payment was cancelled. Your purchase has not been completed."
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      return;
    }

    if (paypalStatus !== "success" || !orderId) {
      return;
    }

    async function capturePayment() {
      if (!orderId) {
        return;
      }

      try {
        setCheckoutLoading(true);
        setError("");

        const data = await capturePayPalOrder(orderId);

        const capturedTotal = Number(
          data.capture
            ?.purchase_units?.[0]
            ?.payments?.captures?.[0]
            ?.amount?.value ||
            data.capture
              ?.purchase_units?.[0]
              ?.amount?.value ||
            data.total ||
            0
        );

        setPaidOrderId(data.orderId || orderId);

        setPaidTotal(
          Number.isFinite(capturedTotal)
            ? capturedTotal
            : 0
        );

        setPaymentComplete(true);

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to complete PayPal payment."
        );
      } finally {
        setCheckoutLoading(false);
      }
    }

    void capturePayment();
  }, []);

  /* =========================
     CREATE AI PLAN
  ========================= */

  async function handlePlan() {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      setError(
        "Tell O-BUY what you want to purchase."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      setPlan(null);
      setBudgetCheck(null);
      setOptimization(null);
      setCheckout(null);

      setPaymentComplete(false);
      setPaidOrderId("");
      setPaidTotal(0);

      const data =
        await createAgentPlan(cleanMessage);

      setPlan(data.plan);
      setBudgetCheck(data.budgetCheck);
      setOptimization(data.optimization);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your shopping plan."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     PREPARE CHECKOUT
  ========================= */

  async function handlePrepareCheckout() {
    if (!plan || !budgetCheck) {
      return;
    }

    try {
      setCheckoutLoading(true);
      setError("");

      const products =
        optimization?.withinBudget &&
        optimization.products.length > 0
          ? optimization.products
          : plan.products;

      if (
        !Array.isArray(products) ||
        products.length === 0
      ) {
        throw new Error(
          "No products are available for checkout."
        );
      }

      const data =
        await prepareCheckout({
          budget: budgetCheck.budget,
          products,
        });

      setCheckout(data.checkout);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to prepare checkout."
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  /* =========================
     PAYPAL
  ========================= */

  async function handlePayPal() {
    if (!checkout) {
      setError("Your checkout is not ready.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setError("");

      const data =
        await createPayPalOrder({
          ...checkout,
          approved: true,
        });

      if (!data?.orderId) {
        throw new Error(
          "PayPal did not return an order ID."
        );
      }

      window.location.href =
        `${API_BASE_URL}/api/paypal/approve/${encodeURIComponent(
          data.orderId
        )}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start PayPal payment."
      );

      setCheckoutLoading(false);
    }
  }

  /* =========================
     SELECTED PLAN
  ========================= */

  const selectedProducts =
    optimization?.withinBudget &&
    optimization.products.length > 0
      ? optimization.products
      : plan?.products || [];

  const selectedTotal =
    optimization?.withinBudget
      ? optimization.total
      : plan?.total || 0;

  /* =========================
     SUCCESS
  ========================= */

  if (paymentComplete) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07090d",
          color: "#f5f7fa",
          fontFamily:
            "Inter, DM Sans, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: 1540,
            margin: "0 auto",
            padding: "38px 58px 90px",
            boxSizing: "border-box",
          }}
        >
          <SuccessScreen
            orderId={paidOrderId}
            total={paidTotal}
          />
        </main>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #07090d;
        }

        button,
        textarea {
          font: inherit;
        }

        .obuy-sidebar-nav button,
        .obuy-command-example,
        .obuy-review-button,
        .obuy-sidebar-menu {
          -webkit-tap-highlight-color: transparent;
        }

        .obuy-sidebar-nav button:hover {
          background: rgba(255,255,255,0.055) !important;
          color: #ffffff !important;
          border-color: rgba(255,255,255,0.08) !important;
        }

        .obuy-command-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(0, 211, 190, 0.18);
        }

        .obuy-command-example:hover:not(:disabled) {
          background: rgba(255,255,255,0.055) !important;
          border-color: rgba(255,255,255,0.12) !important;
          color: #ffffff !important;
        }

        .obuy-review-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(0, 211, 190, 0.15);
        }

        .obuy-recent-item:hover {
          background: rgba(255,255,255,0.025);
          border-color: rgba(255,255,255,0.09) !important;
        }

        .obuy-command-box textarea:focus {
          outline: none;
          border-color: rgba(0, 211, 190, 0.38) !important;
          box-shadow: 0 0 0 3px rgba(0, 211, 190, 0.055);
        }

        .obuy-sidebar-menu {
          display: none;
        }

        @media (max-width: 1200px) {
          .obuy-dashboard-main {
            padding-left: 34px !important;
            padding-right: 34px !important;
          }

          .obuy-command-layout {
            grid-template-columns: minmax(0, 1fr) 300px !important;
          }

          .obuy-command-title-row h2 {
            font-size: 42px !important;
          }

          .obuy-result-layout {
            grid-template-columns: minmax(0, 1fr) 280px !important;
          }
        }

        @media (max-width: 980px) {
          .obuy-sidebar {
            width: 220px !important;
          }

          .obuy-dashboard-main {
            margin-left: 220px !important;
            width: calc(100% - 220px) !important;
            padding-left: 28px !important;
            padding-right: 28px !important;
          }

          .obuy-command-layout {
            grid-template-columns: 1fr !important;
          }

          .obuy-command-agent {
            width: 100%;
          }

          .obuy-result-layout {
            grid-template-columns: 1fr !important;
          }

          .obuy-result-agent {
            order: 2;
          }

          .obuy-stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 760px) {
          .obuy-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            width: 260px !important;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.22s ease;
            box-shadow: 20px 0 50px rgba(0,0,0,0.35);
          }

          .obuy-sidebar.open {
            transform: translateX(0);
          }

          .obuy-sidebar-menu {
            display: flex !important;
            position: absolute;
            top: 18px;
            right: -48px;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.08);
            background: #10141b;
            color: #ffffff;
            cursor: pointer;
          }

          .obuy-dashboard-main {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 24px 18px 70px !important;
          }

          .obuy-profile-chip span {
            display: none;
          }

          .obuy-command-layout {
            gap: 20px !important;
          }

          .obuy-command-title-row {
            align-items: flex-end !important;
          }

          .obuy-command-title-row h2 {
            font-size: 34px !important;
            line-height: 1.04 !important;
          }

          .obuy-shopping-agent {
            width: 105px !important;
            height: 105px !important;
          }

          .obuy-shopping-agent img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain;
          }

          .obuy-stats-grid {
            grid-template-columns: 1fr !important;
          }

          .obuy-result-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .obuy-recent-item {
            grid-template-columns: auto minmax(0,1fr) auto !important;
          }

          .obuy-recent-item > .obuy-completed-pill {
            grid-column: 2 / -1;
            justify-self: start;
          }
        }

        @media (max-width: 520px) {
          .obuy-command-title-row h2 {
            font-size: 29px !important;
          }

          .obuy-shopping-agent {
            width: 82px !important;
            height: 82px !important;
          }

          .obuy-command-box {
            padding: 12px !important;
          }

          .obuy-command-button {
            width: fit-content !important;
            min-width: 0 !important;
            padding: 0 10px !important;
            justify-content: center !important;
          }

          .obuy-command-examples {
            flex-wrap: wrap !important;
          }

          .obuy-section-top {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }

          .obuy-recent-item {
            grid-template-columns: auto minmax(0,1fr) !important;
            gap: 12px !important;
          }

          .obuy-recent-price {
            grid-column: 2;
          }

          .obuy-recent-item > .obuy-completed-pill {
            grid-column: 2;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background:
            "radial-gradient(circle at 55% -10%, rgba(0,211,190,0.055), transparent 30%), #07090d",
          color: "#f5f7fa",
          fontFamily:
            "Inter, DM Sans, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* =========================
            SIDEBAR
        ========================= */}

        <aside
          className={`obuy-sidebar ${
            sidebarOpen ? "open" : ""
          }`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: 245,
            background: "#0b0e13",
            borderRight:
              "1px solid rgba(255,255,255,0.065)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "4px 8px 30px",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, rgba(0,211,190,0.18), rgba(109,93,255,0.16))",
                border:
                  "1px solid rgba(0,211,190,0.18)",
                color: "#55e6d5",
              }}
            >
              <Sparkles size={16} />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.05,
              }}
            >
              <strong
                style={{
                  fontSize: 15,
                  letterSpacing: "0.12em",
                  color: "#ffffff",
                }}
              >
                O-BUY
              </strong>

              <span
                style={{
                  marginTop: 5,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "#69727f",
                }}
              >
                AI COMMERCE
              </span>
            </div>
          </div>

          <button
            type="button"
            className="obuy-sidebar-menu"
            onClick={() =>
              setSidebarOpen((current) => !current)
            }
            aria-label={
              sidebarOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>

          <nav
            className="obuy-sidebar-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {[
              {
                label: "Dashboard",
                icon: <LayoutDashboard size={17} />,
                active: true,
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 12px",
                  borderRadius: 9,
                  border: item.active
                    ? "1px solid rgba(0,211,190,0.14)"
                    : "1px solid transparent",
                  background: item.active
                    ? "rgba(0,211,190,0.075)"
                    : "transparent",
                  color: item.active
                    ? "#ffffff"
                    : "#7e8794",
                  cursor: "pointer",
                  textAlign: "left",
                  transition:
                    "background 0.18s ease, color 0.18s ease",
                }}
              >
                {item.icon}

                <span
                  style={{
                    fontSize: 13,
                    fontWeight: item.active ? 650 : 500,
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div
            style={{
              marginTop: "auto",
              paddingTop: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 11px",
                borderRadius: 10,
                background:
                  "rgba(255,255,255,0.025)",
                border:
                  "1px solid rgba(255,255,255,0.055)",
              }}
            >
              <ShieldCheck
                size={17}
                color="#55e6d5"
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <strong
                  style={{
                    fontSize: 11,
                    color: "#dce1e7",
                  }}
                >
                  Protected
                </strong>

                <span
                  style={{
                    fontSize: 10,
                    color: "#68717d",
                  }}
                >
                  PayPal Sandbox
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* =========================
            MAIN
        ========================= */}

        <main
          className="obuy-dashboard-main"
          style={{
            width: "calc(100% - 245px)",
            maxWidth: 1540,
            marginLeft: 245,
            padding: "30px 58px 90px",
            marginRight: "auto",
          }}
        >
          {/* =========================
              HEADER
          ========================= */}

          <header
            style={{
              minHeight: 48,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 34,
            }}
          >
            <div
              className="obuy-profile-chip"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#aeb6c2",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #151a22, #0e1218)",
                  border:
                    "1px solid rgba(255,255,255,0.09)",
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                O
              </div>

              <span>O-BUY User</span>
            </div>
          </header>

          {/* =========================
              COMMAND CENTER
          ========================= */}

          <section
            className="obuy-command-layout"
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 340px",
              gap: 32,
              alignItems: "start",
              marginBottom: 38,
            }}
          >
            {/* LEFT */}

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  marginBottom: 25,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 14,
                    color: "#55e6d5",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                  }}
                >
                  <Bot size={15} />
                  YOUR AI SHOPPING AGENT
                </div>

                <div
                  className="obuy-command-title-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 48,
                      lineHeight: 1.01,
                      letterSpacing: "-0.045em",
                      fontWeight: 650,
                      color: "#f7f8fa",
                    }}
                  >
                    What are you
                    <br />
                    shopping for today?
                  </h2>

                  <div
                    className="obuy-shopping-agent"
                    style={{
                      width: 150,
                      height: 150,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.96,
                    }}
                  >
                    <img
                      src={robotImage}
                      alt="AI shopping agent"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter:
                          "drop-shadow(0 16px 30px rgba(0,211,190,0.10))",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="obuy-command-box"
                style={{
                  position: "relative",
                  padding: 14,
                  borderRadius: 15,
                  background:
                    "linear-gradient(145deg, rgba(18,23,30,0.96), rgba(11,14,19,0.96))",
                  border:
                    "1px solid rgba(255,255,255,0.075)",
                  boxShadow:
                    "0 20px 50px rgba(0,0,0,0.16)",
                }}
              >
                <textarea
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Tell O-BUY what you need..."
                  rows={2}
                  maxLength={2000}
                  disabled={loading}
                  style={{
                    width: "100%",
                    minHeight: 72,
                    resize: "vertical",
                    padding: "12px 12px 76px",
                    borderRadius: 10,
                    border:
                      "1px solid rgba(255,255,255,0.055)",
                    background:
                      "rgba(255,255,255,0.018)",
                    color: "#edf1f5",
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                />

                <button
                  type="button"
                  className="obuy-command-button"
                  onClick={handlePlan}
                  disabled={
                    loading || !message.trim()
                  }
                  style={{
                    position: "absolute",
                    right: 25,
                    bottom: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minWidth: 125,
                    height: 40,
                    padding: "0 15px",
                    borderRadius: 9,
                    border: "1px solid rgba(0,211,190,0.22)",
                    background:
                      loading || !message.trim()
                        ? "rgba(0,211,190,0.08)"
                        : "#00bfae",
                    color:
                      loading || !message.trim()
                        ? "#71817f"
                        : "#06100f",
                    fontSize: 12,
                    fontWeight: 750,
                    cursor:
                      loading || !message.trim()
                        ? "not-allowed"
                        : "pointer",
                    transition:
                      "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                >
                  {loading
                    ? "Thinking..."
                    : "Ask O-BUY"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}
                </button>

                {error && (
                  <div
                    style={{
                      position: "absolute",
                      left: 27,
                      bottom: 28,
                      maxWidth: "calc(100% - 170px)",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      color: "#ff8f8f",
                      fontSize: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: "#ff6b6b",
                      }}
                    />

                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div
                className="obuy-command-examples"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 13,
                }}
              >
                <span
                  style={{
                    marginRight: 3,
                    color: "#555e6a",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  Quick start
                </span>

                {[
                  [
                    "Desk setup",
                    "Build me a professional desk setup under $500 with a monitor and keyboard",
                  ],
                  [
                    "Productivity",
                    "Build me a productivity setup under $300",
                  ],
                  [
                    "Home office",
                    "I need a home office setup under $700",
                  ],
                ].map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    className="obuy-command-example"
                    disabled={loading}
                    onClick={() => {
                      setMessage(value);
                      setError("");
                    }}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 7,
                      border:
                        "1px solid rgba(255,255,255,0.055)",
                      background:
                        "rgba(255,255,255,0.018)",
                      color: "#78818e",
                      fontSize: 10,
                      cursor: loading
                        ? "not-allowed"
                        : "pointer",
                      transition:
                        "background 0.18s ease, border 0.18s ease, color 0.18s ease",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT — AGENT ACTIVITY */}

            <div
              style={{
                minWidth: 0,
              }}
            >
              <AgentActivity
                active={loading}
                complete={Boolean(plan)}
              />
            </div>
          </section>

          {/* =========================
              STATS
          ========================= */}

          <section
            className="obuy-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 14,
              marginBottom: 32,
            }}
          >
            {[
              {
                icon: <Sparkles size={17} />,
                label: "AI PLANS",
                value: plan ? "13" : "12",
                small: "shopping plans created",
              },
              {
                icon: <Package size={17} />,
                label: "ORDERS",
                value: "8",
                small: "completed purchases",
              },
              {
                icon: <Wallet size={17} />,
                label: "TOTAL SPENDING",
                value: "$1,284",
                small: "through PayPal",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  minHeight: 130,
                  padding: 18,
                  borderRadius: 13,
                  background:
                    "rgba(14,18,24,0.82)",
                  border:
                    "1px solid rgba(255,255,255,0.055)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    marginBottom: 15,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgba(0,211,190,0.075)",
                    border:
                      "1px solid rgba(0,211,190,0.10)",
                    color: "#55e6d5",
                  }}
                >
                  {stat.icon}
                </div>

                <span
                  style={{
                    display: "block",
                    marginBottom: 6,
                    color: "#69727f",
                    fontSize: 9,
                    fontWeight: 750,
                    letterSpacing: "0.13em",
                  }}
                >
                  {stat.label}
                </span>

                <strong
                  style={{
                    display: "block",
                    marginBottom: 4,
                    color: "#f4f6f8",
                    fontSize: 22,
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {stat.value}
                </strong>

                <small
                  style={{
                    color: "#555e69",
                    fontSize: 10,
                  }}
                >
                  {stat.small}
                </small>
              </div>
            ))}
          </section>

          {/* =========================
              AI WORKING
          ========================= */}

          {loading && (
            <section
              style={{
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  padding: 20,
                  borderRadius: 14,
                  background:
                    "rgba(14,18,24,0.82)",
                  border:
                    "1px solid rgba(255,255,255,0.055)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <div
                      style={{
                        marginBottom: 6,
                        color: "#55e6d5",
                        fontSize: 9,
                        fontWeight: 750,
                        letterSpacing: "0.14em",
                      }}
                    >
                      AI DECISION
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        color: "#f2f5f7",
                        fontSize: 18,
                        fontWeight: 650,
                      }}
                    >
                      O-BUY is working
                    </h3>
                  </div>

                  <Sparkles
                    size={18}
                    color="#55e6d5"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    padding: 16,
                    borderRadius: 10,
                    background:
                      "rgba(255,255,255,0.018)",
                    border:
                      "1px solid rgba(255,255,255,0.045)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      flexShrink: 0,
                    }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#55e6d5",
                          opacity: 0.75,
                          animation:
                            `obuy-thinking-dot 1.2s ease-in-out ${
                              dot * 0.15
                            }s infinite`,
                        }}
                      />
                    ))}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#7c8692",
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    Finding products and
                    optimizing your purchase
                    within your budget.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =========================
              RESULTS
          ========================= */}

          {plan && (
            <div
              ref={resultsRef}
              style={{
                marginBottom: 38,
              }}
            >
              <section
                className="obuy-result-header"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 25,
                  marginBottom: 20,
                  paddingBottom: 20,
                  borderBottom:
                    "1px solid rgba(255,255,255,0.055)",
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      marginBottom: 7,
                      color: "#55e6d5",
                      fontSize: 9,
                      fontWeight: 750,
                      letterSpacing: "0.14em",
                    }}
                  >
                    AI SHOPPING PLAN
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#f4f6f8",
                      fontSize: 28,
                      lineHeight: 1.12,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {plan.intent}
                  </h2>

                  <p
                    style={{
                      maxWidth: 680,
                      margin:
                        "9px 0 0",
                      color: "#737d89",
                      fontSize: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    {plan.summary}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                    padding: "7px 10px",
                    borderRadius: 7,
                    background:
                      "rgba(0,211,190,0.07)",
                    border:
                      "1px solid rgba(0,211,190,0.12)",
                    color: "#55e6d5",
                    fontSize: 9,
                    fontWeight: 750,
                    letterSpacing: "0.08em",
                  }}
                >
                  <Check size={15} />
                  PLAN READY
                </div>
              </section>

              <section
                className="obuy-result-layout"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 1fr) 320px",
                  gap: 22,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {budgetCheck && (
                    <BudgetGuard
                      budget={
                        budgetCheck.budget
                      }
                      total={selectedTotal}
                      remaining={
                        optimization?.withinBudget
                          ? optimization.remaining
                          : budgetCheck.remaining
                      }
                      optimized={Boolean(
                        optimization?.optimized
                      )}
                    />
                  )}

                  <PurchasePlan
                    products={
                      selectedProducts
                    }
                    total={selectedTotal}
                  />

                  <AutonomyControl
                    autonomy={autonomy}
                    setAutonomy={setAutonomy}
                    budget={
                      budgetCheck?.budget || 0
                    }
                  />

                  {!checkout && (
                    <button
                      type="button"
                      className="obuy-review-button"
                      onClick={
                        handlePrepareCheckout
                      }
                      disabled={
                        checkoutLoading ||
                        selectedProducts.length ===
                          0
                      }
                      style={{
                        width: "100%",
                        minHeight: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        borderRadius: 10,
                        border:
                          "1px solid rgba(0,211,190,0.18)",
                        background:
                          checkoutLoading ||
                          selectedProducts.length === 0
                            ? "rgba(0,211,190,0.055)"
                            : "#00bfae",
                        color:
                          checkoutLoading ||
                          selectedProducts.length === 0
                            ? "#62706e"
                            : "#06100f",
                        fontSize: 12,
                        fontWeight: 750,
                        cursor:
                          checkoutLoading ||
                          selectedProducts.length === 0
                            ? "not-allowed"
                            : "pointer",
                        transition:
                          "transform 0.18s ease, box-shadow 0.18s ease",
                      }}
                    >
                      {checkoutLoading
                        ? "Preparing purchase..."
                        : "Review purchase"}

                      {!checkoutLoading && (
                        <ArrowRight size={17} />
                      )}
                    </button>
                  )}

                  {checkout && (
                    <ApprovalCard
                      total={
                        checkout.subtotal
                      }
                      remaining={
                        checkout.remaining
                      }
                      loading={
                        checkoutLoading
                      }
                      onApprove={
                        handlePayPal
                      }
                    />
                  )}
                </div>

                {/* RESULT AI AGENT */}

                <aside
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      padding: 18,
                      borderRadius: 14,
                      background:
                        "rgba(14,18,24,0.82)",
                      border:
                        "1px solid rgba(255,255,255,0.055)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            marginBottom: 6,
                            color: "#55e6d5",
                            fontSize: 9,
                            fontWeight: 750,
                            letterSpacing: "0.14em",
                          }}
                        >
                          AI AGENT
                        </div>

                        <h3
                          style={{
                            margin: 0,
                            color: "#f2f5f7",
                            fontSize: 16,
                            fontWeight: 650,
                          }}
                        >
                          Decision activity
                        </h3>
                      </div>

                      <Bot
                        size={20}
                        color="#55e6d5"
                      />
                    </div>

                    <AgentActivity
                      active={false}
                      complete={true}
                    />
                  </div>
                </aside>
              </section>
            </div>
          )}

          {/* =========================
              RECENT ACTIVITY
          ========================= */}

          {!plan && !loading && (
            <section>
              <div
                className="obuy-section-top"
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 20,
                  marginBottom: 15,
                }}
              >
                <div>
                  <div
                    style={{
                      marginBottom: 7,
                      color: "#55e6d5",
                      fontSize: 9,
                      fontWeight: 750,
                      letterSpacing: "0.14em",
                    }}
                  >
                    RECENT ACTIVITY
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#f1f4f6",
                      fontSize: 22,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Purchase plans
                  </h2>
                </div>

                <span
                  style={{
                    color: "#606a76",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  View all
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  {
                    icon: (
                      <Package size={17} />
                    ),
                    name: "Professional Desk Setup",
                    detail:
                      "4 products · PayPal",
                    price: "$438.00",
                  },
                  {
                    icon: (
                      <CreditCard size={17} />
                    ),
                    name: "Home Office Setup",
                    detail:
                      "3 products · PayPal",
                    price: "$289.00",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="obuy-recent-item"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "36px minmax(0,1fr) auto auto",
                      alignItems: "center",
                      gap: 14,
                      padding: "13px 15px",
                      borderRadius: 10,
                      background:
                        "rgba(14,18,24,0.62)",
                      border:
                        "1px solid rgba(255,255,255,0.045)",
                      transition:
                        "background 0.18s ease, border 0.18s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 9,
                        background:
                          "rgba(255,255,255,0.025)",
                        color: "#7b8591",
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <strong
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#dfe4e9",
                          fontSize: 12,
                        }}
                      >
                        {item.name}
                      </strong>

                      <span
                        style={{
                          color: "#5d6773",
                          fontSize: 10,
                        }}
                      >
                        {item.detail}
                      </span>
                    </div>

                    <strong
                      className="obuy-recent-price"
                      style={{
                        color: "#e9edf0",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.price}
                    </strong>

                    <div
                      className="obuy-completed-pill"
                      style={{
                        padding: "5px 8px",
                        borderRadius: 6,
                        background:
                          "rgba(0,211,190,0.065)",
                        border:
                          "1px solid rgba(0,211,190,0.09)",
                        color: "#55cdbf",
                        fontSize: 8,
                        fontWeight: 750,
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      COMPLETED
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <style>{`
        @keyframes obuy-thinking-dot {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }

          30% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}