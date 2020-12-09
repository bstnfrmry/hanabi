import assert from "assert";
import { cloneDeep, findIndex, flatMap, last, range, shuffle, zipObject } from "lodash";
import mem from "mem";
import { shuffle as shuffleSeed } from "shuffle-seed";

import { readableUniqueId } from "~/lib/id";

import IGameState, {
  GameVariant,
  IAction,
  ICard,
  ICardHint,
  IColor,
  IGameOptions,
  IGameStatus,
  IHand,
  IHintAction,
  IHintLevel,
  IMessage,
  INumber,
  IPlayer,
} from "./state";

export const numbers: INumber[] = [1, 2, 3, 4, 5];

const startingHandSize = { 2: 5, 3: 5, 4: 4, 5: 4 };
export const MaxHints = 8;

export function isPlayable(card: ICard, playedCards: ICard[]): boolean {
  const isPreviousHere =
    card.number === 1 || findIndex(playedCards, c => card.number === c.number + 1 && card.color === c.color) > -1; // first card on the pile // previous card belongs to the playedCards

  const isSameNotHere = findIndex(playedCards, c => c.number === card.number && c.color === card.color) === -1;

  return isPreviousHere && isSameNotHere;
}

/**
 * Side effect function that applies the given hint on a given hand's cards
 */
function applyHint(hand: IHand, hint: IHintAction, game: IGameState) {
  hint.cardsIndex = [];

  hand.forEach((card, index) => {
    if (matchHint(game, hint, card)) {
      hint.cardsIndex.push(index);

      if (!card.receivedHints) {
        card.receivedHints = [];
      }
      card.receivedHints.push({ action: hint });

      // positive hint on card - mark all other values as impossible (except rainbow)
      Object.keys(card.hint[hint.type])
        .filter(value => {
          return GameVariant.RAINBOW === game.options.variant ? value !== IColor.RAINBOW : true;
        })
        .filter(value => {
          if (hint.type === "number" && game.options.variant === GameVariant.SEQUENCE) {
            return value < hint.value;
          }
          return value != hint.value;
        })
        .forEach(value => {
          card.hint[hint.type][value] = IHintLevel.IMPOSSIBLE;
        });
    } else {
      // negative hint on card - mark as impossible
      card.hint[hint.type][hint.value] = IHintLevel.IMPOSSIBLE;

      if (hint.type === "number" && game.options.variant === GameVariant.SEQUENCE) {
        range(hint.value as INumber, 6).forEach(n => {
          card.hint.number[n] = IHintLevel.IMPOSSIBLE;
        });
      }

      // for color hints, also mark rainbow as impossible
      if (hint.type === "color") {
        card.hint.color.rainbow = IHintLevel.IMPOSSIBLE;
      }
    }

    // if there's only one possible color, make it sure
    const onlyPossibleColors = Object.keys(card.hint.color).filter(
      color => card.hint.color[color] === IHintLevel.POSSIBLE
    );
    if (onlyPossibleColors.length === 1) {
      card.hint.color[onlyPossibleColors[0]] = IHintLevel.SURE;
    }

    // if there's only one possible number, make it sure
    const onlyPossibleNumbers = Object.keys(card.hint.number).filter(
      number => card.hint.number[number] === IHintLevel.POSSIBLE
    );
    if (onlyPossibleNumbers.length === 1) {
      card.hint.number[onlyPossibleNumbers[0]] = IHintLevel.SURE;
    }
  });
}

export function emptyHint(options: IGameOptions): ICardHint {
  return {
    color: {
      [IColor.BLUE]: 1,
      [IColor.RED]: 1,
      [IColor.GREEN]: 1,
      [IColor.YELLOW]: 1,
      [IColor.WHITE]: 1,
      [IColor.MULTICOLOR]: options.variant === GameVariant.MULTICOLOR ? 1 : 0,
      [IColor.RAINBOW]: 1, // Should never be used directly
      [IColor.ORANGE]: options.variant === GameVariant.ORANGE ? 1 : 0,
    },
    number: { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
  };
}

export function matchColor(colorA: IColor, colorB: IColor) {
  return colorA === colorB || colorA === IColor.RAINBOW || colorB === IColor.RAINBOW;
}

export function matchNumber(game: IGameState, numberA: INumber, numberB: INumber) {
  if (game.options.variant === GameVariant.SEQUENCE) {
    return numberA >= numberB;
  }

  return numberA === numberB;
}

export function matchHint(game: IGameState, hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? matchColor(card.color, hint.value as IColor)
    : matchNumber(game, card.number, hint.value as INumber);
}

export function isGameOver(state: IGameState) {
  return (
    state.actionsLeft <= 0 ||
    state.tokens.strikes >= 3 ||
    getMaximumPossibleScore(state) === (state.playedCards || []).length
  );
}

export function commitAction(state: IGameState, action: IAction): IGameState {
  const actionIsntFromCurrentPlayer = action.from !== state.currentPlayer;
  const isSelfHinting = action.action === "hint" && action.from == action.to;
  const isHintingWithoutTokens = action.action === "hint" && state.tokens.hints === 0;

  if (actionIsntFromCurrentPlayer || isHintingWithoutTokens || isSelfHinting) {
    return state;
  }

  // the function should be pure
  const s = cloneDeep(state) as IGameState;

  const player = s.players[action.from];

  let newCard = null as ICard;
  if (action.action === "discard" || action.action === "play") {
    // remove the card from hand
    const [card] = player.hand.splice(action.cardIndex, 1);
    action.card = card;
    /** PLAY */
    if (action.action === "play") {
      if (isPlayable(card, s.playedCards)) {
        s.playedCards.push(card);
        if (card.number === 5) {
          // play a 5, win a hint
          if (s.tokens.hints < MaxHints) s.tokens.hints += 1;
        }
      } else {
        // strike !
        s.tokens.strikes += 1;
        s.discardPile.push(card);
      }
    } else {
      /** DISCARD */
      if (s.tokens.hints < MaxHints) {
        s.discardPile.push(card);
        s.tokens.hints += 1;
      } else {
        throw new Error("Invalid action, cannot discard when the hints are maxed out!");
      }
    }

    // in both cases (play, discard) we need to remove a card from the hand and get a new one
    if (s.drawPile && s.drawPile.length) {
      newCard = s.drawPile.pop();
      newCard.hint = emptyHint(state.options);
      player.hand.unshift(newCard);
    }
  }

  /** HINT */
  if (action.action === "hint") {
    s.tokens.hints -= 1;

    const hand = s.players[action.to].hand;
    applyHint(hand, action, s);
  }

  // there's no card in the pile (or the last card was just drawn)
  // decrease the actionsLeft counter.
  // The game ends when it reaches 0.
  if (!s.drawPile || s.drawPile.length === 0) {
    s.actionsLeft -= 1;
  }

  // update player
  s.currentPlayer = (s.currentPlayer + 1) % s.options.playersCount;

  // update history
  s.turnsHistory.push({ action, card: newCard });

  if (isGameOver(s)) {
    s.status = IGameStatus.OVER;
    s.endedAt = Date.now();
  }

  return s;
}

export function sendMessage(state: IGameState, message: IMessage) {
  const newGame = cloneDeep(state);

  newGame.messages.push(message);

  return newGame;
}

/**
 * Rollback the state for the given amount of turns
 */
export const getStateAtTurn = mem<[IGameState, number], IGameState, string>(
  (state: IGameState, turnIndex: number) => {
    let newState = newGame(state.options);

    state.players.forEach(player => {
      newState = joinGame(newState, player);
    });

    state.turnsHistory.slice(0, turnIndex).forEach(turn => {
      newState = commitAction(newState, turn.action);
    });

    newState.messages = state.messages;
    newState.status = IGameStatus.ONGOING;
    newState.createdAt = state.createdAt;

    return newState;
  },
  {
    cacheKey: ([state, turn]) => `${state.id}-${turn}`,
  }
);

export function emptyPlayer(id: string, name: string): IPlayer {
  return {
    hand: [],
    name,
    id,
    bot: false,
  };
}

export function getColors(variant: GameVariant) {
  switch (variant) {
    case GameVariant.MULTICOLOR:
      return [IColor.BLUE, IColor.GREEN, IColor.RED, IColor.WHITE, IColor.YELLOW, IColor.MULTICOLOR];
    case GameVariant.RAINBOW:
      return [IColor.BLUE, IColor.GREEN, IColor.RED, IColor.WHITE, IColor.YELLOW, IColor.RAINBOW];
    case GameVariant.ORANGE:
      return [IColor.BLUE, IColor.GREEN, IColor.RED, IColor.WHITE, IColor.YELLOW, IColor.ORANGE];
    case GameVariant.CLASSIC:
    default:
      return [IColor.BLUE, IColor.GREEN, IColor.RED, IColor.WHITE, IColor.YELLOW];
  }
}

export function getHintableColors(state: IGameState) {
  return getColors(state.options.variant).filter(color => color !== IColor.RAINBOW);
}

export function getScore(state: IGameState) {
  return state.playedCards.length;
}

export function getMaximumScore(state: IGameState) {
  switch (state.options.variant) {
    case GameVariant.MULTICOLOR:
    case GameVariant.RAINBOW:
    case GameVariant.ORANGE:
      return 30;
    case GameVariant.CLASSIC:
    default:
      return 25;
  }
}

export function getPlayedCardsPile(state: IGameState): { [key in IColor]: INumber } {
  const colors = getColors(state.options.variant);

  return zipObject(
    colors,
    colors.map(color => {
      const topCard = last(state.playedCards.filter(card => card.color === color));

      return topCard ? topCard.number : 0;
    })
  ) as { [key in IColor]: INumber };
}

/**
 * Compute the max possible score with remaining cards in hand & deck
 * Doesn't take in account remaining turns
 */
export function getMaximumPossibleScore(state: IGameState): number {
  const playableCards = [...state.drawPile, ...flatMap(state.players, p => p.hand)];
  const playedCardsPile = getPlayedCardsPile(state);

  let maxScore = getMaximumScore(state);

  Object.keys(playedCardsPile).forEach(color => {
    let value = playedCardsPile[color];

    while (value < 5) {
      const nextCard = playableCards.find(card => card.color === color && card.number === value + 1);

      if (!nextCard) {
        maxScore -= 5 - value;
        break;
      }
      value += 1;
    }
  });

  return maxScore;
}

export function joinGame(state: IGameState, player: IPlayer): IGameState {
  const game = cloneDeep(state) as IGameState;
  const hand = game.drawPile.splice(0, startingHandSize[game.options.playersCount]);

  game.players = game.players || [];
  game.players.push({ ...player, hand, index: game.players.length });

  hand.forEach(card => (card.hint = emptyHint(state.options)));

  return game;
}

export function newGame(options: IGameOptions): IGameState {
  assert(options.playersCount > 1 && options.playersCount < 6);

  // All base cards
  const baseColors = [IColor.WHITE, IColor.BLUE, IColor.RED, IColor.GREEN, IColor.YELLOW];
  let cards = flatMap(baseColors, color => [
    { number: 1, color },
    { number: 1, color },
    { number: 1, color },
    { number: 2, color },
    { number: 2, color },
    { number: 3, color },
    { number: 3, color },
    { number: 4, color },
    { number: 4, color },
    { number: 5, color },
  ]);

  // Add multicolor cards when applicable
  if (options.variant === GameVariant.MULTICOLOR) {
    cards.push(
      { number: 1, color: IColor.MULTICOLOR },
      { number: 2, color: IColor.MULTICOLOR },
      { number: 3, color: IColor.MULTICOLOR },
      { number: 4, color: IColor.MULTICOLOR },
      { number: 5, color: IColor.MULTICOLOR }
    );
  }

  // Add orange cards when applicable
  if (options.variant === GameVariant.ORANGE) {
    cards.push(
      { number: 1, color: IColor.ORANGE },
      { number: 1, color: IColor.ORANGE },
      { number: 1, color: IColor.ORANGE },
      { number: 2, color: IColor.ORANGE },
      { number: 2, color: IColor.ORANGE },
      { number: 3, color: IColor.ORANGE },
      { number: 3, color: IColor.ORANGE },
      { number: 4, color: IColor.ORANGE },
      { number: 4, color: IColor.ORANGE },
      { number: 5, color: IColor.ORANGE }
    );
  }

  // Add rainbow cards when applicable
  if (options.variant === GameVariant.RAINBOW) {
    cards.push(
      { number: 1, color: IColor.RAINBOW },
      { number: 1, color: IColor.RAINBOW },
      { number: 1, color: IColor.RAINBOW },
      { number: 2, color: IColor.RAINBOW },
      { number: 2, color: IColor.RAINBOW },
      { number: 3, color: IColor.RAINBOW },
      { number: 3, color: IColor.RAINBOW },
      { number: 4, color: IColor.RAINBOW },
      { number: 4, color: IColor.RAINBOW },
      { number: 5, color: IColor.RAINBOW }
    );
  }

  cards = cards.map((c, i) => {
    return {
      ...c,
      id: i,
    };
  });

  const deck = shuffleSeed(cards, options.seed);

  const currentPlayer = shuffleSeed(range(options.playersCount), options.seed)[0];

  return {
    id: options.id,
    status: IGameStatus.LOBBY,
    playedCards: [],
    drawPile: deck,
    discardPile: [],
    players: [],
    tokens: {
      hints: MaxHints,
      strikes: 0,
    },
    currentPlayer,
    options,
    actionsLeft: options.playersCount + 1, // this will be decreased when the draw pile is empty
    turnsHistory: [],
    messages: [],
    createdAt: Date.now(),
    synced: false,
  };
}

export function recreateGame(game: IGameState) {
  const nextGameId = readableUniqueId();

  let nextGame = newGame({
    ...game.options,
    id: nextGameId,
    seed: `${Math.round(Math.random() * 10000)}`,
  });

  shuffle(game.players).forEach(player => {
    nextGame = joinGame(nextGame, player);
  });

  return nextGame;
}
