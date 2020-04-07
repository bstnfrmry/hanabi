import assert from "assert";
import {
  cloneDeep,
  findIndex,
  flatMap,
  last,
  orderBy,
  range,
  zipObject
} from "lodash";
import { shuffle } from "shuffle-seed";

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
  IHintType,
  INumber,
  IPlayer
} from "./state";

export const colors: IColor[] = [
  IColor.WHITE,
  IColor.BLUE,
  IColor.RED,
  IColor.GREEN,
  IColor.YELLOW,
  IColor.MULTICOLOR
];

export const numbers: INumber[] = [1, 2, 3, 4, 5];

const startingHandSize = { 2: 5, 3: 5, 4: 4, 5: 4 };
export const MaxHints = 8;

export function isPlayable(card: ICard, playedCards: ICard[]): boolean {
  const isPreviousHere =
    card.number === 1 || // first card on the pile
    findIndex(
      playedCards,
      c => card.number === c.number + 1 && card.color === c.color
    ) > -1; // previous card belongs to the playedCards

  const isSameNotHere =
    findIndex(
      playedCards,
      c => c.number === card.number && c.color === card.color
    ) === -1;

  return isPreviousHere && isSameNotHere;
}

/**
 * Side effect function that applies the given hint on a given hand's cards
 */
function applyHint(state: IGameState, hand: IHand, hint: IHintAction) {
  hand.forEach(card => {
    if (!matchHint(hint, card)) {
      // negative hint
      card.hint[hint.type][hint.value] = IHintLevel.IMPOSSIBLE;
      return;
    }

    // ensure rainbow is already treated last
    const types = orderBy(
      Object.keys(card.hint[hint.type]),
      type => type === "rainbow"
    );

    types
      // skip hints already flagged as impossible
      .filter(value => card.hint[hint.type][value] !== IHintLevel.IMPOSSIBLE)
      .forEach(value => {
        if (value == hint.value) {
          // it has to be this value (or rainbow when applicable)
          card.hint[hint.type][value] =
            hint.type === "color" &&
              state.options.variant === GameVariant.RAINBOW
              ? IHintLevel.POSSIBLE
              : IHintLevel.SURE;
          return;
        }

        if (value === "rainbow") {
          // it's possibly rainbow
          card.hint.number[value] = IHintLevel.POSSIBLE;

          const hasImpossibleColors = Object.values(card.hint.color).find(
            v => v !== IHintLevel.IMPOSSIBLE
          );
          if (hasImpossibleColors) {
            // if the card already as any impossible values for a color, then it's rainbow for sure
            // set all colors to impossible
            Object.keys(card.hint.color).forEach(value => {
              card.hint.number[value] = IHintLevel.IMPOSSIBLE;
            });
            // set rainbow hint to sure
            card.hint.number[value] = IHintLevel.SURE;
          }

          return;
        }

        // all other values are impossible
        card.hint[hint.type][value] = IHintLevel.IMPOSSIBLE;
      });
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
      [IColor.RAINBOW]: 1 // Should never be used directly
    },
    number: { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
  };
}

export function matchColor(colorA: IColor, colorB: IColor) {
  return (
    colorA === colorB || colorA === IColor.RAINBOW || colorB === IColor.RAINBOW
  );
}

export function matchHint(hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? matchColor(card.color, hint.value as IColor)
    : hint.value === card.number;
}

export function isReplayMode(state: IGameState) {
  return state.replayCursor !== undefined;
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
  const isHintingWithoutTokens =
    action.action === "hint" && state.tokens.hints === 0;

  if (actionIsntFromCurrentPlayer || isHintingWithoutTokens || isSelfHinting) {
    return state;
  }

  // the function should be pure
  const s = cloneDeep(state) as IGameState;

  s.history.push({ ...state, turnsHistory: [], history: [] });

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
        throw new Error(
          "Invalid action, cannot discard when the hints are maxed out!"
        );
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
    applyHint(s, hand, action);
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
  }

  return s;
}

/**
 * Rollback the state for the given amount of turns
 */
export function goBackToState(state: IGameState, turnsBack = 1) {
  const lastState = last(state.history);

  if (!lastState) {
    return null;
  }

  const previousState = {
    history: state.history.slice(0, -1),
    turnsHistory: state.turnsHistory.slice(0, -1),
    ...lastState
  };

  if (--turnsBack === 0) {
    return previousState;
  }

  return goBackToState(previousState, turnsBack);
}

export function emptyPlayer(id: string, name: string): IPlayer {
  return {
    hand: [],
    name,
    id,
    bot: false
  };
}

export function getColors(state: IGameState) {
  switch (state.options.variant) {
    case GameVariant.MULTICOLOR:
      return [
        IColor.BLUE,
        IColor.GREEN,
        IColor.RED,
        IColor.WHITE,
        IColor.YELLOW,
        IColor.MULTICOLOR
      ];
    case GameVariant.RAINBOW:
      return [
        IColor.BLUE,
        IColor.GREEN,
        IColor.RED,
        IColor.WHITE,
        IColor.YELLOW,
        IColor.RAINBOW
      ];
    case GameVariant.CLASSIC:
    default:
      return [
        IColor.BLUE,
        IColor.GREEN,
        IColor.RED,
        IColor.WHITE,
        IColor.YELLOW
      ];
  }
}

export function getHintableColors(state: IGameState) {
  return getColors(state).filter(color => color !== IColor.RAINBOW);
}

export function getScore(state: IGameState) {
  return state.playedCards.length;
}

export function getMaximumScore(state: IGameState) {
  switch (state.options.variant) {
    case GameVariant.MULTICOLOR:
    case GameVariant.RAINBOW:
      return 30;
    case GameVariant.CLASSIC:
    default:
      return 25;
  }
}

export function getPlayedCardsPile(
  state: IGameState
): { [key in IColor]: INumber } {
  const colors = getColors(state);

  return zipObject(
    colors,
    colors.map(color => {
      const topCard = last(
        state.playedCards.filter(card => card.color === color)
      );

      return topCard ? topCard.number : 0;
    })
  ) as { [key in IColor]: INumber };
}

/**
 * Compute the max possible score with remaining cards in hand & deck
 * Doesn't take in account remaining turns
 */
export function getMaximumPossibleScore(state: IGameState): number {
  const playableCards = [
    ...state.drawPile,
    ...flatMap(state.players, p => p.hand)
  ];
  const playedCardsPile = getPlayedCardsPile(state);

  let maxScore = getMaximumScore(state);

  Object.keys(playedCardsPile).forEach(color => {
    let value = playedCardsPile[color];

    while (value < 5) {
      const nextCard = playableCards.find(
        card => card.color === color && card.number === value + 1
      );

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
  const hand = game.drawPile.splice(
    0,
    startingHandSize[game.options.playersCount]
  );

  game.players = game.players || [];
  game.players.push({ ...player, hand, index: game.players.length });

  hand.forEach(card => (card.hint = emptyHint(state.options)));

  return game;
}

export function newGame(options: IGameOptions): IGameState {
  assert(options.playersCount > 1 && options.playersCount < 6);

  // all cards but multicolors
  let cards = flatMap(colors.slice(0, -1), color => [
    { number: 1, color },
    { number: 1, color },
    { number: 1, color },
    { number: 2, color },
    { number: 2, color },
    { number: 3, color },
    { number: 3, color },
    { number: 4, color },
    { number: 4, color },
    { number: 5, color }
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

  cards = cards.map((c, i) => ({ ...c, id: i })) as ICard[];

  const deck = shuffle(cards, options.seed);

  const currentPlayer = shuffle(range(options.playersCount), options.seed)[0];

  return {
    id: options.id,
    status: IGameStatus.LOBBY,
    playedCards: [],
    drawPile: deck,
    discardPile: [],
    players: [],
    tokens: {
      hints: MaxHints,
      strikes: 0
    },
    currentPlayer,
    options,
    actionsLeft: options.playersCount + 1, // this will be decreased when the draw pile is empty
    turnsHistory: [],
    history: [],
    createdAt: Date.now(),
    synced: false
  };
}
