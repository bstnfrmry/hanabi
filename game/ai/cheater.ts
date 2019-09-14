import { last, sortBy } from "lodash";

import { commitAction } from "~/game/actions";
import IGameState, { ICard, IColor } from "~/game/state";

function canPlay(game: IGameState, card: ICard) {
  const topCard = last(
    game.playedCards.filter(playedCard => playedCard.color === card.color)
  );

  if (topCard) {
    return topCard.number + 1 === card.number;
  }

  return card.number === 1;
}

const AmountPerColor = { 1: 3, 2: 2, 3: 2, 4: 2, 5: 1 };

function cardIdentity(cardA, cardB) {
  return cardA.color === cardB.color && cardA.number === cardB.number;
}

function canSafelyDiscard(game: IGameState, card: ICard) {
  if (card.color === IColor.MULTICOLOR) return false;

  if (game.playedCards.find(playedCard => cardIdentity(card, playedCard))) {
    return true;
  }

  return false;
}

function canDiscard(game: IGameState, card: ICard) {
  if (card.color === IColor.MULTICOLOR) return false;

  if (game.playedCards.find(playedCard => cardIdentity(card, playedCard))) {
    return true;
  }

  const identicalDiscardedCards = game.discardPile.filter(discardedCard =>
    cardIdentity(card, discardedCard)
  );

  return identicalDiscardedCards.length < AmountPerColor[card.number] - 1;
}

export default function play(game: IGameState): IGameState {
  const currentPlayer = game.players[game.currentPlayer];

  const playableCards = currentPlayer.hand.filter(card => canPlay(game, card));
  const [playableCard] = sortBy(
    sortBy(playableCards, card => card.number),
    card => card.color === IColor.MULTICOLOR
  );
  if (playableCard) {
    return commitAction(game, {
      action: "play",
      card: playableCard,
      cardIndex: currentPlayer.hand.indexOf(playableCard),
      from: game.currentPlayer
    });
  }

  const [safelyDiscardableCard] = currentPlayer.hand.filter(card =>
    canSafelyDiscard(game, card)
  );
  if (safelyDiscardableCard) {
    return commitAction(game, {
      action: "discard",
      card: safelyDiscardableCard,
      cardIndex: currentPlayer.hand.indexOf(safelyDiscardableCard),
      from: game.currentPlayer
    });
  }

  const discardableCards = currentPlayer.hand.filter(card =>
    canDiscard(game, card)
  );
  const [discardableCard] = sortBy(discardableCards, card => -card.number);
  if (discardableCard) {
    return commitAction(game, {
      action: "discard",
      card: discardableCard,
      cardIndex: currentPlayer.hand.indexOf(discardableCard),
      from: game.currentPlayer
    });
  }

  if (game.tokens.hints) {
    return commitAction(game, {
      action: "hint",
      from: game.currentPlayer,
      to: (game.currentPlayer + 1) % game.players.length,
      type: "number",
      value: 1
    });
  }

  const [despairDiscardedCard] = sortBy(
    currentPlayer.hand,
    card => -card.number
  );
  return commitAction(game, {
    action: "discard",
    card: despairDiscardedCard,
    cardIndex: currentPlayer.hand.indexOf(despairDiscardedCard),
    from: game.currentPlayer
  });
}
