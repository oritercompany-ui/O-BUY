import express from "express";

import {
  createPayPalOrder,
  getPayPalApprovalUrl,
  getPayPalOrder,
  capturePayPalOrder
} from "../services/paypalService.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { checkout } = req.body;

    if (!checkout || typeof checkout !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid checkout data."
      });
    }

    if (checkout.approved !== true) {
      return res.status(400).json({
        success: false,
        message: "User approval is required before payment."
      });
    }

    if (!Array.isArray(checkout.items) || checkout.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Checkout has no items."
      });
    }

    if (checkout.items.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Checkout contains too many items."
      });
    }

    const itemIds = checkout.items.map((item) => item?.id);

    if (
      itemIds.some(
        (id) => typeof id !== "string" || !id.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Checkout contains an invalid product."
      });
    }

    const uniqueItemIds = new Set(itemIds);

    if (uniqueItemIds.size !== itemIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate products are not allowed."
      });
    }

    const paypalOrder = await createPayPalOrder(checkout);

    return res.status(200).json({
      success: true,
      orderId: paypalOrder.id,
      status: paypalOrder.status,
      paypal: paypalOrder
    });
  } catch (error) {
    console.error("PayPal create order error:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to create PayPal order."
    });
  }
});

router.get("/approve/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId || !orderId.trim()) {
      return res.status(400).json({
        success: false,
        message: "PayPal order ID is required."
      });
    }

    const approvalUrl = await getPayPalApprovalUrl(orderId);

    return res.redirect(302, approvalUrl);
  } catch (error) {
    console.error("PayPal approval error:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to open PayPal approval."
    });
  }
});

router.post("/capture/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId || !orderId.trim()) {
      return res.status(400).json({
        success: false,
        message: "PayPal order ID is required."
      });
    }

    const order = await getPayPalOrder(orderId);

    if (order.status === "COMPLETED") {
      const completedTotal =
        order.purchase_units?.[0]?.payments?.captures?.[0]?.amount
          ?.value ||
        order.purchase_units?.[0]?.amount?.value ||
        "0";

      return res.status(200).json({
        success: true,
        alreadyCaptured: true,
        orderId: order.id,
        status: order.status,
        capture: order,
        message: "PayPal order was already completed.",
        total: Number(completedTotal)
      });
    }

    if (order.status !== "APPROVED") {
      return res.status(409).json({
        success: false,
        message: `PayPal order is not ready for capture. Current status: ${order.status}.`,
        status: order.status
      });
    }

    const result = await capturePayPalOrder(orderId);

    return res.status(200).json({
      success: true,
      alreadyCaptured: false,
      orderId: result.id,
      status: result.status,
      capture: result
    });
  } catch (error) {
    console.error("PayPal capture error:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to complete PayPal payment."
    });
  }
});

export default router;