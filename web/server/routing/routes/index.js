import webhooks from "./webhook.route.js";
import upsellExt from "./app_extension/upsell.js";
import dashboard from "./dashboard.js"
// 92ac-110-39-147-226.ngrok.io
export default (app) => {
  app.use("/api/v1.0/webhook", webhooks);
  app.use("/api", upsellExt);
  app.use("/api/dashboard", dashboard);
};
