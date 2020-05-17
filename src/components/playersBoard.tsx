import React from "react";
import posed from "react-pose";

import { ActionAreaType, ISelectedArea } from "~/components/actionArea";
import PlayerGame from "~/components/playerGame";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";
import { IColor } from "~/lib/state";

interface Props {
  displayStats: boolean;
  selectedArea: ISelectedArea;
  onSelectPlayer: Function;
  onNotifyPlayer: Function;
  onReaction: Function;
  onCloseArea: Function;
  onCommitAction: Function;
}

const Item = posed.div({
  selected: { height: "auto" },
  notSelected: { height: "auto" },
});

export default function PlayersBoard(props: Props) {
  const { displayStats, selectedArea, onSelectPlayer, onNotifyPlayer, onReaction, onCloseArea, onCommitAction } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();

  const position = selfPlayer ? selfPlayer.index : game.players.length;
  const otherPlayers = [...game.players.slice(position + 1), ...game.players.slice(0, position)];

  let selectedPlayer = null;
  let cardIndex = null;
  if (selectedArea.type === ActionAreaType.SELF_PLAYER) {
    selectedPlayer = selectedArea.player;
    cardIndex = selectedArea.cardIndex;
  }
  if (selectedArea.type === ActionAreaType.OTHER_PLAYER) {
    selectedPlayer = selectedArea.player;
  }

  return (
    <>
      <Tutorial step={ITutorialStep.OTHER_PLAYERS}>
        {otherPlayers.map((otherPlayer, i) => (
          <Item
            key={i}
            className="bb b--yellow bg-main-dark"
            pose={selectedPlayer == otherPlayer ? "selected" : "notSelected"}
          >
            <PlayerGame
              active={currentPlayer === otherPlayer}
              displayStats={displayStats}
              id={`player-game-${i + 1}`}
              player={otherPlayer}
              selected={selectedPlayer && selectedPlayer === otherPlayer}
              onCloseArea={onCloseArea}
              onCommitAction={onCommitAction}
              onNotifyPlayer={onNotifyPlayer}
              onSelectPlayer={onSelectPlayer}
            />
          </Item>
        ))}
      </Tutorial>
      {selfPlayer && (
        <Tutorial step={ITutorialStep.SELF_PLAYER}>
          <div className="mb4">
            <PlayerGame
              active={currentPlayer === selfPlayer}
              cardIndex={cardIndex}
              displayStats={displayStats}
              id="player-game-self"
              player={selfPlayer}
              selected={selectedPlayer && selectedPlayer === selfPlayer}
              self={true}
              onCloseArea={onCloseArea}
              onCommitAction={onCommitAction}
              onReaction={onReaction}
              onSelectPlayer={onSelectPlayer}
            />
          </div>
        </Tutorial>
      )}
    </>
  );
}
