import React from "react";

import { ActionAreaType, ISelectedArea } from "~/components/actionArea";
import OtherPlayerArea from "~/components/otherPlayerArea";
import PlayerGame from "~/components/playerGame";
import SelfPlayerArea from "~/components/selfPlayerArea";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  selectedArea: ISelectedArea;
  onSelectPlayer: Function;
  onNotifyPlayer: Function;
  onReaction: Function;
  onCloseArea: Function;
  onCommitAction: Function;
}

export default function PlayersBoard(props: Props) {
  const {
    selectedArea,
    onSelectPlayer,
    onNotifyPlayer,
    onReaction,
    onCloseArea,
    onCommitAction
  } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();

  const position = selfPlayer ? selfPlayer.index : game.players.length;
  const otherPlayers = [
    ...game.players.slice(position + 1),
    ...game.players.slice(0, position)
  ];

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
      <div className="flex-grow-1">
        <Tutorial step={ITutorialStep.OTHER_PLAYERS}>
          {otherPlayers.map((otherPlayer, i) => (
            <div key={i} className="bb b--yellow">
              {selectedPlayer == otherPlayer && (
                <OtherPlayerArea
                  player={otherPlayer}
                  onCloseArea={onCloseArea}
                  onCommitAction={onCommitAction}
                />
              )}
              {selectedPlayer != otherPlayer && (
                <PlayerGame
                  active={currentPlayer === otherPlayer}
                  id={`player-game-${i + 1}`}
                  player={otherPlayer}
                  onNotifyPlayer={onNotifyPlayer}
                  onSelectPlayer={onSelectPlayer}
                />
              )}
            </div>
          ))}
        </Tutorial>
      </div>
      {selfPlayer && (
        <Tutorial step={ITutorialStep.SELF_PLAYER}>
          <div className="bt b--yellow">
            {selectedPlayer == selfPlayer && (
              <SelfPlayerArea
                cardIndex={cardIndex}
                onCloseArea={onCloseArea}
                onCommitAction={onCommitAction}
              />
            )}
            {selectedPlayer != selfPlayer && (
              <PlayerGame
                active={currentPlayer === selfPlayer}
                id="player-game-self"
                player={selfPlayer}
                self={true}
                onReaction={onReaction}
                onSelectPlayer={onSelectPlayer}
              />
            )}
          </div>
        </Tutorial>
      )}
    </>
  );
}
