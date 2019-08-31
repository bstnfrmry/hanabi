import React from "react";

import DiscardArea from "~/components/discardArea";
import GameOverArea from "~/components/gameOverArea";
import InstructionsArea from "~/components/instructionsArea";
import OtherPlayerArea from "~/components/otherPlayerArea";
import SelfPlayerArea from "~/components/selfPlayerArea";
import { isGameOver } from "~/game/actions";
import { IPlayer } from "~/game/state";
import { useGame } from "~/hooks/game";

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

interface IMenuArea {
  id: string;
  type: ActionAreaType.MENU;
}

export enum ActionAreaType {
  INSTRUCTIONS,
  OTHER_PLAYER,
  SELF_PLAYER,
  DISCARD,
  MENU
}

export type ISelectedArea =
  | IInstructionsSelectedArea
  | IOtherPlayerSelectedArea
  | ISelfPlayerSelectedArea
  | IDiscardSelectedArea
  | IMenuArea;

interface Props {
  selectedArea: ISelectedArea;
  onCommitAction: Function;
  onSelectDiscard: Function;
  onCloseArea: Function;
  onImpersonate: Function;
}

export default function ActionArea(props: Props) {
  const {
    selectedArea,
    onCommitAction,
    onSelectDiscard,
    onCloseArea,
    onImpersonate
  } = props;

  const game = useGame();

  if (isGameOver(game)) {
    return <GameOverArea />;
  }

  if (selectedArea.type === ActionAreaType.INSTRUCTIONS) {
    return <InstructionsArea onSelectDiscard={onSelectDiscard} />;
  }

  if (selectedArea.type === ActionAreaType.DISCARD) {
    return <DiscardArea onCloseArea={onCloseArea} />;
  }

  if (selectedArea.type === ActionAreaType.OTHER_PLAYER) {
    return (
      <OtherPlayerArea
        player={selectedArea.player}
        onCloseArea={onCloseArea}
        onCommitAction={onCommitAction}
        onImpersonate={onImpersonate}
      />
    );
  }

  if (selectedArea.type === ActionAreaType.SELF_PLAYER) {
    return (
      <SelfPlayerArea
        cardIndex={selectedArea.cardIndex}
        onCloseArea={onCloseArea}
        onCommitAction={onCommitAction}
      />
    );
  }
}
