import express from "express";

import { runShoppingAgent } from "../services/agent.js";
import { validateBudget } from "../services/budgetGuard.js";
import { extractBudget } from "../services/budgetExtractor.js";
import { optimizeBudget } from "../services/budgetOptimizer.js";

const router = express.Router();

router.post("/plan", async (req, res) => {
  try {
    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Shopping request is required."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Shopping request is too long."
      });
    }

    const plan = await runShoppingAgent(message);

    if (!plan || typeof plan !== "object") {
      return res.status(502).json({
        success: false,
        message: "AI returned an invalid shopping plan."
      });
    }

    if (!Array.isArray(plan.products)) {
      return res.status(502).json({
        success: false,
        message: "AI returned an invalid product selection."
      });
    }

    const extractedBudget = extractBudget(message);

    if (extractedBudget !== null) {
      plan.budget = extractedBudget;
    }

    const budgetCheck = validateBudget(plan);

    const optimization = budgetCheck.valid
      ? optimizeBudget(plan)
      : {
          success: false,
          optimized: false,
          withinBudget: false,
          budget: budgetCheck.budget ?? null,
          total: budgetCheck.total ?? 0,
          remaining: budgetCheck.remaining ?? 0,
          products: [],
          message: budgetCheck.message
        };

    return res.status(200).json({
      success: true,
      plan,
      budgetCheck,
      optimization
    });
  } catch (error) {
    console.error("Agent error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create shopping plan."
    });
  }
});

export default router;