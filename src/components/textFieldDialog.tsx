import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import Button, { ButtonSize } from "~/components/ui/button";

interface Props {
  clearButtonText?: string;
  placeHolderText: string;
  doneButtonText: string;
  initialValue: string;
  onClose: (message: string) => void;
}

export default function TextFieldDialog(props: PropsWithChildren<Props>) {
  const { onClose } = props;

  const messageRef = useRef<HTMLInputElement>();
  const [message, setMessage] = useState<undefined | string>();
  useEffect(() => {
    if (message === undefined) {
      setMessage(props.initialValue);
    }
  });

  useEffect(() => {
    messageRef.current?.focus();
  }, [messageRef]);

  function onSubmit() {
    const m = message;
    setMessage(undefined);
    onClose(m);
  }

  return (
    <form
      className="flex flex-column items-center justify-start b--yellow ba bw1 bg-white pa1 br2 gray"
      onKeyPress={(e) => {
        if (e.key === "Enter" && (e.getModifierState("Shift") || e.getModifierState("Control"))) {
          onSubmit();
        }
      }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {props.children}
      <input
        ref={messageRef}
        className="bw0 f6 w5 pa2 br2"
        placeholder={props.placeHolderText}
        type="text"
        value={message === undefined ? props.initialValue : message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "ENTER") {
            onSubmit();
          }
        }}
      />
      <div className={"mt1 flex flex-row justify-between w-100"}>
        {props.clearButtonText ? (
          <Button size={ButtonSize.SMALL} text={props.clearButtonText} type={"button"} onClick={() => setMessage("")} />
        ) : null}
        <Button size={ButtonSize.SMALL} text={props.doneButtonText} type="submit" />
      </div>
    </form>
  );
}
