import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";

import Txt, { TxtSize } from "~/components/ui/txt";
import { IPlayer } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  player: IPlayer;
}

function percentage(num, den) {
  if (!den) {
    return "-";
  }

  return `${Math.round((num * 100) / den)}%`;
}

const Colors = {
  Play: "#B7E1BC",
  Discard: "#E9AFC7",
  Hint: "#989FC1"
};

export default function PlayerStats(props: Props) {
  const { player } = props;

  const game = useGame();

  const [playsCount, setPlaysCount] = useState(0);
  const [discardsCount, setDiscardsCount] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);

  const playerTurns = game.turnsHistory.filter(
    turn => turn.action.from === player.index
  );

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
    <div className="flex flex-column w4.5">
      {totalCount && (
        <div className="flex mb2" style={{ height: 12, width: "100%" }}>
          <div
            className="h-100"
            style={{
              transition: "all ease-in-out 200ms",
              width: `${(hintsCount * 100) / totalCount}%`,
              backgroundColor: Colors.Hint
            }}
          />
          <div
            className="h-100"
            style={{
              transition: "all ease-in-out 200ms",
              width: `${(discardsCount * 100) / totalCount}%`,
              backgroundColor: Colors.Discard
            }}
          />
          <div
            className="h-100"
            style={{
              transition: "all ease-in-out 200ms",
              width: `${(playsCount * 100) / totalCount}%`,
              backgroundColor: Colors.Play
            }}
          />
        </div>
      )}

      <div className="flex items-center">
        <Txt
          className="flex-grow-1"
          size={TxtSize.SMALL}
          style={{ color: Colors.Hint }}
          value={`Hinted`}
        />
        <Txt className="ml4" size={TxtSize.SMALL} value={`${hintsCount}`} />
        <Txt
          className="ml1 lavender"
          size={TxtSize.TINY}
          value={`· ${percentage(hintsCount, totalCount)}`}
        />
      </div>
      <div className="flex items-center">
        <Txt
          className="flex-grow-1"
          size={TxtSize.SMALL}
          style={{ color: Colors.Discard }}
          value={`Discarded`}
        />
        <Txt className="ml4" size={TxtSize.SMALL} value={`${discardsCount}`} />
        <Txt
          className="ml1 lavender"
          size={TxtSize.TINY}
          value={`· ${percentage(discardsCount, totalCount)}`}
        />
      </div>
      <div className="flex items-center">
        <Txt
          className="flex-grow-1"
          size={TxtSize.SMALL}
          style={{ color: Colors.Play }}
          value={`Played`}
        />
        <Txt className="ml4" size={TxtSize.SMALL} value={`${playsCount}`} />
        <Txt
          className="ml1 lavender"
          size={TxtSize.TINY}
          value={`· ${percentage(playsCount, totalCount)}`}
        />
      </div>
    </div>
  );
}
