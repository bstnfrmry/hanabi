import React from "react";

import DiscardArea from "~/components/discardArea";
import InstructionsArea from "~/components/instructionsArea";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
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

interface IRollbackArea {
  id: "rollback";
  type: ActionAreaType.ROLLBACK;
}

export enum ActionAreaType {
  INSTRUCTIONS,
  OTHER_PLAYER,
  SELF_PLAYER,
  DISCARD,
  MENU,
  ROLLBACK
}

export type ISelectedArea =
  | IInstructionsSelectedArea
  | IOtherPlayerSelectedArea
  | ISelfPlayerSelectedArea
  | IDiscardSelectedArea
  | IMenuArea
  | IRollbackArea;

interface Props {
  interturn: boolean;
  selectedArea: ISelectedArea;
  onSelectDiscard: Function;
  onCloseArea: Function;
  onRollback: Function;
}

export default function ActionArea(props: Props) {
  const {
    selectedArea,
    onSelectDiscard,
    onCloseArea,
    onRollback,
    interturn
  } = props;

  if (selectedArea.type === ActionAreaType.ROLLBACK) {
    return (
      <div className="h-100 flex flex-column items-center justify-center">
        <Txt
          className="w-75"
          size={TxtSize.MEDIUM}
          value="You're about to roll back the last action!"
        />
        <div className="mt4">
          <Button text="Abort" onClick={() => onCloseArea()} />
          <Button
            primary
            className="ml4"
            text="Roll back"
            onClick={() => onRollback()}
          />
        </div>
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.DISCARD) {
    return <DiscardArea onCloseArea={onCloseArea} />;
  }

  return (
    <InstructionsArea interturn={interturn} onSelectDiscard={onSelectDiscard} />
  );
}
