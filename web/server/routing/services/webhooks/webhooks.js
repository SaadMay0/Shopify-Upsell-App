import { Shopify } from "@shopify/shopify-api";
import { AppInstallations } from "../helper_functions/webhook/index.js";
import db from "../../../db/models/postgres/index.js";

export const ordersCreateWebhookHandler = async (order, shop) => {
  try {
    console.log("ordersCreateWebhookHandler is working from webhook handler");
  } catch (err) {
    console.log(`Failed to process webhook: ${err.message}`);
    if (!res.headersSent) {
      res.status(500).send(e.message);
    }
    console.log("==================================");
    console.log("Failed to ordersCreateWebhookHandler.");
    console.log("==================================", err);
  }
};

export const appUninstalledWebhookHandler = async (_topic, shop, _body) => {
  console.log("appUninstalledWebhookHandler is working");
  await AppInstallations.delete(shop);
};
