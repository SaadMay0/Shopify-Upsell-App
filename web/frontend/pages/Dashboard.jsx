import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";


import {UpsellProductSection} from "../components/UpsellproductSection.jsx"

export default function Dashboard() {
  return (
    <Page>
      <TitleBar
        title="Dashboard"
        // primaryAction={{
        //   content: "Primary action",
        //   onAction: () => console.log("Primary action"),
        // }}
        // secondaryActions={[
        //   {
        //     content: "Secondary action",
        //     onAction: () => console.log("Secondary action"),
        //   },
        // ]}
      />

      <UpsellProductSection/>
    </Page>
  );
}
