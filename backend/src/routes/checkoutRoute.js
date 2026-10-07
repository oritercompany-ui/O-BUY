import express from "express";

import { products } from "../data/products.js";
import { validateBudget } from "../services/budgetGuard.js";

const router = express.Router();

const CURRENCY = "USD";

router.post("/prepare", (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || typeof plan !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid shopping plan."
      });
    }

    if (!Array.isArray(plan.products) || plan.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Shopping plan must contain at least one product."
      });
    }

    if (plan.products.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Shopping plan contains too many products."
      });
    }

    const productIds = plan.products.map((item) => item?.id);

    if (productIds.some((id) => typeof id !== "string" || !id.trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid product selection."
      });
    }

    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate products are not allowed."
      });
    }

    const serverProducts = [];

    for (const productId of productIds) {
      const product = products.find(
        (item) => item.id === productId
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${productId} does not exist in the catalog.`
        });
      }

      serverProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }

    const serverPlan = {
      budget: Number(plan.budget),
      products: serverProducts.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price
      }))
    };

    const budgetCheck = validateBudget(serverPlan);

    if (!budgetCheck.valid) {
      return res.status(400).json({
        success: false,
        message: budgetCheck.message
      });
    }

    if (!budgetCheck.withinBudget) {
      return res.status(400).json({
        success: false,
        status: "budget_exceeded",
        message: "Shopping plan exceeds the user's budget.",
        budgetCheck
      });
    }

    const subtotal = serverProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Checkout total must be greater than zero."
      });
    }

    const checkoutPlan = {
      status: "awaiting_approval",
      items: serverProducts,
      subtotal,
      budget: budgetCheck.budget,
      remaining: budgetCheck.budget - subtotal,
      currency: CURRENCY,
      approved: false
    };

    return res.status(200).json({
      success: true,
      checkout: checkoutPlan
    });
  } catch (error) {
    console.error("Checkout prepare error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to prepare checkout."
    });
  }
});

export default router;