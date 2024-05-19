import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import Button, { ButtonSize } from "~/components/ui/button";

interface Props {
  clearButtonText?: string;
  placeHolderText: string;
  doneButtonText: string;
  initialValue: string;
  onClose: (message: string) => void;
}

// TODO replace ChatPopover with this dialog
export default function TextFieldDialog(props: PropsWithChildren<Props>) {
  const { onClose } = props;

  const messageRef = useRef<HTMLTextAreaElement>();
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
      <textarea
        ref={messageRef}
        className="bw0 f6 w5 pa2 br2"
        placeholder={props.placeHolderText}
        rows={4}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13 /* enter */ && e.metaKey) {
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
