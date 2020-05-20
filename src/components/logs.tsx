import React from "react";
import { useTranslation } from "react-i18next";
import posed, { PoseGroup } from "react-pose";

import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { useReplay } from "~/hooks/replay";

interface Props {
  interturn: boolean;
}

export default function Logs(props: Props) {
  const { interturn } = props;
  const { t } = useTranslation();

  const game = useGame();
  const replay = useReplay();
  const selfPlayer = useSelfPlayer();

  return (
    <div className="flex-grow-1 overflow-y-scroll">
      <div className="relative">
        <PoseGroup>
          {[...game.turnsHistory].reverse().map((turn, i) => {
            const key = game.turnsHistory.length - i;
            const PoseItem = replay.cursor ? posed.div() : Item;

            return (
              <PoseItem key={key}>
                <Turn
                  key={key}
                  showDrawn={!interturn && game.players[turn.action.from].id !== selfPlayer?.id}
                  turn={turn}
                />
              </PoseItem>
            );
          })}
        </PoseGroup>
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

const Item = posed.div({ enter: { y: 0 }, exit: { y: -100 } });
