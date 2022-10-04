import express from "express";

import { offer, signChangeset } from "../../services/app_extension/upsell.js";

const router = express.Router();

// GET  METHOD
router.get("/offer", offer);


// POST  METHOD

router.post("/sign-changeset", signChangeset);
// PUT  METHOD


export default router;
