import React from "react";
import Card, { CardContext } from "./card";
import Vignettes from "./vignettes";
import DiscardPile from "./discardPile";

export const ActionAreaType = {
  PLAYER: "player",
  DISCARD: "discard"
};

const colors = ["red", "yellow", "green", "blue", "white"];
const values = [1, 2, 3, 4, 5];

export default ({ game, selectedArea }) => {
  if (!selectedArea) {
    return (
      <div className="ph4 bg-grey bt bg-gray-light b--gray-light pt4 flex-grow-1 f4 fw2 tracked ttu gray">
        Select a player
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.DISCARD) {
    return (
      <div className="pa2 pa4-l bg-gray-light bt b--gray-light flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 gray">
          Discarded cards
        </div>
        <DiscardPile cards={game.discardPile} />
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.PLAYER) {
    const { player } = selectedArea;

    return (
      <div className="pa2 pa4-l bg-gray-light bt b--gray-light flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 gray">
          {player.name}'s game
        </div>
        <div className="flex flex-row pb2">
          {player.hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              position={i}
              size="large"
              context={CardContext.OTHER_PLAYER}
              className="ma1"
            />
          ))}
        </div>
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2 gray">
          Select a hint below
        </div>
        <div className="flex flex-row pb2 ml1">
          <Vignettes
            colors={colors}
            values={values}
            className="flex flex-grow-1"
          />
          <button className="ba br1 pointer fw2 f6 f4-l tracked ttu ml1 gray">
            Give hint
          </button>
        </div>
      </div>
    );
  }
};
