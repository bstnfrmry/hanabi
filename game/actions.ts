import assert from "assert";
import { cloneDeep, findIndex, flatMap, last, range, zipObject } from "lodash";
import { shuffle } from "shuffle-seed";

import IGameState, {
  IAction,
  ICard,
  ICardHint,
  IColor,
  IGameOptions,
  IGameStatus,
  IHand,
  IHintAction,
  INumber,
  IPlayer
} from "~/game/state";

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
function applyHint(hand: IHand, hint: IHintAction) {
  hand.forEach(card => {
    if (card[hint.type] === hint.value) {
      // positive hint, e.g. card is a red 5 and the hint is "color red"
      Object.keys(card.hint[hint.type]).forEach(value => {
        if (value == hint.value) {
          // == because we want '2' == 2
          // it has to be this value
          card.hint[hint.type][value] = 2;
        } else {
          // all other values are impossible
          card.hint[hint.type][value] = 0;
        }
      });
    } else {
      // negative hint
      card.hint[hint.type][hint.value] = 0;
    }
  });
}

export function emptyHint(options: IGameOptions): ICardHint {
  return {
    color: {
      blue: 1,
      red: 1,
      green: 1,
      white: 1,
      yellow: 1,
      multicolor: options.multicolor ? 1 : 0
    },
    number: { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
  };
}

export function isGameOver(state: IGameState) {
  return (
    state.actionsLeft <= 0 ||
    state.tokens.strikes >= 3 ||
    (state.playedCards || []).length === (state.options.multicolor ? 30 : 25)
  );
}

export function commitAction(state: IGameState, action: IAction): IGameState {
  // the function should be pure
  const s = cloneDeep(state) as IGameState;

  s.history.push({ ...state, turnsHistory: [], history: [] });

  assert(action.from === state.currentPlayer);
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
          s.tokens.hints += 1;
        }
      } else {
        // strike !
        s.tokens.strikes += 1;
        s.discardPile.push(card);
      }
    } else {
      /** DISCARD */
      s.discardPile.push(card);
      if (s.tokens.hints < 8) s.tokens.hints += 1;
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
    assert(s.tokens.hints > 0);
    s.tokens.hints -= 1;

    assert(action.from !== action.to);
    const hand = s.players[action.to].hand;
    applyHint(hand, action);
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
    emoji: "🐶",
    id,
    bot: false
  };
}

export function getColors(state: IGameState) {
  return state.options.multicolor ? colors : colors.slice(0, -1);
}

export function getScore(state: IGameState) {
  return state.playedCards.length;
}

export function getMaximumScore(state: IGameState) {
  return state.options.multicolor ? 30 : 25;
}

export function getPlayedCardsPile(state: IGameState) {
  const colors = getColors(state);

  return zipObject(
    colors,
    colors.map(color => {
      const topCard = last(
        state.playedCards.filter(card => card.color === color)
      );

      return topCard ? topCard.number : 0;
    })
  );
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

  // Add extensions cards when applicable
  if (options.multicolor) {
    cards.push(
      { number: 1, color: IColor.MULTICOLOR },
      { number: 2, color: IColor.MULTICOLOR },
      { number: 3, color: IColor.MULTICOLOR },
      { number: 4, color: IColor.MULTICOLOR },
      { number: 5, color: IColor.MULTICOLOR }
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
      hints: 8,
      strikes: 0
    },
    currentPlayer,
    options,
    actionsLeft: options.playersCount + 1, // this will be decreased when the draw pile is empty
    turnsHistory: [],
    history: [],
    createdAt: Date.now()
  };
}
