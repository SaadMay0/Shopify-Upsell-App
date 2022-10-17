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

// import { trophyImage } from "../assets";

// import { ProductsCard } from "../components";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={null} />
      {/* <Layout> */}
      {/* <Layout.Section> */}
      <Card style={{ height: "50vh" }}>
        <MediaCard
          portrait
          title="Turn your side-project into a business"
          // primaryAction={{
          //   content: "Learn more",
          //   onAction: () => {},
          // }}
          description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
          // popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
        >
          <>
            <video
              width="100%"
              height="350px"
              src="https://www.youtube.com/embed/WCOu61Kndug?start=1"
              autoplay
              controls
            ></video>
          </>
        </MediaCard>
      </Card>
      {/* </Layout.Section> */}
      {/* </Layout> */}
    </Page>
  );
}
