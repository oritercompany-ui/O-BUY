import chair001 from "../assets/chair-001.jpg";
import chair002 from "../assets/chair-002.jpg";
import chair003 from "../assets/chair-003.jpg";

import desk001 from "../assets/desk-001.jpg";
import desk002 from "../assets/desk-002.jpg";
import desk003 from "../assets/desk-003.jpg";

import headphones001 from "../assets/headphones-001.jpg";
import headphones002 from "../assets/headphones-002.jpg";
import headphones003 from "../assets/headphones-003.jpg";

import keyboard001 from "../assets/keyboard-001.jpg";
import keyboard002 from "../assets/keyboard-002.jpg";
import keyboard003 from "../assets/keyboard-003.jpg";

import lamp001 from "../assets/lamp-001.jpg";
import lamp002 from "../assets/lamp-002.jpg";
import lamp003 from "../assets/lamp-003.jpg";

import laptopstand001 from "../assets/laptopstand-001.jpg";
import laptopstand002 from "../assets/laptopstand-002.jpg";

import monitor001 from "../assets/monitor-001.jpg";
import monitor002 from "../assets/monitor-002.jpg";
import monitor003 from "../assets/monitor-003.jpg";

import mouse001 from "../assets/mouse-001.jpg";
import mouse002 from "../assets/mouse-002.jpg";
import mouse003 from "../assets/mouse-003.jpg";

import usbC001 from "../assets/usb-c-001.jpg";
import usbC002 from "../assets/usb-c-002.jpg";

import webcam001 from "../assets/webcam-001.jpg";
import webcam002 from "../assets/webcam-002.jpg";
import webcam003 from "../assets/webcam-003.jpg";

interface ProductCardProps {
  name: string;
  price: number;
  reason?: string;
  image?: string;
}

const productImages: Record<string, string> = {
  "Minimal Work Desk": desk001,
  "Executive Work Desk": desk002,
  "Compact Study Desk": desk003,

  "Ergo Office Chair": chair001,
  "Essential Office Chair": chair002,
  "Premium Ergonomic Chair": chair003,

  "27-inch 4K Monitor": monitor001,
  "24-inch Full HD Monitor": monitor002,
  "27-inch QHD Monitor": monitor003,

  "Mechanical Keyboard": keyboard001,
  "Slim Wireless Keyboard": keyboard002,
  "Premium Mechanical Keyboard": keyboard003,

  "Wireless Ergonomic Mouse": mouse001,
  "Essential Wireless Mouse": mouse002,
  "Precision Productivity Mouse": mouse003,

  "Smart Desk Lamp": lamp001,
  "Minimal Desk Light": lamp002,
  "Premium Ambient Desk Lamp": lamp003,

  "Full HD Webcam": webcam001,
  "Compact HD Webcam": webcam002,
  "4K Pro Webcam": webcam003,

  "Wireless Noise Cancelling Headphones":
    headphones001,
  "Essential Wireless Headphones":
    headphones002,
  "Premium ANC Headphones":
    headphones003,

  "Aluminum Laptop Stand":
    laptopstand001,
  "Basic Laptop Stand":
    laptopstand002,

  "USB-C Multiport Hub": usbC001,
  "Compact USB-C Hub": usbC002,
};

export default function ProductCard({
  name,
  price,
  reason,
  image,
}: ProductCardProps) {
  const productImage =
    image || productImages[name];

  return (
    <article
      style={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "18px",
        border:
          "1px solid rgba(255,255,255,0.075)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))",
        boxSizing: "border-box",
      }}
    >
      {/* PRODUCT IMAGE */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "210px",
          overflow: "hidden",
          background:
            "rgba(255,255,255,0.035)",
        }}
      >
        {productImage ? (
          <img
            src={productImage}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: "38px",
              fontWeight: 700,
            }}
          >
            O
          </div>
        )}

        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            padding: "6px 8px",
            borderRadius: "999px",
            background:
              "rgba(7,7,9,0.72)",
            border:
              "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            color: "#72e6c2",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          SELECTED
        </span>
      </div>

      {/* PRODUCT INFO */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.35,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {name}
          </h3>

          {reason && (
            <p
              style={{
                margin: "7px 0 0",
                fontSize: "11px",
                lineHeight: 1.5,
                color:
                  "rgba(255,255,255,0.4)",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {reason}
            </p>
          )}
        </div>

        <strong
          style={{
            flexShrink: 0,
            fontSize: "15px",
            fontWeight: 600,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          ${price.toFixed(2)}
        </strong>
      </div>
    </article>
  );
}