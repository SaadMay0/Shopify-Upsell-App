import { Toast, Frame } from "@shopify/polaris";

export function ToastComponent({ toggleActive, active, content, error }) {
  const toastMarkup = active ? (
    <Toast
      content={content}
      error={error}
      duration={4000}
      onDismiss={toggleActive}
    />
  ) : null;

  return <Frame>{toastMarkup}</Frame>;
}
