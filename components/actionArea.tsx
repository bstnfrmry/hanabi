import React, { useState, useEffect } from "react";
import Card, { CardContext, PositionMap } from "./card";
import Vignettes from "./vignettes";
import DiscardPile from "./discardPile";
import { useRouter } from "next/router";
import { IHintAction, ICard, IPlayer } from "../game/state";
import { isGameOver } from "../game/actions";
import Turn from "./turn";
import Button from "./button";
import PlayerName from "./playerName";
import { useGame, useSelfPlayer, useCurrentPlayer } from "../hooks/game";

interface IActionArea {
  selectedArea: ISelectedArea;
  onCommitAction: any;
}

export type ISelectedArea =
  | IInstructionsSelectedArea
  | IPlayerSelectedArea
  | IOwnGameSelectedArea
  | IDiscardSelectedArea;

interface IInstructionsSelectedArea {
  id: string;
  type: ActionAreaType.INSTRUCTIONS;
}

interface IPlayerSelectedArea {
  id: string;
  type: ActionAreaType.PLAYER;
  player: IPlayer;
  cardIndex?: number;
}

interface IOwnGameSelectedArea {
  id: string;
  type: ActionAreaType.OWNGAME;
  player: IPlayer;
  cardIndex?: number;
}

interface IDiscardSelectedArea {
  id: string;
  type: ActionAreaType.DISCARD;
}

export enum ActionAreaType {
  INSTRUCTIONS = "instructions",
  PLAYER = "player",
  OWNGAME = "ownGame",
  DISCARD = "discard"
}

export default ({ selectedArea, onCommitAction }: IActionArea) => {
  const router = useRouter();
  const { playerId } = router.query;
  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();

  const [pendingHint, setPendingHint] = useState({
    type: null,
    value: null
  } as IHintAction);
  const [selectedCard, selectCard] = useState(null);

  useEffect(
    () =>
      selectCard(
        selectedArea.type === ActionAreaType.OWNGAME ||
          selectedArea.type === ActionAreaType.PLAYER
          ? selectedArea.cardIndex
          : null
      ),
    [selectedArea]
  );

  const isCurrentPlayer = currentPlayer === selfPlayer;

  if (isGameOver(game)) {
    return (
      <div className="pa1 bg-grey pt4 flex-grow-1 f6 f4-l fw2 tracked ttu">
        <p>The game is over! Your score is {game.playedCards.length} 🎉</p>
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.INSTRUCTIONS) {
    return (
      <div className="flex-grow-1 f6 f4-l fw2 lh-copy">
        {!isCurrentPlayer && (
          <div className="ttu tracked">
            It's <PlayerName player={currentPlayer} />
            's turn
          </div>
        )}
        {isCurrentPlayer && (
          <div className="ttu tracked">
            <div>Your turn!</div>
            <div>Give a hint by tapping on your playmates' hand</div>
            <div>Play or discard by tapping on your own game</div>
          </div>
        )}
        {game.turnsHistory.length > 0 && (
          <div className="ttu tracked mt3">Last actions:</div>
        )}
        {[...game.turnsHistory].reverse().map((turn, i) => {
          return (
            <div key={i} className="mt1">
              <Turn
                turn={turn}
                includePlayer={true}
                showDrawn={game.players[turn.action.from] !== selfPlayer}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.DISCARD) {
    return (
      <div className="flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1">
          Discarded cards
        </div>
        <DiscardPile cards={game.discardPile} />
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.PLAYER) {
    const { player } = selectedArea;

    return (
      <div className="flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2">
          <PlayerName player={player} />
          's game
        </div>
        <div className="flex flex-row pb2">
          {player.hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              hidden={player === selfPlayer}
              position={i}
              size="large"
              context={CardContext.TARGETED_PLAYER}
              className="ma1"
              selected={isCardHintable(pendingHint, card)}
            />
          ))}
        </div>
        {isCurrentPlayer && (
          <>
            <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2 mt3">
              Select a hint below
            </div>
            <div className="flex flex-row pb2 ml1">
              <Vignettes
                onSelect={action => setPendingHint(action)}
                pendingHint={pendingHint}
              />
              <div className="ml3">
                <div className="h2 f5 fw3 i">
                  {textualHint(pendingHint, player.hand)}
                </div>
                <Button
                  disabled={game.tokens.hints === 0}
                  onClick={() =>
                    onCommitAction({
                      action: "hint",
                      from: game.currentPlayer,
                      to: player.index,
                      ...pendingHint
                    } as IHintAction)
                  }
                >
                  Give hint
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.OWNGAME) {
    const { player } = selectedArea;
    const hasSelectedCard = selectedCard !== null;

    return (
      <div className="flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2">
          Your game
        </div>
        <div className="flex flex-row pb2">
          {player.hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              hidden={player.id === playerId}
              multicolorOption={game.options.multicolor}
              position={i}
              size="large"
              context={CardContext.TARGETED_PLAYER}
              className="ma1"
              onClick={() => selectCard(i)}
              selected={selectedCard === i}
            />
          ))}
        </div>
        {isCurrentPlayer && (
          <>
            <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2 mt3">
              {hasSelectedCard && (
                <>Card {PositionMap[selectedCard]} selected</>
              )}
              {!hasSelectedCard && "Select a card"}
            </div>
            {hasSelectedCard && (
              <div className="flex flex-row pb2 ml1">
                {["play", "discard"].map(action => (
                  <Button
                    key={action}
                    onClick={() =>
                      onCommitAction({
                        action,
                        from: player.index,
                        cardIndex: selectedCard
                      })
                    }
                  >
                    {action}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
};

function isCardHintable(hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? card.color === hint.value
    : card.number === hint.value;
}

function textualHint(hint: IHintAction, cards: ICard[]) {
  if (hint.value === null) {
    return "";
  }

  const hintableCards = cards
    .map((c, i) => (isCardHintable(hint, c) ? i : null))
    .filter(i => i !== null)
    .map(i => PositionMap[i]);

  if (hintableCards.length === 0) {
    if (hint.type === "color") return `You have no ${hint.value} cards.`;
    else return `You have no ${hint.value}s.`;
  } else if (hintableCards.length === 1) {
    if (hint.type === "color")
      return `Your card ${hintableCards[0]} is ${hint.value}!`;
    else return `Your card ${hintableCards[0]} is a ${hint.value}!`;
  } else {
    if (hint.type === "color")
      return `Your cards ${hintableCards.join(", ")} are ${hint.value}!`;
    else return `Your cards ${hintableCards.join(", ")} are ${hint.value}s!`;
  }
}
