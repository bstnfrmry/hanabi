import React from "react";
import { Trans, useTranslation } from "react-i18next";
import posed, { PoseGroup } from "react-pose";
import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { useReplay } from "~/hooks/replay";
import { IMessage } from "~/lib/state";

interface Props {
  interturn: boolean;
}

export default function Logs(props: Props) {
  const { interturn } = props;
  const { t } = useTranslation();

  const game = useGame();
  const replay = useReplay();
  const selfPlayer = useSelfPlayer();

  const PoseItem = replay.cursor ? posed.div() : Item;
  const firstMessages = game.messages.filter((message) => message.turn === 0).reverse();

  return (
    <div className="flex-grow-1 overflow-y-scroll">
      <div className="relative">
        <PoseGroup>
          {[...game.turnsHistory].reverse().map((turn, i) => {
            const key = game.turnsHistory.length - i;

            const messages = game.messages.filter((message) => message.turn === game.turnsHistory.length - i).reverse();
            const turnNumber = game.turnsHistory.length - i;
            return (
              <PoseItem key={key}>
                {messages.map((message) => {
                  return <Message key={message.id} message={message} />;
                })}
                <Turn
                  key={key}
                  showDrawn={!interturn && game.players[turn.action.from].id !== selfPlayer?.id}
                  turn={turn}
                  turnNumber={turnNumber}
                />
              </PoseItem>
            );
          })}
        </PoseGroup>
        {firstMessages.map((message) => {
          return <Message key={message.id} message={message} />;
        })}

        <Tutorial placement="below" step={ITutorialStep.WELCOME}>
          <Txt
            className="lavender"
            size={TxtSize.SMALL}
            value={game.turnsHistory.length ? t("gameStarted") : t("gameStarts")}
          />
        </Tutorial>
      </div>
    </div>
  );
}

interface MessageProps {
  message: IMessage;
}

function Message(props: MessageProps) {
  const { message } = props;

  const game = useGame();

  const player = game.players[message.from];

  return (
    <div key={message.id} className="lavender">
      <Trans i18nKey="message">
        <Txt size={TxtSize.SMALL} value={player.name} />
        <Txt className="white" size={TxtSize.SMALL} value={message.content} />
      </Trans>
    </div>
  );
}

const Item = posed.div({ enter: { y: 0 }, exit: { y: -100 } });
