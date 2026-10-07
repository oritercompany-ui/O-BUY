import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL ||
  "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID =
  process.env.PAYPAL_CLIENT_ID;

const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET;

const PAYPAL_CURRENCY = "USD";

if (!PAYPAL_CLIENT_ID) {
  throw new Error("PAYPAL_CLIENT_ID is missing");
}

if (!PAYPAL_CLIENT_SECRET) {
  throw new Error("PAYPAL_CLIENT_SECRET is missing");
}

function validateOrderId(orderId) {
  if (
    typeof orderId !== "string" ||
    !orderId.trim()
  ) {
    throw new Error("PayPal order ID is required.");
  }

  return orderId.trim();
}

function roundCurrency(value) {
  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;
}

async function getAccessToken() {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    console.error(
      "PayPal authentication error:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data.error_description ||
        "Failed to authenticate with PayPal."
    );
  }

  if (!data.access_token) {
    throw new Error(
      "PayPal did not return an access token."
    );
  }

  return data.access_token;
}

async function paypalRequest(
  path,
  options = {}
) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  return {
    response,
    data
  };
}

export async function createPayPalOrder(
  checkout
) {
  if (!checkout || typeof checkout !== "object") {
    throw new Error("Invalid checkout data.");
  }

  if (
    !Array.isArray(checkout.items) ||
    checkout.items.length === 0
  ) {
    throw new Error("Checkout has no items.");
  }

  if (checkout.items.length > 20) {
    throw new Error(
      "Checkout contains too many items."
    );
  }

  if (checkout.approved !== true) {
    throw new Error(
      "User approval is required before payment."
    );
  }

  const currency =
    typeof checkout.currency === "string"
      ? checkout.currency.toUpperCase()
      : "";

  if (currency !== PAYPAL_CURRENCY) {
    throw new Error(
      "Only USD payments are supported."
    );
  }

  const itemIds = new Set();

  const items = checkout.items.map((item) => {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim()
    ) {
      throw new Error(
        "Checkout contains an invalid product."
      );
    }

    if (itemIds.has(item.id)) {
      throw new Error(
        "Duplicate products are not allowed."
      );
    }

    itemIds.add(item.id);

    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      throw new Error(
        "Checkout contains an invalid price."
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        "Checkout contains an invalid quantity."
      );
    }

    return {
      id: item.id.trim(),
      name: item.name?.trim(),
      price: roundCurrency(price),
      quantity
    };
  });

  if (
    items.some(
      (item) =>
        !item.name ||
        item.name.length > 127
    )
  ) {
    throw new Error(
      "Checkout contains an invalid product name."
    );
  }

  const itemTotal = roundCurrency(
    items.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    )
  );

  if (itemTotal <= 0) {
    throw new Error(
      "PayPal order total must be greater than zero."
    );
  }

  const order = {
    intent: "CAPTURE",

    application_context: {
      brand_name: "O-BUY",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url:
        process.env.PAYPAL_RETURN_URL ||
        "http://localhost:5173/?paypal=success",
      cancel_url:
        process.env.PAYPAL_CANCEL_URL ||
        "http://localhost:5173/?paypal=cancel"
    },

    purchase_units: [
      {
        description:
          "O-BUY AI Shopping Order",

        amount: {
          currency_code: PAYPAL_CURRENCY,
          value: itemTotal.toFixed(2),

          breakdown: {
            item_total: {
              currency_code:
                PAYPAL_CURRENCY,
              value: itemTotal.toFixed(2)
            }
          }
        },

        items: items.map((item) => ({
          name: item.name,

          unit_amount: {
            currency_code:
              PAYPAL_CURRENCY,
            value: item.price.toFixed(2)
          },

          quantity: String(item.quantity),

          category: "PHYSICAL_GOODS"
        }))
      }
    ]
  };

  const requestId = crypto.randomUUID();

  const { response, data } =
    await paypalRequest(
      "/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Prefer: "return=representation",
          "PayPal-Request-Id": requestId
        },
        body: JSON.stringify(order)
      }
    );

  if (!response.ok) {
    console.error(
      "PayPal create order error:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data.message ||
        "Failed to create PayPal order."
    );
  }

  if (!data.id) {
    throw new Error(
      "PayPal did not return an order ID."
    );
  }

  return data;
}

export async function getPayPalOrder(orderId) {
  const validOrderId =
    validateOrderId(orderId);

  const { response, data } =
    await paypalRequest(
      `/v2/checkout/orders/${encodeURIComponent(
        validOrderId
      )}`,
      {
        method: "GET"
      }
    );

  if (!response.ok) {
    console.error(
      "PayPal get order error:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data.message ||
        "Failed to retrieve PayPal order."
    );
  }

  return data;
}

export async function getPayPalApprovalUrl(
  orderId
) {
  const order =
    await getPayPalOrder(orderId);

  const approvalLink =
    order.links?.find(
      (link) =>
        link.rel === "approve" &&
        typeof link.href === "string"
    );

  if (!approvalLink) {
    throw new Error(
      "PayPal approval link was not found."
    );
  }

  return approvalLink.href;
}

export async function capturePayPalOrder(
  orderId
) {
  const validOrderId =
    validateOrderId(orderId);

  /*
   * Always check the latest PayPal status
   * before attempting capture.
   */
  const order =
    await getPayPalOrder(validOrderId);

  if (order.status === "COMPLETED") {
    return order;
  }

  if (order.status !== "APPROVED") {
    throw new Error(
      `PayPal order is not ready for capture. Current status: ${order.status}.`
    );
  }

  /*
   * Deterministic request ID for this order.
   *
   * If the same capture request is retried,
   * PayPal can recognize it as the same operation.
   */
  const requestId = crypto
    .createHash("sha256")
    .update(
      `o-buy-capture:${validOrderId}`
    )
    .digest("hex")
    .slice(0, 32);

  const { response, data } =
    await paypalRequest(
      `/v2/checkout/orders/${encodeURIComponent(
        validOrderId
      )}/capture`,
      {
        method: "POST",
        headers: {
          Prefer: "return=representation",
          "PayPal-Request-Id": requestId
        },
        body: JSON.stringify({})
      }
    );

  if (!response.ok) {
    /*
     * The capture may actually have succeeded
     * even if the client did not receive the response.
     *
     * Re-check the order before returning an error.
     */
    if (
      data.name ===
        "ORDER_ALREADY_CAPTURED" ||
      data.details?.some(
        (detail) =>
          detail.issue ===
          "ORDER_ALREADY_CAPTURED"
      )
    ) {
      const latestOrder =
        await getPayPalOrder(
          validOrderId
        );

      if (
        latestOrder.status === "COMPLETED"
      ) {
        return latestOrder;
      }
    }

    console.error(
      "PayPal capture error:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data.message ||
        "Failed to capture PayPal order."
    );
  }

  return data;
}