import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonSize } from "~/components/ui/button";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { sendMessage } from "~/lib/actions";
import { updateGame } from "~/lib/firebase";
import { uniqueId } from "~/lib/id";

interface Props {
  onClose: Function;
}

export default function ChatPopover(props: Props) {
  const { onClose } = props;

  const { t } = useTranslation();
  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const messageRef = useRef<HTMLTextAreaElement>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    messageRef.current?.focus();
  }, [messageRef]);

  return (
    <form
      className="flex flex-column items-center justify-center b--yellow ba bw1 bg-white pa1 br2 gray"
      onSubmit={e => {
        e.preventDefault();

        const newGame = sendMessage(game, {
          id: uniqueId(),
          content: message,
          from: selfPlayer.index,
          turn: game.turnsHistory.length,
        });
        updateGame(newGame);

        setMessage("");
        onClose();
      }}
    >
      <textarea
        ref={messageRef}
        className="bw0 f6 w5 pa2"
        placeholder={t("sendMessagePlaceholder")}
        rows={4}
        value={message}
        onChange={e => {
          setMessage(e.target.value);
        }}
      />
      <Button className="mt2 self-end" size={ButtonSize.SMALL} text={t("sendMessage")} type="submit" />
    </form>
  );
}
