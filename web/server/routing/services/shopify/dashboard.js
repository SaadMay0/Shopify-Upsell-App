import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getProduct } from "../../../shopify/rest_api/product.js";
import { getShopData } from "../../../shopify/rest_api/shop.js";
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
    const { upsellProducts, upsellProductsInfo } = req.body;

    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    // getProduct;
    let arr = [];
    console.log(
      "Selected Product length is ".cyan,
      upsellProducts,
      "upsellProducts".bgCyan,
      // session
      upsellProductsInfo,
    );

    let shopData = await getShopData(session)

    // console.log(shopData, "<========Shop data", shopData[0].money_format.split(".").shift());

    await Promise.all(
      upsellProducts.map(async (ele) => {
        const result = upsellProductsInfo.filter(
          (items) => {
            return items.id == ele.id.split("/").pop();
          }

          // {

          // if (items.id == ele.id.split("/").pop()) {

          //   console.log(items,"items from backend".bgCyan);

          //     //  let obj = {
          //     //    id: ele.idid.split("/").pop(),
          //     //    img: product.image.src,
          //     //    productName: product.title,
          //     //    selectedVariants: `${ele.variants.length} of ${product.variants.length}`,
          //     //    upsellQuantity: ele.upsellQuantity,
          //     //    upsellPriority: ele.upsellPriority,
          //     //  };
          //     //  arr.push(obj);
          //   arr.push(items);

          // } else {
          // }

          // }
        );
        if (result.length == 1) {
          console.log(result, "Result from if condition ".yellow);
          arr.push(...result);
        } else {
          let product = await getProduct(session, ele.id.split("/").pop());
          delete product.session;
          // console.log(product,"Cheeck Inventery".red);
          let productImag = product.image ? product.image.src : null;
          let obj = {
            id: ele.id.split("/").pop(),
            img: productImag,
            productName: product.title,
            selectedVariants: `${ele.variants.length} of ${product.variants.length}`,
            upsellQuantity: ele.upsellQuantity,
            upsellPriority: ele.upsellPriority,
            invantryQuantity: product.variants[0].inventory_quantity,
            originalPrice: product.variants[0].compare_at_price,
            discountedPrice: product.variants[0].price,
            productDescription: product.body_html.split(/<br.*?>/),
            variantId: product.variants[0].id,
          };
          arr.push(obj);
        }

        console.log(result, "Result from ".yellow);
      })
    );

    const [row, created] = await db.UpsellProducts.findOrCreate({
      where: { storeId: session.id },
      defaults: {
        storeCurrency: shopData[0].money_format.split(".").shift() || "$",
        upsellProducts,
        upsellProductsInfo: arr,
        storeId: session.id,
      },
    });
    if (!created) {
      row.upsellProducts = upsellProducts;
      row.storeCurrency = shopData[0].money_format.split(".").shift() || "$";
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
