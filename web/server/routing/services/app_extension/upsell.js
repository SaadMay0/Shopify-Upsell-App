import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { GraphQLClient, gql } from "graphql-request";

import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getProduct } from "../../../shopify/rest_api/product.js";
import "colors";
// const { uuidv4 } = uuid

export const offer = async (req, res) => {
  console.log(req.query,"======== offer".yellow); 

  const session = await Shopify.Utils.loadOfflineSession("saad-testing-checkout.myshopify.com");
  // const session = await Shopify.Utils.loadCurrentSession(req, res, false);

  let result = await getProduct(session, "6998702981173");
  delete result.session;
  console.log("======== offer".yellow);
  // const result = await graphQLClient.request(query, {
  //   productId: `gid://shopify/Product/${process.env.PRODUCT_ID}`,
  // });

  // const product = result.product;
  // const variant = result.product.variants.edges[0].node;

  const initialData = {
    variantId: result.variants[0].id,
    productTitle: result.title,
    productImageURL: result.image.src,
    productDescription: "product.descriptionHtml.split(/<br.*?>/)",
    originalPrice: result.variants[0].compare_at_price,
    discountedPrice: result.variants[0].price,
  };

  console.log(initialData, "====>Data For show".bgRed);

  res.send(initialData);

};

export const signChangeset = async (req, res) => {

    const decodedToken = jwt.verify(
      req.body.token,
      process.env.SHOPIFY_API_SECRET
    );
    const decodedReferenceId =
      decodedToken.input_data.initialPurchase.referenceId;

    if (decodedReferenceId !== req.body.referenceId) {
      res.status(400).render();
    }

    const payload = {
      iss: process.env.SHOPIFY_API_KEY,
      jti: uuidv4(),
      iat: Date.now(),
      sub: req.body.referenceId,
      changes: req.body.changes,
    };

    const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);
    res.json({ token });
};
