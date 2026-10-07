import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL ||
  "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

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

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(
      "PayPal token error:",
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

  const data = await response.json().catch(() => ({}));

  return {
    response,
    data
  };
}

export async function getPayPalOrder(orderId) {
  const validOrderId = validateOrderId(orderId);

  const { response, data } = await paypalRequest(
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

export async function createPayPalOrder(checkout) {
  if (!checkout || typeof checkout !== "object") {
    throw new Error("Invalid checkout data.");
  }

  if (
    !Array.isArray(checkout.items) ||
    checkout.items.length === 0
  ) {
    throw new Error("Checkout has no items.");
  }

  const currency =
    typeof checkout.currency === "string"
      ? checkout.currency.toUpperCase()
      : "";

  if (currency !== "USD") {
    throw new Error(
      "Only USD payments are supported."
    );
  }

  const items = checkout.items.map((item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (
      !item ||
      typeof item.name !== "string" ||
      !item.name.trim()
    ) {
      throw new Error(
        "Checkout contains an invalid item."
      );
    }

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      throw new Error(
        "Checkout contains an invalid item price."
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
      name: item.name.trim().slice(0, 127),
      price: price.toFixed(2),
      quantity
    };
  });

  const itemTotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * item.quantity,
    0
  );

  const total = itemTotal.toFixed(2);

  const order = {
    intent: "CAPTURE",

    application_context: {
      brand_name: "O-BUY",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url:
        process.env.PAYPAL_RETURN_URL ||
        "https://o-buy.vercel.app/?paypal=success",
      cancel_url:
        process.env.PAYPAL_CANCEL_URL ||
        "https://o-buy.vercel.app/?paypal=cancel"
    },

    purchase_units: [
      {
        description:
          "O-BUY AI Shopping Order",

        amount: {
          currency_code: "USD",
          value: total,

          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total
            }
          }
        },

        items: items.map((item) => ({
          name: item.name,

          unit_amount: {
            currency_code: "USD",
            value: item.price
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

export async function getPayPalApprovalUrl(
  orderId
) {
  const order = await getPayPalOrder(orderId);

  const approvalLink = order.links?.find(
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
  const validOrderId = validateOrderId(orderId);

  /*
   * Check the current PayPal order status first.
   *
   * This prevents us from calling /capture on an
   * already completed order.
   */
  const order = await getPayPalOrder(
    validOrderId
  );

  if (order.status === "COMPLETED") {
    return order;
  }

  if (order.status !== "APPROVED") {
    throw new Error(
      `PayPal order is not ready for capture. Current status: ${order.status}.`
    );
  }

  /*
   * Keep the request ID deterministic for this order.
   *
   * If the capture request is retried because of a
   * network interruption, PayPal can recognize the
   * same request instead of processing another capture.
   */
  const requestId = crypto
    .createHash("sha256")
    .update(`o-buy-capture:${validOrderId}`)
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
     * PayPal may report that the order has already
     * been captured if a previous request succeeded
     * but the client did not receive the response.
     *
     * Re-check the order before failing.
     */
    if (
      data.name === "ORDER_ALREADY_CAPTURED" ||
      data.details?.some(
        (detail) =>
          detail.issue ===
          "ORDER_ALREADY_CAPTURED"
      )
    ) {
      const latestOrder =
        await getPayPalOrder(validOrderId);

      if (latestOrder.status === "COMPLETED") {
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