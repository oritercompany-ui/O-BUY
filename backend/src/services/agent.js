import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import { products } from "../data/products.js";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey
});

const shoppingPlanSchema = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      description: "A short description of what the user wants to buy."
    },
    budget: {
      type: ["number", "null"],
      description: "The user's maximum budget in USD, or null if none was stated."
    },
    products: {
      type: "array",
      description: "Products selected from the provided catalog.",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Exact product ID from the catalog."
          },
          name: {
            type: "string",
            description: "Exact product name from the catalog."
          },
          price: {
            type: "number",
            description: "Exact product price from the catalog."
          },
          reason: {
            type: "string",
            description: "Short explanation for why this product fits the request."
          }
        },
        required: [
          "id",
          "name",
          "price",
          "reason"
        ]
      }
    },
    total: {
      type: "number",
      description: "Sum of the selected catalog prices."
    },
    withinBudget: {
      type: "boolean",
      description: "True only when a budget exists and total does not exceed it."
    },
    summary: {
      type: "string",
      description: "A concise explanation of the shopping plan."
    }
  },
  required: [
    "intent",
    "budget",
    "products",
    "total",
    "withinBudget",
    "summary"
  ]
};

export async function runShoppingAgent(userRequest) {
  const catalog = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    tags: product.tags,
    tier: product.tier
  }));

  const prompt = `
You are O-BUY, a controlled AI shopping agent.

Your job is to understand the user's shopping request and create
a useful shopping plan using ONLY the available product catalog.

IMPORTANT:
- The catalog is the only source of truth for products, names, IDs and prices.
- Never invent a product.
- Never invent a price.
- Never modify a catalog price.
- Never create a product ID that does not exist.
- The user controls the maximum budget.
- The AI must never intentionally exceed the user's stated maximum budget.
- The final purchase requires explicit user approval outside the AI.
- Prefer useful combinations over simply selecting the most expensive products.
- Consider budget tiers when choosing between similar products.
- If the user requests a specific category, prioritize that category.
- Do not add unnecessary products just to spend the budget.
- Select only products that meaningfully help satisfy the user's request.

BUDGET RULES:
- "under $500" means maximum budget = 500.
- "below $300" means maximum budget = 300.
- "less than $400" means maximum budget = 400.
- "up to $750" means maximum budget = 750.
- "maximum $750" means maximum budget = 750.
- "max $500" means maximum budget = 500.
- "budget is $400" means maximum budget = 400.
- If the user does not state a budget, return budget = null.
- If budget is null, withinBudget must be false.
- Do not guess a budget that the user did not provide.

PRODUCT SELECTION:
- Use exact product IDs from the catalog.
- Use exact product names from the catalog.
- Use exact catalog prices.
- Do not select duplicate products.
- Every selected product must directly or reasonably support the user's request.
- If the request is broad, build a coherent setup rather than selecting random products.
- If the requested combination cannot reasonably fit the budget, choose better-value alternatives from the catalog.
- Prioritize value and usefulness, not maximum spending.

CALCULATION:
- total must equal the sum of the selected catalog prices.
- withinBudget must be true only when budget is not null AND total <= budget.
- If budget is null, withinBudget must be false.
- Keep total mathematically consistent with the selected products.

USER REQUEST:
<user_request>
${userRequest}
</user_request>

AVAILABLE PRODUCT CATALOG:
<catalog>
${JSON.stringify(catalog, null, 2)}
</catalog>

Return only the structured shopping plan.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: shoppingPlanSchema
    }
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  let plan;

  try {
    plan = JSON.parse(rawText);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  if (!plan || typeof plan !== "object") {
    throw new Error("Gemini returned an invalid shopping plan.");
  }

  if (!Array.isArray(plan.products)) {
    throw new Error("Gemini returned an invalid product list.");
  }

  const catalogById = new Map(
    products.map((product) => [product.id, product])
  );

  const validatedProducts = [];
  const usedIds = new Set();

  for (const item of plan.products) {
    if (!item || typeof item.id !== "string") {
      throw new Error("Gemini returned an invalid product ID.");
    }

    if (usedIds.has(item.id)) {
      continue;
    }

    const catalogProduct = catalogById.get(item.id);

    if (!catalogProduct) {
      throw new Error(
        `Gemini selected an unknown product: ${item.id}`
      );
    }

    usedIds.add(item.id);

    validatedProducts.push({
      id: catalogProduct.id,
      name: catalogProduct.name,
      price: catalogProduct.price,
      reason:
        typeof item.reason === "string" && item.reason.trim()
          ? item.reason.trim()
          : "Selected because it matches the shopping request."
    });
  }

  const catalogTotal = validatedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const budget =
    typeof plan.budget === "number" &&
    Number.isFinite(plan.budget) &&
    plan.budget > 0
      ? plan.budget
      : null;

  const withinBudget =
    budget !== null && catalogTotal <= budget;

  return {
    intent:
      typeof plan.intent === "string" && plan.intent.trim()
        ? plan.intent.trim()
        : "Shopping plan",

    budget,

    products: validatedProducts,

    total: catalogTotal,

    withinBudget,

    summary:
      typeof plan.summary === "string" && plan.summary.trim()
        ? plan.summary.trim()
        : "O-BUY prepared a shopping plan from the available catalog."
  };
}