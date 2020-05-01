import classnames from "classnames";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";

import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { IPlayer } from "~/lib/state";

interface Props {
  player: IPlayer;
  className?: string;
}

export function percentage(num: number, den: number) {
  if (!den) {
    return "-";
  }

  return `${Math.round((num * 100) / den)}%`;
}

const Colors = {
  Play: "#B7E1BC",
  Discard: "#E9AFC7",
  Hint: "#989FC1",
};

export default function PlayerStats(props: Props) {
  const { player, className } = props;

  const game = useGame();

  const [playsCount, setPlaysCount] = useState(0);
  const [discardsCount, setDiscardsCount] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);

  const playerTurns = game.turnsHistory.filter(turn => turn.action.from === player.index);

  const groupedTurns = groupBy(playerTurns, turn => turn.action.action);

  const totalCount = playerTurns.length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaysCount((groupedTurns["play"] || []).length);
      setDiscardsCount((groupedTurns["discard"] || []).length);
      setHintsCount((groupedTurns["hint"] || []).length);
    });

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={classnames("flex flex-column", className)}>
      {totalCount && (
        <div className="flex mb2" style={{ height: 10, width: "100%" }}>
          <div
            className="h-100"
            style={{
              transition: "all ease-in-out 200ms",
              width: `${(hintsCount * 100) / totalCount}%`,
              backgroundColor: Colors.Hint,
            }}
          />
          <div
            className="h-100"
            style={{
              transition: "all ease-in-out 200ms",
              width: `${(discardsCount * 100) / totalCount}%`,
              backgroundColor: Colors.Discard,
            }}
          />
          <div
            className="h-100"
            style={{
              transition: "all ease-in-out 200ms",
              width: `${(playsCount * 100) / totalCount}%`,
              backgroundColor: Colors.Play,
            }}
          />
        </div>
      )}

      <div className="flex items-center">
        <Txt className="flex-grow-1" size={TxtSize.SMALL} style={{ color: Colors.Hint }} value={`Hinted`} />
        <Txt className="ml4" size={TxtSize.SMALL} value={`${hintsCount}`} />
        <Txt
          className="ml1 lavender w2 nowrap"
          size={TxtSize.XSMALL}
          value={`· ${percentage(hintsCount, totalCount)}`}
        />
      </div>
      <div className="flex items-center">
        <Txt className="flex-grow-1" size={TxtSize.SMALL} style={{ color: Colors.Discard }} value={`Discarded`} />
        <Txt className="ml4" size={TxtSize.SMALL} value={`${discardsCount}`} />
        <Txt
          className="ml1 lavender w2 nowrap"
          size={TxtSize.XSMALL}
          value={`· ${percentage(discardsCount, totalCount)}`}
        />
      </div>
      <div className="flex items-center">
        <Txt className="flex-grow-1" size={TxtSize.SMALL} style={{ color: Colors.Play }} value={`Played`} />
        <Txt className="ml4" size={TxtSize.SMALL} value={`${playsCount}`} />
        <Txt
          className="ml1 lavender w2 nowrap"
          size={TxtSize.XSMALL}
          value={`· ${percentage(playsCount, totalCount)}`}
        />
      </div>
    </div>
  );
}
