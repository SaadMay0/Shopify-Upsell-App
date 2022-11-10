import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import crypto from "crypto";
import "colors";

export const AppInstallations = {
  includes: async function (shopDomain) {
    const shopSessions =
      await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);
    console.log(
      shopSessions,
      "shopSessions include function is runing From Stroage".bgCyan,
      shopDomain
    );
    if (shopSessions.length > 0) {
      console.log(
        "shopSessions include function is runing with if condiction".bgCyan
      );
      for (const session of shopSessions) {
        if (session.accessToken) return true;
      }
    }

    return false;
  },

  delete: async function (shopDomain) {
    const shopSessions =
      await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);
    await Shopify.Context.SESSION_STORAGE.deleteSession(shopDomain);
    console.log(
      shopDomain,
      "Session Deleted From Stroage".bgCyan,
      shopSessions
    );

    if (shopSessions.length > 0) {
      console.log("shopSessions if condition run".bgCyan);
      await Shopify.Context.SESSION_STORAGE.deleteSessions(
        shopSessions.map((session) => session.id)
      );
    }
  },
};

export const ordersCreateWebhookHandler = async (order, shop) => {
  try {
    await Shopify.Webhooks.Registry.process(req, res);
    console.log(`Webhook processed, returned status code 200`);
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
  await AppInstallations.delete(shop);
};

export const customersDataReqest = async (req, res) => {
  // res.status(200);
  // const bodyString = JSON.stringify(body);
  const { body, headers, rawBody } = req;
  const headerHMAC = headers["x-shopify-hmac-sha256"];
  const shopifyWehookSecretKey = "4e9746ad6ff63fc0bef4fd45ba512679c5a406d052ef958b8228614e7fc4d8f7";// process.env.SHOPIFY_API_SECRET;

  // const providedHmac = Buffer.from(headerHMAC, "utf-8");
  const generatedHash = crypto
    .createHmac("sha256", shopifyWehookSecretKey)
    .update(rawBody, "utf-8")
    .digest("base64");
  
   const againgeneratedHash = crypto
     .createHmac("sha256", shopifyWehookSecretKey)
     .update(rawBody)
     .digest("base64");
    // "utf-8"
  // );

  let hashEquals = Shopify.Utils.safeCompare(generatedHash, headerHMAC);
  console.log(
    "headerHMAC====>",
    headerHMAC,
    "generatedHash===>",
    generatedHash,
    "againgeneratedHash====>",
    againgeneratedHash,
    "====>>>>",
    hashEquals
  );
  // let hashEquals = false;

  // try {
  //   hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
  // } catch (e) {
  //   hashEquals = false;
  //   console.log("Errrorrr = > ", e);
  // }

  // console.log("hash", hashEquals);
  // // console.log(rawBody);

  if (hashEquals) {
    res.status(200).send("ok");
  } else {
    
    res.status(401).send("not okay");
  }
};

export const customersRedact = async (req, res) => {
  const { body, headers, rawBody } = req;
  const headerHMAC = headers["x-shopify-hmac-sha256"];
  const shopifyWehookSecretKey = process.env.SHOPIFY_API_SECRET;

  const providedHmac = Buffer.from(headerHMAC, "utf-8");
  const generatedHash = Buffer.from(
    crypto
      .createHmac("sha256", shopifyWehookSecretKey)
      .update(rawBody)
      .digest("base64"),
    "utf-8"
  );

  let hashEquals = false;

  try {
    hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
  } catch (e) {
    hashEquals = false;
    console.log("Errrorrr = > ", e);
  }

  console.log("hash", hashEquals);
  // console.log(rawBody);

  if (hashEquals) {
    res.status(200);
  }
  res.status(401);  

};

export const shopRedact = async (req, res) => {
    const { body, headers, rawBody } = req;
    const headerHMAC = headers["x-shopify-hmac-sha256"];
    const shopifyWehookSecretKey = process.env.SHOPIFY_API_SECRET;

    const providedHmac = Buffer.from(headerHMAC, "utf-8");
    const generatedHash = Buffer.from(
      crypto
        .createHmac("sha256", shopifyWehookSecretKey)
        .update(rawBody)
        .digest("base64"),
      "utf-8"
    );

    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
      console.log("Errrorrr = > ", e);
    }

    console.log("hash", hashEquals);
    // console.log(rawBody);

    if (hashEquals) {
      res.status(200);
    }
    res.status(401);
};
