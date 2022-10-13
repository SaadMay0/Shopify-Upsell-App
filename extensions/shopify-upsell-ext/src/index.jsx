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
    const postPurchaseOffer = await fetch(
      `https://6269-110-39-147-226.ngrok.io/api/offer?shop=${shop}`
    ).then((res) => {
      // console.log(res, "------postPurchaseOffer------");
      return res.json();
    });

    console.log(storage,"env File cheeck");

    await storage.update(postPurchaseOffer);

    return { render: true };
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

  useEffect(() => {
    async function calculatePurchase() {
      // Request Shopify to calculate shipping costs and taxes for the upsell
      const result = await calculateChangeset({ changes });

      setCalculatedPurchase(result.calculatedPurchase);
      setLoading(false);
      console.log(result, "=======UseEffect Result======");
    }

    calculatePurchase();
  }, []);

  const { variantId, productTitle, productImageURL, productDescription } =
    storage.initialData;

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

  async function acceptOffer() {
    setLoading(true);

    // Make a request to your app server to sign the changeset
    const token = await fetch(
      "https://6269-110-39-147-226.ngrok.io/api/sign-changeset",
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

  function declineOffer() {
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
              save 15%.
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
          />
          {/* <ProductDescription textLines={productDescription} /> */}
          <BlockStack spacing="tight">
            <Separator />
            <MoneyLine
              label="Subtotal"
              amount={discountedPrice}
              loading={!calculatedPurchase}
            />
            <MoneyLine
              label="Shipping"
              amount={shipping}
              loading={!calculatedPurchase}
            />
            <MoneyLine
              label="Taxes"
              amount={taxes}
              loading={!calculatedPurchase}
            />
            <Separator />
            <MoneySummary
              label="Total"
              amount={total}
              loading={!calculatedPurchase}
            />
          </BlockStack>
          <BlockStack>
            <Button onPress={acceptOffer} submit loading={loading}>
              Pay now · {formatCurrency(total)}
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

function PriceHeader({ discountedPrice, originalPrice, loading }) {
  return (
    <TextContainer alignment="leading" spacing="loose">
      <Text role="deletion" size="large">
        {!loading && formatCurrency(originalPrice)}
      </Text>
      <Text emphasized size="large" appearance="critical">
        {" "}
        {!loading && formatCurrency(discountedPrice)}
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

function MoneyLine({ label, amount, loading = false }) {
  return (
    <Tiles>
      <TextBlock size="small">{label}</TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="small">
          {loading ? "-" : formatCurrency(amount)}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
}

function MoneySummary({ label, amount }) {
  return (
    <Tiles>
      <TextBlock size="medium" emphasized>
        {label}
      </TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="medium">
          {formatCurrency(amount)}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
}

function formatCurrency(amount) {
  if (!amount || parseInt(amount, 10) === 0) {
    return "Free";
  }
  return `$${amount}`;
}
