import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  reason?: string;
}

interface PurchasePlanProps {
  products: Product[];
  total: number;
}

export default function PurchasePlan({
  products,
  total,
}: PurchasePlanProps) {
  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "18px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "#72e6c2",
              marginBottom: "7px",
            }}
          >
            YOUR PURCHASE PLAN
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "21px",
              lineHeight: 1.2,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#fff",
            }}
          >
            {products.length}{" "}
            {products.length === 1
              ? "item"
              : "items"}{" "}
            selected
          </h2>
        </div>

        <div
          style={{
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color:
                "rgba(255,255,255,0.32)",
              marginBottom: "5px",
            }}
          >
            ESTIMATED TOTAL
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
      </div>

      {/* PRODUCTS */}
      {products.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "14px",
            width: "100%",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              reason={product.reason}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            border:
              "1px dashed rgba(255,255,255,0.1)",
            background:
              "rgba(255,255,255,0.018)",
            color:
              "rgba(255,255,255,0.3)",
            fontSize: "12px",
          }}
        >
          <span>
            No products selected.
          </span>
        </div>
      )}

      <style>{`
        @media (max-width: 760px) {
          section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 500px) {
          section > div:first-child {
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 12px !important;
          }

          section > div:first-child > div:last-child {
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
}