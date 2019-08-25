import React from "react";

import { IPlayer } from "~/game/state";
import { isGameOver } from "~/game/actions";
import { useGame } from "~/hooks/game";

import InstructionsArea from "~/components/instructionsArea";
import DiscardArea from "~/components/discardArea";
import OtherPlayerArea from "~/components/otherPlayerArea";
import SelfPlayerArea from "~/components/selfPlayerArea";

interface IInstructionsSelectedArea {
  id: string;
  type: ActionAreaType.INSTRUCTIONS;
}

interface IOtherPlayerSelectedArea {
  id: string;
  type: ActionAreaType.OTHER_PLAYER;
  player: IPlayer;
  cardIndex?: number;
}

interface ISelfPlayerSelectedArea {
  id: string;
  type: ActionAreaType.SELF_PLAYER;
  player: IPlayer;
  cardIndex?: number;
}

interface IDiscardSelectedArea {
  id: string;
  type: ActionAreaType.DISCARD;
}

export enum ActionAreaType {
  INSTRUCTIONS,
  OTHER_PLAYER,
  SELF_PLAYER,
  DISCARD
}

export type ISelectedArea =
  | IInstructionsSelectedArea
  | IOtherPlayerSelectedArea
  | ISelfPlayerSelectedArea
  | IDiscardSelectedArea;

interface Props {
  selectedArea: ISelectedArea;
  onCommitAction: Function;
}

export default function ActionArea(props: Props) {
  const { selectedArea, onCommitAction } = props;

  const game = useGame();

  if (isGameOver(game)) {
    return (
      <div className="pa1 bg-grey pt4 flex-grow-1 f6 f4-l fw2 tracked ttu">
        <p>The game is over! Your score is {game.playedCards.length} 🎉</p>
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.INSTRUCTIONS) {
    return <InstructionsArea />;
  }

  if (selectedArea.type === ActionAreaType.DISCARD) {
    return <DiscardArea />;
  }

  if (selectedArea.type === ActionAreaType.OTHER_PLAYER) {
    return (
      <OtherPlayerArea
        onCommitAction={onCommitAction}
        player={selectedArea.player}
      />
    );
  }

  if (selectedArea.type === ActionAreaType.SELF_PLAYER) {
    return (
      <SelfPlayerArea
        onCommitAction={onCommitAction}
        cardIndex={selectedArea.cardIndex}
      />
    );
  }
}
