import express from "express";

import { products } from "../data/products.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Products route error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load product catalog."
    });
  }
});

router.get("/search", (req, res) => {
  try {
    const rawQuery =
      typeof req.query.q === "string"
        ? req.query.q.trim().toLowerCase()
        : "";

    if (!rawQuery) {
      return res.status(200).json({
        success: true,
        query: "",
        count: products.length,
        products
      });
    }

    if (rawQuery.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Search query is too long."
      });
    }

    const queryTerms = rawQuery
      .split(/\s+/)
      .filter(Boolean);

    const results = products.filter((product) => {
      const searchableText = [
        product.id,
        product.name,
        product.category,
        product.description,
        product.tier,
        ...(product.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      return queryTerms.every((term) =>
        searchableText.includes(term)
      );
    });

    return res.status(200).json({
      success: true,
      query: rawQuery,
      count: results.length,
      products: results
    });
  } catch (error) {
    console.error("Product search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search products."
    });
  }
});

export default router;