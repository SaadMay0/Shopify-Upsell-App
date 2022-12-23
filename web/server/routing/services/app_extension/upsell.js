// import express from "express";
// import cors from "cors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
// import fetch from "node-fetch";
// import { GraphQLClient, gql } from "graphql-request";

import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
// import { getProduct } from "../../../shopify/rest_api/product.js";
import "colors";
// import { updateOrder } from "../../../shopify/rest_api/order.js";
// import { FLOAT } from "sequelize/lib/data-types.js";
// import { FLOAT } from "sequelize/lib/data-types.js";
// const { uuidv4 } = uuid

export const offer = async (req, res) => {
  console.log(req.query.shop, "======== offers rout is Working".yellow);
  let shop = req.query.shop;
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const upsellProducts = await db.UpsellProducts.findOne({
    where: { storeId: session.id },
  });

  let shouldRenderWork = true;

  let products = upsellProducts.upsellProductsInfo;
  let nbr = products.length;

  let randomNbr = Math.floor(Math.random() * nbr);

  console.log(randomNbr, "===Befor Prioity".yellow, nbr, products);

  if (products[randomNbr]?.upsellQuantity == 0) {
    products.splice(randomNbr, 1);
    console.log("If condition Pass Level 1".red, products.length, products);
    if (products.length == 0) {
      shouldRenderWork = false;
    }
    randomNbr = Math.floor(Math.random() * products.length);

    if (products[randomNbr]?.upsellQuantity == 0) {
      products.splice(randomNbr, 1);
      console.log("If condition Pass Level 2".cyan, products.length, products);
      if (products.length == 0) {
        shouldRenderWork = false;
      }
      randomNbr = Math.floor(Math.random() * products.length);
      if (products[randomNbr]?.upsellQuantity == 0) {
        products.splice(randomNbr, 1);
        console.log(
          "If condition Pass Level 3".yellow,
          products.length,
          products
        );
        shouldRenderWork = false;
      }
    }
  }

  // let randomNbr = Math.floor(Math.random() * 100);
  //   if (randomNbr<=50) {
  //     const result = upsellProducts.upsellProductsInfo.filter(
  //       (ele, index) => {
  //         if (ele.upsellPriority == "High") {
  //           randomNbr = index;

  //         }
  //         console.log(ele, index,randomNbr,"if condition is Working".bgYellow)
  //       }
  //     );
  //   } else if (randomNbr > 50 && randomNbr <= 80) {
  //     const result = upsellProducts.upsellProductsInfo.filter((ele, index) => {
  //       if (ele.upsellPriority == "Medium") {
  //         randomNbr = index;
  //       }
  //       console.log(ele, index, randomNbr, "else if condition is Working".bgYellow);
  //     });
  //   } else {
  // const result = upsellProducts.upsellProductsInfo.filter((ele, index) => {
  //   if (ele.upsellPriority == "Low") {
  //     randomNbr = index;
  //   }
  //   console.log(ele, index, randomNbr, "else condition is Working".bgYellow);
  // });
  //   }

  // let result = await getProduct(session, "6998702981173");

  console.log(products[randomNbr], "############################".red);

  // const initialData = {
  //   variantId: products[randomNbr].variantId,
  //   productTitle: products[randomNbr].productName,
  //   productImageURL: products[randomNbr].img,
  //   productDescription:
  //     products[randomNbr].productDescription,
  //   originalPrice: products[randomNbr].originalPrice,
  //   discountedPrice:
  //     products[randomNbr].discountedPrice,
  // };

  // console.log(
  //   initialData,
  //   "====>Data For show".bgRed
  //   // upsellProducts.upsellProductsInfo,
  // );

  if (shouldRenderWork) {
    console.log(shouldRenderWork, "shouldRenderWork");
    const initialData = {
      variantId: products[randomNbr]?.variantId,
      productTitle: products[randomNbr]?.productName,
      productImageURL: products[randomNbr]?.img,
      productDescription: products[randomNbr]?.productDescription,
      originalPrice: products[randomNbr]?.originalPrice,
      discountedPrice: products[randomNbr]?.discountedPrice,
    };
    console.log(
      initialData,
      "====>Data For show".bgRed
      // upsellProducts.upsellProductsInfo,
    );
    res.send(initialData);
  } else {
    console.log(shouldRenderWork, "shouldRenderWork");
    res.send(shouldRenderWork);
  }

  // res.send("initialData");
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

export const offerAccept = async (req, res) => {
  console.log(
    req.query.shop,
    req.query.variantId,
    req.query,
    req.params,
    req.body,
    "======== acceptOffer rout is Working".yellow
  );
  let shop = req.query.shop;
  let varId = req.query.variantId;
  let total = req.query.total;
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const [row, created] = await db.UpsellProducts.findOrCreate({
    where: {
      storeId: session.id,
    },
    defaults: {},
  });

  console.log(
    row.upsellProductsInfo,
    "<=====Before Update offerAccept".yellow,
    varId
  );
  if (!created) {
    row.acceptOffer = Number(row.acceptOffer) + 1;
    row.totalOrders = Number(row.totalOrders) + 1;
    row.totalPevenue = parseFloat(row.totalPevenue) + parseFloat(total);
    let updatedUpsellProductInfo = [];

    let product = row.upsellProductsInfo;

    let result = product.map((ele) => {
      if (ele.variantId == varId) {
        console.log(
          ele.variantId,
          "If condition is workin offerAccept".yellow,
          varId,
          parseFloat(row.totalPevenue) + parseFloat(total),
          parseFloat(row.totalPevenue),
          "&&&&&&&&&&",
          parseFloat(total)
        );
        let obj = {
          ...ele,
          upsellQuantity: Number(ele.upsellQuantity) - 1,
          invantryQuantity: Number(ele.invantryQuantity - 1),
        };
        console.log(obj, "<=====Obj Is this offerAccept".red);
        updatedUpsellProductInfo.push({ ...obj });

        // ele.upsellQuantity = Number(ele.upsellQuantity) - 1;
        // ele.invantryQuantity = Number(ele.invantryQuantity-1);
      } else {
        console.log();
        updatedUpsellProductInfo.push({ ...ele });
      }
    });
    row.upsellProductsInfo = updatedUpsellProductInfo;

    await row.save();
    console.log(updatedUpsellProductInfo, "<==== After Update offerAccept");
  }
};
export const offerDecline = async (req, res) => {
  console.log(
    req.query.shop,
    "======== declineOffer rout is Working offerDecline".yellow
  );
  let shop = req.query.shop;
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const [row, created] = await db.UpsellProducts.findOrCreate({
    where: {
      storeId: session.id,
    },
    defaults: {},
  });
  if (!created) {
    row.totalOrders = row.totalOrders + 1;
    row.declineOffer = row.declineOffer + 1;
    await row.save();
  }
};
