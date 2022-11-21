import gdprWebhooks from "./gdpr_webhooks.js";
import webhooks from "./webhooks.js";

import { rawBodyHandler, verifyHMC } from "../../../middleware/webhooks_verification.js";

export default (app) => {
  app.use("/api/gdprWebhook", rawBodyHandler, verifyHMC, gdprWebhooks);
  app.use("/api/v1.0/webhook", rawBodyHandler, verifyHMC, webhooks);
};
