import { groupBy, range } from "lodash";
import React, { useState } from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import useLongPress from "~/hooks/longPress";
import { getStateAtTurn, isPlayable } from "~/lib/actions";
import { isCardDangerous } from "~/lib/ai";
import IGameState, { fillEmptyValues, ICard, IColor, IInsightColor, IPlayer, ITurn } from "~/lib/state";

const CountPerNumber = { 1: 3, 2: 2, 3: 2, 4: 2, 5: 1 };

function turnToStateColor(turn: ITurn) {
  const { action } = turn.action;

  return {
    discard: IInsightColor.Discard,
    play: IInsightColor.Play,
    hint: IInsightColor.Hint,
  }[action];
}

function cardToStateColor(game: IGameState, player: IPlayer, card: ICard) {
  if (isPlayable(card, game.playedCards) && isCardDangerous(card, game)) {
    return [IInsightColor.Dangerous, IInsightColor.Play];
  }

  if (isPlayable(card, game.playedCards)) {
    return [IInsightColor.Play];
  }

  if (isCardDangerous(card, game)) {
    return [IInsightColor.Dangerous];
  }

  const playedCard = game.playedCards.find(c => card.number === c.number && card.color === c.color);
  if (playedCard) {
    return [IInsightColor.Discard];
  }

  const discardedCardsOfSameColorAndInferiorValue = game.discardPile.filter(
    c => card.number < c.number && card.color === c.color
  );

  if (card.color === IColor.MULTICOLOR && discardedCardsOfSameColorAndInferiorValue.length) {
    return [IInsightColor.Discard];
  }
  const groupedByNumber = groupBy(discardedCardsOfSameColorAndInferiorValue, card => card.number);
  const allCardsInDiscard = Object.keys(groupedByNumber).find(number => {
    return groupedByNumber[number].length === CountPerNumber[number];
  });
  if (allCardsInDiscard) {
    return [IInsightColor.Discard];
  }

  return [IInsightColor.Other];
}

interface CardStateProps {
  colors: string[];
}

function CardState(props: CardStateProps) {
  const { colors } = props;

  return (
    <div
      className="relative br1"
      style={{
        margin: "1px",
        width: "20px",
        height: "20px",
        backgroundColor: colors[0],
      }}
    >
      <div
        className="absolute br1"
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "20px 20px 0 0",
          borderColor: `${colors[0]} transparent transparent transparent`,
        }}
      />
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 0 20px 20px",
          borderColor: `transparent transparent ${colors[1] || colors[0]} transparent`,
        }}
      />
    </div>
  );
}

interface LegendProps {
  text: string;
  backgroundColor: string;
  secondaryBackgroundColor?: string;
}

function BarLegend(props: LegendProps) {
  const { text, backgroundColor, secondaryBackgroundColor } = props;

  return (
    <div className="flex items-center" style={{ marginTop: "2px", marginBottom: "2px" }}>
      <div className="flex items-center" style={{ height: "8px", width: "20px" }}>
        <div className="flex-1 h-100 br1" style={{ backgroundColor }} />
        {secondaryBackgroundColor && (
          <div className="flex-1 h-100 br1" style={{ backgroundColor: secondaryBackgroundColor }} />
        )}
      </div>
      <Txt className="ml3" size={TxtSize.XSMALL} value={text} />
    </div>
  );
}

function DotLegend(props: LegendProps) {
  const { text, backgroundColor } = props;

  return (
    <div className="flex items-center" style={{ marginTop: "2px", marginBottom: "2px" }}>
      <Dot backgroundColor={backgroundColor} />
      <Txt className="ml3" size={TxtSize.XSMALL} value={text} />
    </div>
  );
}

interface DotProps {
  backgroundColor: string;
  size?: number;
}

function Dot(props: DotProps) {
  const { backgroundColor, size = 8 } = props;
  const cssSize = `${size}px`;

  return <div style={{ width: cssSize, height: cssSize, borderRadius: "50%", backgroundColor }} />;
}

export default function GameStats() {
  const game = useGame();
  const [displayCards, setDisplayCards] = useState(false);
  const longPressProps = useLongPress(() => {
    setDisplayCards(!displayCards);
  });

  if (!game.turnsHistory.length) {
    return null;
  }

  const firstPlayerIndex = game.turnsHistory[0].action.from;
  const orderedPlayers = [...game.players.slice(firstPlayerIndex), ...game.players.slice(0, firstPlayerIndex)];

  return (
    <div className="flex flex-column">
      <div className="inline-flex ba b--lavender br1 pa2 self-center">
        <div className="flex flex-column">
          <Txt className="mb1 lavender" size={TxtSize.XSMALL} value="That turn, the card was" />
          <BarLegend backgroundColor={IInsightColor.Play} text="playable" />
          <BarLegend backgroundColor={IInsightColor.Discard} text="discardable" />
          <BarLegend backgroundColor={IInsightColor.Dangerous} text="dangerous" />
          <BarLegend
            backgroundColor={IInsightColor.Dangerous}
            secondaryBackgroundColor={IInsightColor.Play}
            text="playable & dangerous"
          />
        </div>
        <div className="flex flex-column ml5">
          <Txt className="mb1 lavender" size={TxtSize.XSMALL} value="That turn, the player" />
          <DotLegend backgroundColor={IInsightColor.Play} text="played" />
          <DotLegend backgroundColor={IInsightColor.Discard} text="discarded" />
          <DotLegend backgroundColor={IInsightColor.Hint} text="hinted" />
        </div>
      </div>

      <Button
        outlined
        className="mt3 self-end"
        size={ButtonSize.SMALL}
        text={displayCards ? "Show insights" : "Show cards"}
        onClick={() => setDisplayCards(!displayCards)}
      />

      <div className="flex justify-center-l mt3" style={{ overflowX: "scroll" }} {...longPressProps}>
        <div className="flex flex-column w1 nl3" style={{ width: "40px", paddingTop: 48 }}>
          {game.turnsHistory.map((turn, i) => {
            return (
              <div key={i} className="flex items-baseline" style={{ height: "22px", paddingTop: "1px" }}>
                <Txt className="lavender db tr" size={TxtSize.XXSMALL} value={i + 1} />
              </div>
            );
          })}
        </div>

        {orderedPlayers.map((player, playerIndex) => {
          const firstHand = getStateAtTurn(game, 0).players[playerIndex].hand;

          return (
            <div key={player.id} className="flex flex-column items-center mr4">
              <Txt size={TxtSize.XSMALL} value={player.name} />
              <div className="h1 flex items-center">
                {!playerIndex && <Txt className="txt-yellow" size={TxtSize.XXSMALL} value="➤ started" />}
              </div>
              <div className="flex justify-between w-100 pl3 mr1">
                {firstHand.map((card, cardIndex) => {
                  return (
                    <Txt
                      key={cardIndex}
                      className="lavender"
                      size={TxtSize.XXSMALL}
                      style={{ width: "12px", textAlign: "center" }}
                      value={PositionMap[cardIndex]}
                    />
                  );
                })}
              </div>
              {game.turnsHistory.map((turn, i) => {
                const state = getStateAtTurn(game, i);
                const playerState = state.players[(playerIndex + state.players.length - 1) % state.players.length];

                return (
                  <div key={i} className="flex items-center justify-end w-100">
                    {turn.action.from === player.index && (
                      <div className="flex justify-center flex-center mr1">
                        <Dot backgroundColor={turnToStateColor(turn)} size={12} />
                      </div>
                    )}
                    {playerState.hand.map((card, cardIndex) => {
                      return (
                        <div key={card.id} className="flex items-center">
                          {displayCards && (
                            <Card
                              card={card}
                              context={ICardContext.OTHER}
                              size={CardSize.XSMALL}
                              style={{ margin: "1px" }}
                            />
                          )}
                          {!displayCards && (
                            <CardState colors={cardToStateColor(fillEmptyValues(state), playerState, card)} />
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
        <div className="flex flex-column w1 nl3" style={{ width: "60px", paddingTop: 48 }}>
          {game.turnsHistory.map((turn, i) => {
            const state = getStateAtTurn(game, i);
            return (
              <div key={i} className="flex relative">
                <div className="flex" style={{ width: "20px", height: "21px", margin: "1px 1px 0 0" }}>
                  {range(0, state.tokens.strikes).map(x => {
                    return (
                      <div
                        key={x}
                        className="bg-strikes outline-main-dark absolute flex items-center justify-center br-100 h-100 w-100 mr2"
                        style={{
                          width: "12px",
                          height: "12px",
                          left: `-${x * 2}px`,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex" style={{ width: "40px", height: "21px", margin: "1px 1px 0 0" }}>
                  {range(0, state.tokens.hints).map(x => {
                    return (
                      <div
                        key={x}
                        className="bg-hints outline-main-dark absolute flex items-center justify-center br-100 h-100 w-100 mr2"
                        style={{
                          width: "12px",
                          height: "12px",
                          left: `${20 + x * 4}px`,
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
    </div>
  );
}
