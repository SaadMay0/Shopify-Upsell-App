import { Shopify } from "@shopify/shopify-api";
import crypto from "crypto";

export const customersDataReqest = async (req, res) => {
  console.log(" customersDataReqest res.send 200");
  res.status(200).send({});
};

export const customersRedact = async (req, res) => {
  console.log("customersRedact res.send 200");
  res.status(200).send({});
};

export const shopRedact = async (req, res) => {
  console.log("shopRedact res.send 200");
  res.status(200).send({});
};
