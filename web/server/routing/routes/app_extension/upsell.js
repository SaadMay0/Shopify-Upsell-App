import express from "express";

import {
  offer,
  signChangeset,
  offerDecline,
  offerAccept,
} from "../../services/app_extension/upsell.js";

const router = express.Router();

// GET  METHOD
router.get("/offer", offer);
router.get("/offerDecline", offerDecline);
 
// POST  METHOD

router.post("/sign-changeset", signChangeset);
router.post("/offerAccept", offerAccept);
// PUT  METHOD 
 
   
export default router;
