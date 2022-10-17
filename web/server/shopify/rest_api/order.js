import { Shopify } from "@shopify/shopify-api";
import { Order } from "@shopify/shopify-api/dist/rest-resources/2022-10/index.js";

// Orders


export const getAllOrders = async (session) => {
  try {
    return await Order.all({
      // limit: 1,
      // offset: 1,
      session: session,
      status: "open",
    });
  } catch (err) {
    console.log(` Catch Error of Get All Orders = ${err.name}`, err);
  }
};

export const getOrder = async (session,id) => {
  try {
    return await Order.find({
      session: session,
      id: id,
    });
  } catch (err) {
    console.log(` Catch Error of Get Order = ${err.name} `, err);
  }
};

export const updateOrder = async (session, id, tag ) => {
  try {
    const order = new Order({ session: session });
    order.id = id;
    order.tags =`${tag}`;
    await order.save({
      update: true,
    });

    return await await order.save({
      update: true,
    });
  } catch (err) {
    console.log(` Catch Error of updateOrder = ${err.name} `, err);
  }
};



