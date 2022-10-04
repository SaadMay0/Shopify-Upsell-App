// const express = require("express");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid");
// const fetch = require("node-fetch");
// const { GraphQLClient, gql } = require("graphql-request");

import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import "colors";

export const offer = async (req, res) => {

console.log("======== offer");

    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    

    console.log(session, "======== offer");
      res.status(200).send({
        Responce: {
          result: "SUCCESS",
          data: session,
        },
      });
//   const result = await graphQLClient.request(query, {
//     productId: `gid://shopify/Product/${process.env.PRODUCT_ID}`,
//   });

//   const product = result.product;
//   const variant = result.product.variants.edges[0].node;

//   const initialData = {
//     variantId: variant.id.split("gid://shopify/ProductVariant/")[1],
//     productTitle: product.title,
//     productImageURL: product.featuredImage.url,
//     productDescription: product.descriptionHtml.split(/<br.*?>/),
//     originalPrice: variant.compareAtPrice,
//     discountedPrice: variant.price,
//   };

//   res.send(initialData);
};

export const signChangeset = async (req, res) => {
    console.log("======== signChangeset");
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    
    console.log(session, "======== signChangeset");

  res.status(200).send({
    Responce: {
      result: "SUCCESS",
      data: session,
    },
  });

    //   const decodedToken = jwt.verify(
//     req.body.token,
//     process.env.SHOPIFY_API_SECRET
//   );
//   const decodedReferenceId =
//     decodedToken.input_data.initialPurchase.referenceId;

//   if (decodedReferenceId !== req.body.referenceId) {
//     res.status(400).render();
//   }

//   const payload = {
//     iss: process.env.SHOPIFY_API_KEY,
//     jti: uuidv4(),
//     iat: Date.now(),
//     sub: req.body.referenceId,
//     changes: req.body.changes,
//   };

//   const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);
//   res.json({ token });
};
