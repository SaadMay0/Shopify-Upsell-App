import express from "express";

import {
  postSelectUpSellProducts,
  getUpsellProducts,
} from "../services/shopify/dashboard.js";

const router = express.Router();

// GET  METHOD

router.get("/getUpsellProducts", getUpsellProducts);

// POST  METHOD

router.post("/selectUpSellProducts", postSelectUpSellProducts);
// PUT  METHOD

// DELETE METHOD

export default router;
    