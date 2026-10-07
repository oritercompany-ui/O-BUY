import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productsRoute from "./routes/productsRoute.js";
import agentRoute from "./routes/agentRoute.js";
import checkoutRoute from "./routes/checkoutRoute.js";
import paypalRoute from "./routes/paypalRoute.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

app.disable("x-powered-by");

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use("/api/products", productsRoute);
app.use("/api/agent", agentRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/paypal", paypalRoute);

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "O-BUY API is running",
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log("=================================");
  console.log("O-BUY API");
  console.log("=================================");
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Port: ${PORT}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log("=================================");
});