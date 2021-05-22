import React, { ReactNode } from "react";
import ReactModal from "react-modal";
import Button from "~/components/ui/button";

interface Props extends ReactModal.Props {
  children: ReactNode;
}

ReactModal.setAppElement("#__next");

export function Modal(props: Props) {
  const { children, onRequestClose, ...rest } = props;

  return (
    <ReactModal
      {...rest}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      style={{
        overlay: {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          position: "relative",
          backgroundColor: "var(--color-main-dark)",
          borderColor: "var(--color-yellow)",
          minWidth: "300px",
          maxHeight: "90vh",
          maxWidth: "90vw",
          left: "auto",
          right: "auto",
          top: "auto",
          bottom: "auto",
        },
      }}
    >
      <div className="bg-main-dark">
        {onRequestClose && <Button void className="absolute right-1 top-1" text="&times;" onClick={onRequestClose} />}

        {children}
      </div>
      <style global jsx>
        {`
          .ReactModal__Overlay {
            z-index: 9999;
          }
        `}
      </style>
    </ReactModal>
  );
}
