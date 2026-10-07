const API_URL = (
  "https://o-buy-api.onrender.com"
).replace(/\/+$/, "");

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : "Something went wrong."
    );
  }

  return data;
}

async function postJson(
  path: string,
  body: unknown
) {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return parseResponse(response);
}

export async function createAgentPlan(
  message: string
) {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error(
      "Shopping request is required."
    );
  }

  return postJson(
    "/api/agent/plan",
    {
      message: cleanMessage,
    }
  );
}

export async function prepareCheckout(
  plan: {
    budget: number;
    products: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }
) {
  if (
    !plan ||
    !Number.isFinite(plan.budget) ||
    plan.budget <= 0
  ) {
    throw new Error(
      "A valid shopping budget is required."
    );
  }

  if (
    !Array.isArray(plan.products) ||
    plan.products.length === 0
  ) {
    throw new Error(
      "Shopping plan must contain products."
    );
  }

  return postJson(
    "/api/checkout/prepare",
    {
      plan,
    }
  );
}

export async function createPayPalOrder(
  checkout: unknown
) {
  if (!checkout) {
    throw new Error(
      "Checkout data is required."
    );
  }

  return postJson(
    "/api/paypal/create-order",
    {
      checkout,
    }
  );
}

export async function capturePayPalOrder(
  orderId: string
) {
  const cleanOrderId = orderId.trim();

  if (!cleanOrderId) {
    throw new Error(
      "PayPal order ID is required."
    );
  }

  const response = await fetch(
    `${API_URL}/api/paypal/capture/${encodeURIComponent(
      cleanOrderId
    )}`,
    {
      method: "POST",
    }
  );

  return parseResponse(response);
}

export const API_BASE_URL = API_URL;