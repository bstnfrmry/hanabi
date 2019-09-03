import React from "react";

import DiscardArea from "~/components/discardArea";
import InstructionsArea from "~/components/instructionsArea";
import OtherPlayerArea from "~/components/otherPlayerArea";
import SelfPlayerArea from "~/components/selfPlayerArea";
import { IPlayer } from "~/game/state";

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

interface IInstructionsSelectedArea {
  id: "instructions";
  type: ActionAreaType.INSTRUCTIONS;
}

interface IDiscardSelectedArea {
  id: "discard";
  type: ActionAreaType.DISCARD;
}

interface IMenuArea {
  id: "menu";
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
  onTurnPeak: (turn: number) => void;
}

export default function ActionArea(props: Props) {
  const {
    selectedArea,
    onCommitAction,
    onSelectDiscard,
    onCloseArea,
    onImpersonate,
    onTurnPeak
  } = props;

  if (selectedArea.type === ActionAreaType.INSTRUCTIONS) {
    return (
      <InstructionsArea
        onSelectDiscard={onSelectDiscard}
        onTurnPeak={onTurnPeak}
      />
    );
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
