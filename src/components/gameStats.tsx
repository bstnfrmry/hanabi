import React from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";

export default function GameStats() {
  const game = useGame();

  const firstPlayerIndex = game.turnsHistory[0].action.from;
  const orderedPlayers = [
    ...game.players.slice(firstPlayerIndex),
    ...game.players.slice(0, firstPlayerIndex)
  ];

  return (
    <div className="flex justify-between w-100">
      {orderedPlayers.map((player, playerIndex) => {
        const firstHand = game.history[0].players[playerIndex].hand;

        return (
          <div key={player.id} className="mh1 flex flex-column items-center">
            <Txt size={TxtSize.SMALL} value={player.name} />
            <div className="flex justify-between w-100 mh1">
              {firstHand.map((card, cardIndex) => {
                return (
                  <Txt
                    key={cardIndex}
                    className="lavender"
                    size={TxtSize.SMALL}
                    value={PositionMap[cardIndex]}
                  />
                );
              })}
            </div>
            {game.history.map((state, i) => {
              const playerState = state.players[playerIndex];

              return (
                <div key={i} className="flex justify-end w-100">
                  {playerState.hand.map(card => {
                    return (
                      <Card
                        key={card.id}
                        card={card}
                        context={ICardContext.OTHER}
                        size={CardSize.TINY}
                        style={{ margin: "1px" }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
