import { Shopify } from "@shopify/shopify-api";
import crypto from "crypto";
export const rawBodyHandler = (req, res, next) => {
  try {
    req.rawBody = "";
    // req.setEncoding("utf8");
    console.log("webhook middleware");
    req
      .on("data", (chunk) => {
        console.log("receiving webhook data");
        req.rawBody += chunk;
      })
      .on("end", () => {
        console.log("webhook data received..");
        next();
      });
    // next();
    console.log("rawBodyHandler is working");
  } catch (err) {
    console.log("rawBodyHandler Error", err);
  }
};

export const verifyHMC = (req, res, next) => {
  try {
    console.log("verifyHMC is working");
    const { body, headers, rawBody } = req;
    const headerHMAC = headers["x-shopify-hmac-sha256"];
    const shopifyWehookSecretKey = process.env.SHOPIFY_API_SECRET;

    const generatedHash = crypto
      .createHmac("sha256", shopifyWehookSecretKey)
      .update(rawBody, "utf-8")
      .digest("base64");
    
    // console.log("=====================================================");

    // console.log(body ,"rawBody".red,rawBody);
    // console.log("=====================================================");

    
    // console.log(headerHMAC, "*******", generatedHash);

    let hashEquals = Shopify.Utils.safeCompare(generatedHash, headerHMAC);

    if (hashEquals) {
      console.log("verifyHMC True");
      next();
    } else {
      res.status(401).send({});
      console.log("verifyHMC false");
    }
  } catch (err) {
    console.log("verifyHMC middleware Error", err);
  }
};
