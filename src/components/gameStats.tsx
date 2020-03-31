import { groupBy } from "lodash";
import React from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Txt, { TxtSize } from "~/components/ui/txt";
import {
  commitAction,
  getMaximumPossibleScore,
  getScore,
  isPlayable
} from "~/game/actions";
import { isCardDangerous, isCardDiscardable } from "~/game/ai";
import IGameState, {
  fillEmptyValues,
  ICard,
  IColor,
  IPlayer
} from "~/game/state";
import { useGame } from "~/hooks/game";

const CountPerNumber = { 1: 3, 2: 2, 3: 2, 4: 2, 5: 1 };

function cardToStateColor(
  game: IGameState,
  player: IPlayer,
  card: ICard,
  cardIndex: number
) {
  if (isPlayable(card, game.playedCards)) {
    return "green";
  }

  if (isCardDangerous(card, game)) {
    return "red";
  }

  const playedCard = game.playedCards.find(
    c => card.number === c.number && card.color === c.color
  );
  if (playedCard) {
    return "pink";
  }

  const discardedCardsOfSameColorAndInferiorValue = game.discardPile.filter(
    c => card.number < c.number && card.color === c.color
  );

  if (
    card.color === IColor.MULTICOLOR &&
    discardedCardsOfSameColorAndInferiorValue.length
  ) {
    return "blue";
  }
  const groupedByNumber = groupBy(
    discardedCardsOfSameColorAndInferiorValue,
    card => card.number
  );
  const allCardsInDiscard = Object.keys(groupedByNumber).find(number => {
    return groupedByNumber[number].length === CountPerNumber[number];
  });
  if (allCardsInDiscard) {
    return "blue";
  }

  return "gray";
}

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
              const playerState =
                state.players[
                (playerIndex + state.players.length - 1) %
                state.players.length
                ];

              return (
                <div key={i} className="flex justify-end w-100">
                  {playerState.hand.map((card, cardIndex) => {
                    return (
                      <div key={card.id} className="flex items-center">
                        <Card
                          card={card}
                          context={ICardContext.OTHER}
                          size={CardSize.TINY}
                          style={{ margin: "1px" }}
                        />
                        <div
                          style={{
                            margin: "1px 1px 0 0",
                            width: "15px",
                            height: "15px",
                            backgroundColor: cardToStateColor(
                              fillEmptyValues(state),
                              playerState,
                              card,
                              cardIndex
                            )
                          }}
                        ></div>
                      </div>
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
