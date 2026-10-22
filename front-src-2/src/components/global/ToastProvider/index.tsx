import { ToasterContainer } from "baseui/toast";

import { device } from "@/styles/BreakPoints";

import "./styles.css";

export default function ToastProvider() {
  return (
    <ToasterContainer
      overrides={{
        Root: {
          style: {
            zIndex: "3",
          },
        },

        ToastBody: {
          style: ({ $theme, $kind }) => ({
            backgroundColor:
              $kind === "positive"
                ? "#01ACBC"
                : $kind === "warning"
                  ? "black"
                  : $kind === "negative"
                    ? "#DE1135" // Change to your desired color for negative notifications
                    : $theme.colors.toastInfoBackground, // Default background color
            // Add more custom styles as needed
          }),
          props: {
            className: "toaster-body",
          },
        },
        ToastCloseIcon: {
          props: {
            className: "toast-close-icon",
          },
        },
      }}
      placement={device.md ? "bottomRight" : "bottom"}
      autoHideDuration={2000}
    />
  );
}
