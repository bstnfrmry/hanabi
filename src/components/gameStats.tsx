import { groupBy, range } from "lodash";
import React, { useState } from "react";

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

const Colors = {
  Play: "#B7E1BC",
  Discard: "#E9AFC7",
  Other: "#c4c4c4",
  Dangerous: "#820000"
};

function cardToStateColor(
  game: IGameState,
  player: IPlayer,
  card: ICard,
  cardIndex: number
) {
  if (isPlayable(card, game.playedCards)) {
    return Colors.Play;
  }

  if (isCardDangerous(card, game)) {
    return Colors.Dangerous;
  }

  const playedCard = game.playedCards.find(
    c => card.number === c.number && card.color === c.color
  );
  if (playedCard) {
    return Colors.Discard;
  }

  const discardedCardsOfSameColorAndInferiorValue = game.discardPile.filter(
    c => card.number < c.number && card.color === c.color
  );

  if (
    card.color === IColor.MULTICOLOR &&
    discardedCardsOfSameColorAndInferiorValue.length
  ) {
    return Colors.Discard;
  }
  const groupedByNumber = groupBy(
    discardedCardsOfSameColorAndInferiorValue,
    card => card.number
  );
  const allCardsInDiscard = Object.keys(groupedByNumber).find(number => {
    return groupedByNumber[number].length === CountPerNumber[number];
  });
  if (allCardsInDiscard) {
    return Colors.Discard;
  }

  return Colors.Other;
}

export default function GameStats() {
  const game = useGame();
  const [displayCards, setDisplayCards] = useState(false);

  const firstPlayerIndex = game.turnsHistory[0].action.from;
  const orderedPlayers = [
    ...game.players.slice(firstPlayerIndex),
    ...game.players.slice(0, firstPlayerIndex)
  ];

  return (
    <div
      className="flex justify-around w-100"
      onClick={() => setDisplayCards(!displayCards)}
    >
      {orderedPlayers.map((player, playerIndex) => {
        const firstHand = game.history[0].players[playerIndex].hand;

        return (
          <div key={player.id} className="flex flex-column items-center">
            <Txt size={TxtSize.SMALL} value={player.name} />
            <div className="flex justify-between w-100 mh1">
              {firstHand.map((card, cardIndex) => {
                return (
                  <Txt
                    key={cardIndex}
                    className="lavender"
                    size={TxtSize.TINY}
                    style={{ width: "12px", textAlign: "center" }}
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
                        {displayCards && (
                          <Card
                            card={card}
                            context={ICardContext.OTHER}
                            size={CardSize.TINY}
                            style={{ margin: "1px" }}
                          />
                        )}
                        {!displayCards && (
                          <div
                            style={{
                              margin: "1px 1px 0 0",
                              width: "12px",
                              height: "6px",
                              backgroundColor: cardToStateColor(
                                fillEmptyValues(state),
                                playerState,
                                card,
                                cardIndex
                              )
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="flex flex-column w1 nl3" style={{ paddingTop: 30 }}>
        {game.history.map((state, i) => {
          return (
            <div key={i} className="flex relative">
              <div
                className="flex"
                style={{ height: "6px", margin: "1px 1px 0 0" }}
              >
                {range(0, state.tokens.strikes).map(x => {
                  return (
                    <div
                      key={x}
                      className="bg-strikes outline-main-dark absolute flex items-center justify-center br-100 h-100 w-100 mr2"
                      style={{
                        width: "6px",
                        height: "6px",
                        left: `-${x * 2}px`
                      }}
                    />
                  );
                })}
              </div>
              <div
                className="flex"
                style={{ height: "6px", margin: "1px 1px 0 0" }}
              >
                {range(0, state.tokens.hints).map(x => {
                  return (
                    <div
                      key={x}
                      className="bg-hints outline-main-dark absolute flex items-center justify-center br-100 h-100 w-100 mr2"
                      style={{
                        width: "6px",
                        height: "6px",
                        right: `-${8 + x * 2}px`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
