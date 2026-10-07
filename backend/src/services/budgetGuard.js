import { products } from "../data/products.js";

const productById = new Map(
  products.map((product) => [product.id, product])
);

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function validateBudget(plan) {
  if (!plan || typeof plan !== "object") {
    return {
      valid: false,
      withinBudget: false,
      message: "Invalid shopping plan."
    };
  }

  const budget = Number(plan.budget);

  if (!Number.isFinite(budget) || budget <= 0) {
    return {
      valid: false,
      withinBudget: false,
      message: "No valid budget was provided."
    };
  }

  if (!Array.isArray(plan.products)) {
    return {
      valid: false,
      withinBudget: false,
      budget,
      message: "Shopping plan contains an invalid product list."
    };
  }

  if (plan.products.length === 0) {
    return {
      valid: false,
      withinBudget: false,
      budget,
      message: "Shopping plan contains no products."
    };
  }

  if (plan.products.length > 20) {
    return {
      valid: false,
      withinBudget: false,
      budget,
      message: "Shopping plan contains too many products."
    };
  }

  const validatedProducts = [];
  const usedProductIds = new Set();

  for (const item of plan.products) {
    if (!item || typeof item.id !== "string" || !item.id.trim()) {
      return {
        valid: false,
        withinBudget: false,
        budget,
        message: "Shopping plan contains an invalid product ID."
      };
    }

    const productId = item.id.trim();

    if (usedProductIds.has(productId)) {
      return {
        valid: false,
        withinBudget: false,
        budget,
        message: `Duplicate product ${productId} is not allowed.`
      };
    }

    const product = productById.get(productId);

    if (!product) {
      return {
        valid: false,
        withinBudget: false,
        budget,
        message: `Product ${productId} does not exist in the catalog.`
      };
    }

    usedProductIds.add(productId);

    validatedProducts.push({
      id: product.id,
      name: product.name,
      price: roundCurrency(Number(product.price))
    });
  }

  const total = roundCurrency(
    validatedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    )
  );

  const remaining = roundCurrency(budget - total);
  const withinBudget = total <= budget;

  return {
    valid: true,
    withinBudget,
    budget,
    total,
    remaining,
    products: validatedProducts,
    message: withinBudget
      ? "Shopping plan is within budget."
      : "Shopping plan exceeds the user's budget."
  };
}