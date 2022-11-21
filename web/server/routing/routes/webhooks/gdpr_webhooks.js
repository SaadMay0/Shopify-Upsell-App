import express from "express";
import {
  customersDataReqest,
  customersRedact,
  shopRedact,
} from "../../services/webhooks/gdpr_webhooks.js";

const router = express.Router();

router.post("/customers_data_request", customersDataReqest);
router.post("/customers_redact", customersRedact);
router.post("/shop_redact", shopRedact);

export default router;
