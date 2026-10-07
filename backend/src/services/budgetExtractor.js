export function extractBudget(message) {
  if (typeof message !== "string") {
    return null;
  }

  const normalizedMessage = message
    .trim()
    .toLowerCase()
    .replace(/,/g, "");

  if (!normalizedMessage) {
    return null;
  }

  const patterns = [
    // under $500
    // below 300
    // less than USD 750
    // under 1k
    /(?:under|below|less\s+than)\s*(?:usd\s*)?\$?\s*(\d+(?:\.\d+)?)\s*(k)?/i,

    // max $500
    // maximum 750
    // max of $1k
    /(?:max(?:imum)?)(?:\s+of)?\s*(?:usd\s*)?\$?\s*(\d+(?:\.\d+)?)\s*(k)?/i,

    // budget $500
    // budget is $500
    // budget: $500
    /budget(?:\s+is)?\s*[:=]?\s*(?:usd\s*)?\$?\s*(\d+(?:\.\d+)?)\s*(k)?/i,

    // up to $500
    // up to 1k
    /up\s+to\s*(?:usd\s*)?\$?\s*(\d+(?:\.\d+)?)\s*(k)?/i,

    // $500 budget
    // USD 750 budget
    /(?:usd\s*)?\$?\s*(\d+(?:\.\d+)?)\s*(k)?\s*budget\b/i
  ];

  for (const pattern of patterns) {
    const match = normalizedMessage.match(pattern);

    if (!match) {
      continue;
    }

    let amount = Number(match[1]);

    if (!Number.isFinite(amount) || amount <= 0) {
      return null;
    }

    if (match[2]?.toLowerCase() === "k") {
      amount *= 1000;
    }

    return amount;
  }

  return null;
}