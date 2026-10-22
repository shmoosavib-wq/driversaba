import { Drawer, ANCHOR } from "baseui/drawer";
import { useState } from "react";

import Typography from "@/components/Typography";

import { TitleContainer } from "./style";

import "./style.css";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  closeable?: boolean;
  title?: string;
  height?: string;
}

export default function BottomSheet({
  children,
  isOpen = false,
  onClose,
  closeable = false,
  title = null,
  height = "fit-content",
}: Props) {
  const viewport = window.visualViewport;
  const [viwePortHeight, setviwePortHeight] = useState(viewport.height);
  const [resizeHeight, setResizeHeight] = useState(viewport.height);

  // window.visualViewport.addEventListener("resize", resizeHandler);
  // function resizeHandler() {
  //   if (/iPhone|iPad|iPod/.test(window.navigator.userAgent)) {
  //     setResizeHeight(viewport.height);
  //   }
  // }
  return (
    <Drawer
      isOpen={isOpen}
      autoFocus={false}
      onClose={onClose}
      anchor={ANCHOR.bottom}
      closeable={closeable}
      overrides={{
        DrawerContainer: {
          style: () => ({
            borderTopLeftRadius: "30px",
            borderTopRightRadius: "30px",
            height: height,
            bottom: `${viwePortHeight - resizeHeight}px`,
            overflow: "hidden",
          }),
        },
        DrawerBody: {
          style: () => ({
            marginLeft: "0",
            marginRight: "0",
            marginBottom: "14px",
            marginTop: "16px",
          }),
        },
        Root: {
          style: () => ({
            zIndex: 1,
          }),
        },
      }}>
      {title && (
        <TitleContainer>
          <Typography title={title} type="LabelLarge" />
        </TitleContainer>
      )}
      {children}
    </Drawer>
  );
}
