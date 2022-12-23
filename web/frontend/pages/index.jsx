import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  MediaCard,
  VideoThumbnail,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { render } from "react-dom";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="HypeUp" primaryAction={null} />

      <Card style={{ height: "50vh" }}>
        <MediaCard
          portrait
          title="HypeUp App Tutorial"
          description={`Use HypeUp app and increase your sales using the Post-Purchase upsell.`}
        >
          <Card>
            <iframe
              width="100%"
              height="450px"
              src="https://www.youtube.com/embed/WCOu61Kndug"
              title="HypeUp App"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
              allowfullscreen={true}
            ></iframe>
          </Card>
        </MediaCard>
      </Card>
    </Page>
  );
}
