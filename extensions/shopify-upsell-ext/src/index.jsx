/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 *
 *  1. ShouldRender - Called first, during the checkout process, when the
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */

import React from "react";
import { useEffect, useState } from "react";
import {
  extend,
  render,
  useExtensionInput,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Text,
  TextContainer,
  Separator,
  Tiles,
  TextBlock,
  Layout,
} from "@shopify/post-purchase-ui-extensions-react";
// import { ImageMajor } from "@shopify/polaris-icons";
/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */

extend(
  "Checkout::PostPurchase::ShouldRender",
  async ({ storage, inputData }) => {
    let shop = inputData.shop.domain;
    // let render = true;
    const postPurchaseOffer = await fetch(
      // `https://hypeup-app-w5hlofsvsa-uc.a.run.app/api/offer?shop=${shop}`
      `https://17cd-110-39-147-226.ngrok.io/api/offer?shop=${shop}`
    ).then((res) => {
      console.log(res, "------postPurchaseOffer------");
      return res.json();
    });

    console.log(storage, "env File cheeck", inputData);

    if (postPurchaseOffer) {
      console.log(postPurchaseOffer, "Passs If condition postPurchaseOffer");

      await storage.update(postPurchaseOffer);
      return {render:true};
    } else {
      console.log("Fail If condition postPurchaseOffer");
      return {render:false};
    }


  }
);

/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of remote UI components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render("Checkout::PostPurchase::Render", () => <App />);

export function App() {
  const { storage, inputData, calculateChangeset, applyChangeset, done, shop } =
    useExtensionInput();
  const [loading, setLoading] = useState(true);
  const [calculatedPurchase, setCalculatedPurchase] = useState();

  let shopName = inputData.shop.domain;
  useEffect(() => {
    async function calculatePurchase() {
      // Request Shopify to calculate shipping costs and taxes for the upsell
      const result = await calculateChangeset({ changes });

      setCalculatedPurchase(result.calculatedPurchase);
      setLoading(false);
      console.log(storage, inputData, shop, "=======UseEffect Result======");
    }

    calculatePurchase();
  }, []);

  const { variantId, productTitle, productImageURL, productDescription } =
    storage.initialData;
  
  console.log(
    variantId,
    productTitle,
    productImageURL,
    "calculatedPurchase===>",
    calculatedPurchase,
    " storage=====>",
    storage,
    " inputData====>",
    inputData
  );

  const changes = [{ type: "add_variant", variantId, quantity: 1 }];

  // Extract values from the calculated purchase
  const shipping =
    calculatedPurchase?.addedShippingLines[0]?.priceSet?.presentmentMoney
      ?.amount;
  const taxes =
    calculatedPurchase?.addedTaxLines[0]?.priceSet?.presentmentMoney?.amount;
  const total = calculatedPurchase?.totalOutstandingSet.presentmentMoney.amount;
  const discountedPrice =
    calculatedPurchase?.updatedLineItems[0].totalPriceSet.presentmentMoney
      .amount;
  const originalPrice =
    calculatedPurchase?.updatedLineItems[0].priceSet.presentmentMoney.amount;
  
  const currency =
    calculatedPurchase?.updatedLineItems[0].priceSet.presentmentMoney
      .currencyCode;

  async function acceptOffer() {
    setLoading(true);

    // Make a request to your app server to sign the changeset
    const token = await fetch(
      // "https://hypeup-app-w5hlofsvsa-uc.a.run.app/api/sign-changeset",
      "https://17cd-110-39-147-226.ngrok.io/api/sign-changeset",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: inputData.initialPurchase.referenceId,
          changes: changes,
          token: inputData.token,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response,"Post Method For Aplly Change set");
        return response.token;
      });

    // Make a request to Shopify servers to apply the changeset
    await applyChangeset(token);

    // console.log(token, "------applyChangeset11111-------", inputData.token);

    // Redirect to the thank-you page
    done();
  }
  // console.log( "------applyChangeset-------", inputData.token);
  async function updateData(total, variantId) {
    const token = await fetch(
      // `https://hypeup-app-w5hlofsvsa-uc.a.run.app/api/offerAccept?shop=${shopName}`,
      `https://17cd-110-39-147-226.ngrok.io/api/offerAccept?shop=${shopName}&variantId=${variantId}&total=${total}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total,
          variantId,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response,"Post Method For Aplly Change set");
        return response.token;
      });
  }

  async function updateDataAtDecline() {
    const token = await fetch(
      // `https://hypeup-app-w5hlofsvsa-uc.a.run.app/api/offerDecline?shop=${shopName}`,
      `https://17cd-110-39-147-226.ngrok.io/api/offerDecline?shop=${shopName}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({
        //   total,
        //   variantId,
        // }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response,"Post Method For Aplly Change set");
        return response.token;
      });
  }

  function declineOffer() {
    updateDataAtDecline();
    setLoading(true);
    done();
  }

  return (
    <BlockStack spacing="loose">
      <CalloutBanner>
        <BlockStack spacing="tight">
          <TextContainer>
            <Text size="medium" emphasized>
              It&#39;s not too late to add this to your order
            </Text>
          </TextContainer>
          <TextContainer>
            <Text size="medium">Add the {productTitle} to your order and </Text>
            <Text size="medium" emphasized>
              get Free Shipping
            </Text>
          </TextContainer>
        </BlockStack>
      </CalloutBanner>
      <Layout
        media={[
          { viewportSize: "small", sizes: [1, 0, 1], maxInlineSize: 0.9 },
          { viewportSize: "medium", sizes: [532, 0, 1], maxInlineSize: 420 },
          { viewportSize: "large", sizes: [560, 38, 340] },
        ]}
      >
        <Image description="product photo" source={productImageURL} />
        <BlockStack />
        <BlockStack>
          <Heading>{productTitle}</Heading>
          <PriceHeader
            discountedPrice={discountedPrice}
            originalPrice={originalPrice}
            loading={!calculatedPurchase}
            currency={currency}
          />
          {/* <ProductDescription textLines={productDescription} /> */}
          <BlockStack spacing="tight">
            <Separator />
            <MoneyLine
              label="Subtotal"
              amount={discountedPrice}
              loading={!calculatedPurchase}
              currency={currency}
            />
            <MoneyLine
              label="Shipping"
              amount={shipping}
              loading={!calculatedPurchase}
              currency={currency}
            />
            <MoneyLine
              label="Taxes"
              amount={taxes}
              loading={!calculatedPurchase}
              currency={currency}
            />
            <Separator />
            <MoneySummary
              label="Total"
              amount={total}
              loading={!calculatedPurchase}
              currency={currency}
            />
          </BlockStack>
          <BlockStack>
            <Button
              onPress={() => {
                console.log("****",total, variantId,"Purchase*****");
                updateData(total, variantId), acceptOffer(); 
              }}
              submit
              loading={loading}
            >
              Buy now · {formatCurrency(total, currency)}
            </Button>
            <Button onPress={declineOffer} subdued loading={loading}>
              Decline this offer
            </Button>
          </BlockStack>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
}

function PriceHeader({ discountedPrice, originalPrice, loading, currency }) {
  return (
    <TextContainer alignment="leading" spacing="loose">
      <Text role="deletion" size="large">
        {!loading && formatCurrency(originalPrice, currency)}
      </Text>
      <Text emphasized size="large" appearance="critical">
        {" "}
        {!loading && formatCurrency(discountedPrice, currency)}
      </Text>
    </TextContainer>
  );
}

function ProductDescription({ textLines }) {
  return (
    <BlockStack spacing="xtight">
      {textLines.map((text, index) => (
        <TextBlock key={index} subdued>
          {text}
        </TextBlock>
      ))}
    </BlockStack>
  );
}

function MoneyLine({ label, amount, loading = false, currency }) {
  return (
    <Tiles>
      <TextBlock size="small">{label}</TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="small">
          {loading ? "-" : formatCurrency(amount, currency)}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
}

function MoneySummary({ label, amount, currency }) {
  return (
    <Tiles>
      <TextBlock size="medium" emphasized>
        {label}
      </TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="medium">
          {formatCurrency(amount, currency)}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
}

function formatCurrency(amount, currency) {
  if (!amount || parseInt(amount, 10) === 0) {
    return "Free";
  }
  return `${currency} ${amount}`;
}
