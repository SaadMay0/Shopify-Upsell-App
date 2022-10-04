import webhooks from "./webhook.route.js";
import upsellExt from "./app_extension/upsell.js";

export default (app) => {
  app.use("/api/v1.0/webhook", webhooks);
  app.use("/offer", upsellExt);
};
