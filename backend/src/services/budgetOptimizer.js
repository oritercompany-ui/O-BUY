import { products } from "../data/products.js";

const productById = new Map(
  products.map((product) => [product.id, product])
);

const tierScore = {
  budget: 1,
  standard: 2,
  premium: 3
};

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getTagOverlap(sourceProduct, candidateProduct) {
  const sourceTags = new Set(
    (sourceProduct.tags || []).map((tag) =>
      String(tag).toLowerCase()
    )
  );

  return (candidateProduct.tags || []).filter((tag) =>
    sourceTags.has(String(tag).toLowerCase())
  ).length;
}

function getCandidateScore(sourceProduct, candidateProduct) {
  const overlap = getTagOverlap(
    sourceProduct,
    candidateProduct
  );

  const sourceTier =
    tierScore[sourceProduct.tier] || tierScore.standard;

  const candidateTier =
    tierScore[candidateProduct.tier] || tierScore.standard;

  const tierDifference =
    Math.abs(sourceTier - candidateTier);

  return (
    overlap * 100 +
    candidateTier * 20 -
    tierDifference * 10
  );
}

function getCompatibleCandidates(sourceProduct) {
  return products
    .filter(
      (product) =>
        product.category === sourceProduct.category
    )
    .filter(
      (product) =>
        getTagOverlap(sourceProduct, product) > 0 ||
        product.id === sourceProduct.id
    )
    .sort(
      (a, b) =>
        getCandidateScore(sourceProduct, b) -
        getCandidateScore(sourceProduct, a)
    );
}

function calculateQualityScore(
  selectedProducts,
  sourceProducts,
  total,
  budget
) {
  let score = 0;

  for (let i = 0; i < selectedProducts.length; i++) {
    const selected = selectedProducts[i];
    const source = sourceProducts[i];

    const overlap = getTagOverlap(source, selected);

    const tier =
      tierScore[selected.tier] || tierScore.standard;

    score += overlap * 100;
    score += tier * 20;

    if (selected.id === source.id) {
      score += 50;
    }
  }

  // Prefer using the budget efficiently without blindly
  // selecting the most expensive products.
  const utilization =
    budget > 0 ? total / budget : 0;

  score += utilization * 25;

  return score;
}

export function optimizeBudget(plan) {
  if (!plan || typeof plan !== "object") {
    return {
      success: false,
      optimized: false,
      withinBudget: false,
      budget: 0,
      total: 0,
      remaining: 0,
      products: [],
      message: "Invalid shopping plan."
    };
  }

  const budget = Number(plan.budget);

  if (!Number.isFinite(budget) || budget <= 0) {
    return {
      success: false,
      optimized: false,
      withinBudget: false,
      budget: 0,
      total: 0,
      remaining: 0,
      products: [],
      message: "No valid budget was provided."
    };
  }

  if (!Array.isArray(plan.products)) {
    return {
      success: false,
      optimized: false,
      withinBudget: false,
      budget,
      total: 0,
      remaining: budget,
      products: [],
      message: "Shopping plan contains an invalid product list."
    };
  }

  if (plan.products.length === 0) {
    return {
      success: false,
      optimized: false,
      withinBudget: false,
      budget,
      total: 0,
      remaining: budget,
      products: [],
      message: "Shopping plan contains no products."
    };
  }

  if (plan.products.length > 10) {
    return {
      success: false,
      optimized: false,
      withinBudget: false,
      budget,
      total: 0,
      remaining: budget,
      products: [],
      message: "Shopping plan contains too many products."
    };
  }

  const requestedProducts = [];

  for (const item of plan.products) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim()
    ) {
      return {
        success: false,
        optimized: false,
        withinBudget: false,
        budget,
        total: 0,
        remaining: budget,
        products: [],
        message: "Shopping plan contains an invalid product ID."
      };
    }

    const product = productById.get(item.id.trim());

    if (!product) {
      return {
        success: false,
        optimized: false,
        withinBudget: false,
        budget,
        total: 0,
        remaining: budget,
        products: [],
        message: `Product ${item.id} does not exist in the catalog.`
      };
    }

    requestedProducts.push(product);
  }

  const uniqueIds = new Set(
    requestedProducts.map((product) => product.id)
  );

  if (uniqueIds.size !== requestedProducts.length) {
    return {
      success: false,
      optimized: false,
      withinBudget: false,
      budget,
      total: 0,
      remaining: budget,
      products: [],
      message: "Duplicate products are not allowed."
    };
  }

  const originalTotal = roundCurrency(
    requestedProducts.reduce(
      (sum, product) => sum + Number(product.price),
      0
    )
  );

  /*
   * IMPORTANT:
   * If the AI plan already fits the budget, preserve it.
   *
   * The optimizer should not randomly downgrade or replace
   * products simply because cheaper alternatives exist.
   */
  if (originalTotal <= budget) {
    return {
      success: true,
      optimized: false,
      withinBudget: true,
      budget,
      total: originalTotal,
      remaining: roundCurrency(
        budget - originalTotal
      ),
      products: requestedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price)
      }))
    };
  }

  /*
   * The original plan exceeds the budget.
   *
   * Build an alternative candidate list for every selected
   * product. Alternatives must remain in the same category
   * and share relevant tags.
   */
  const candidateGroups = requestedProducts.map(
    (sourceProduct) => {
      const candidates = getCompatibleCandidates(
        sourceProduct
      );

      return candidates.filter(
        (candidate) =>
          Number(candidate.price) <= budget
      );
    }
  );

  /*
   * If one requested category has no affordable candidate,
   * there is no complete replacement plan that can satisfy
   * the original product requirements.
   */
  if (
    candidateGroups.some(
      (candidates) => candidates.length === 0
    )
  ) {
    return {
      success: true,
      optimized: false,
      withinBudget: false,
      budget,
      total: originalTotal,
      remaining: roundCurrency(
        budget - originalTotal
      ),
      products: requestedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price)
      })),
      message:
        "The requested products cannot be fully optimized within the budget."
    };
  }

  let bestCombination = null;
  let bestTotal = Infinity;
  let bestScore = -Infinity;

  function search(
    index,
    selectedProducts,
    currentTotal
  ) {
    if (currentTotal > budget) {
      return;
    }

    if (index === candidateGroups.length) {
      const total = roundCurrency(currentTotal);

      const score = calculateQualityScore(
        selectedProducts,
        requestedProducts,
        total,
        budget
      );

      if (
        score > bestScore ||
        (score === bestScore && total > bestTotal)
      ) {
        bestScore = score;
        bestTotal = total;
        bestCombination = [...selectedProducts];
      }

      return;
    }

    const candidates = candidateGroups[index];

    for (const candidate of candidates) {
      const candidatePrice = Number(candidate.price);

      if (
        selectedProducts.some(
          (product) => product.id === candidate.id
        )
      ) {
        continue;
      }

      search(
        index + 1,
        [...selectedProducts, candidate],
        currentTotal + candidatePrice
      );
    }
  }

  search(0, [], 0);

  if (!bestCombination) {
    return {
      success: true,
      optimized: false,
      withinBudget: false,
      budget,
      total: originalTotal,
      remaining: roundCurrency(
        budget - originalTotal
      ),
      products: requestedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price)
      })),
      message:
        "No complete shopping combination fits within the budget."
    };
  }

  const optimizedTotal = roundCurrency(bestTotal);

  const changed =
    bestCombination.length !== requestedProducts.length ||
    bestCombination.some(
      (product, index) =>
        product.id !== requestedProducts[index].id
    );

  return {
    success: true,
    optimized: changed,
    withinBudget: optimizedTotal <= budget,
    budget,
    total: optimizedTotal,
    remaining: roundCurrency(
      budget - optimizedTotal
    ),
    products: bestCombination.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price)
    }))
  };
}