import * as React from "react";
import { Modal, SIZE, ROLE } from "baseui/modal";

interface Props {
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function ModalKit({ children, isOpen = false, onClose }: Props) {
  return (
    <Modal
      onClose={onClose}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={SIZE.default}
      role={ROLE.dialog}
      overrides={{
        Root: {
          style: () => ({
            zIndex: 1,
          }),
        },
      }}>
      {children}
    </Modal>
  );
}
