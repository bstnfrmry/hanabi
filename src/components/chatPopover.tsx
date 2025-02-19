import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonSize } from "~/components/ui/button";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { sendMessage } from "~/lib/actions";
import { updateGame } from "~/lib/firebase";
import { uniqueId } from "~/lib/id";
import { logFailedPromise } from "~/lib/errors";

interface Props {
  onClose: () => void;
  style: CSSProperties;
}

export default function ChatPopover(props: Props) {
  const { onClose } = props;

  const { t } = useTranslation();
  const game = useGame();
  const selfPlayer = useSelfPlayer(game);
  const messageRef = useRef<HTMLTextAreaElement>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    messageRef.current?.focus();
  }, [messageRef]);

  function onSubmit() {
    const newGame = sendMessage(game, {
      id: uniqueId(),
      content: message,
      from: selfPlayer.index,
      turn: game.turnsHistory.length,
    });
    updateGame(newGame).catch(logFailedPromise);

    setMessage("");
    onClose();
  }

  return (
    <form
      className="flex flex-column items-center justify-center ba bw1 bg-white pa1 br2 gray"
      style={props.style}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <textarea
        ref={messageRef}
        className="bw0 f6 w5 pa2 br2"
        placeholder={t("sendMessagePlaceholder")}
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
      <Button className="mt1 self-end" size={ButtonSize.SMALL} text={t("sendMessage")} type="submit" />
    </form>
  );
}
