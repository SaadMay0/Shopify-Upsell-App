import { Banner, Frame, Card } from "@shopify/polaris";
export function BannerComponent({
  active,
  title,
  status,
  toggleActive,
  Description,
}) {
  console.log(active, "****Banner****");
  return active ? (
    <Banner
      title={title}
      status={status}
      action={{ content: "Print label" }}
      onDismiss={() => {
        toggleActive();
      }}
    >
      {Description}
    </Banner>
  ) : null;
}
