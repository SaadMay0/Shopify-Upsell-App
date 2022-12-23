import { Shopify } from "@shopify/shopify-api";
import { Shop } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";

// Orders

export const getShopData = async (session) => {
    try {
      console.log("***Shop Data is Working***");
    return await Shop.all({
      session: session,
    });
  } catch (err) {
    console.log(` Catch Error of Get Shop DAta = ${err.name}`, err);
  }
};


