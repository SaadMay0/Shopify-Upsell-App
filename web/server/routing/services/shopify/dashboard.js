import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getProduct } from "../../../shopify/rest_api/product.js";
import "colors";

export const getUpsellProducts = async (req, res) => {
  console.log("getUpsellProducts".yellow);
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const data = await db.UpsellProducts.findOne({
      where: { storeId: session.id },
    });
    res.status(200).send({
      Response: {
        data,
      },
    });
  } catch (err) {
    console.log("Error getUpsellProducts ==> ", err);
  }
};

export const postSelectUpSellProducts = async (req, res) => {
  console.log("selectUpSellProducts is working".yellow);
  try {
    const { upsellProducts } = req.body;

    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    // getProduct;
    let arr = [];
    console.log(
      "Selected Product length is ",
      upsellProducts.length,
      "upsellProducts".bgCyan
    );
    await Promise.all(
      upsellProducts.map(async (ele) => {
        let product = await getProduct(session, ele.id.split("/").pop());
        delete product.session;
        let obj = {
          img: product.image.src,
          productName: product.title,
          selectedVariants: `${ele.variants.length} of ${product.variants.length}`,
          upsellQuantity: ele.upsellQuantity,
          upsellPriority: ele.upsellPriority,
        };
          
        arr.push(obj);
      })
    );

    const [row, created] = await db.UpsellProducts.findOrCreate({
      where: { storeId: session.id },
      defaults: {
        upsellProducts,
        upsellProductsInfo: arr,
        storeId: session.id,
      },
    });
    if (!created) {
      row.upsellProducts = upsellProducts;
      row.upsellProductsInfo = arr;

      await row.save();
    }
    res.status(200).send({
      Response: {
        data: row,
        created,
        arr,
      },
    });
  } catch (err) {
    console.log("Error  postFragile ==> ", err);
  }
};
