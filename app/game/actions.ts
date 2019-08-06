import IGameState, { IAction, IHand, ICard, IHintAction } from "./state";
import { cloneDeep, isEqual, findIndex } from "lodash";
import assert from "assert";

export function commitAction(state: IGameState, action: IAction): IGameState {
  // the function should be pure
  const s = cloneDeep(state) as IGameState;

  assert(action.from === state.currentPlayer);
  const player = s.players[action.from];

  if (action.action === "discard" || action.action === "play") {
    // remove the card from hand and check that it's what we expect
    const [card] = player.hand.splice(action.cardIndex, 1);
    assert(isEqual(card, action.card));

    /** PLAY */
    if (action.action === "play") {
      if (isPlayable(card, s.playedCards)) {
        s.playedCards.push(action.card);
        if (card.number === 5) {
          // play a 5, win a hint
          s.tokens.hints += 1;
        }
      } else {
        // strike !
        s.tokens.strikes -= 1;
        s.discardPile.push(action.card);
      }
    } else {
      /** DISCARD */
      s.discardPile.push(action.card);
    }

    // in both cases (play, discard) we need to remove a card from the hand and get a new one
    const newCard = s.drawPile.pop();
    if (newCard) {
      player.hand.unshift(newCard);
    }
  }

  /** HINT */
  if (action.action === "hint") {
    assert(action.from !== action.to);
    const hand = s.players[action.to].hand;
    applyHint(hand, action);
  }

  // there's no card in the pile (or the last card was just drawn)
  // decrease the actionsLeft counter.
  // The game ends when it reaches 0.
  if (s.drawPile.length === 0) {
    s.actionsLeft -= 1;
  }

  return s;
}

export function isGameOver(state: IGameState) {
  return (
    state.actionsLeft <= 0 ||
    state.tokens.strikes <= 0 ||
    state.playedCards.length === (state.options.multicolor ? 30 : 25)
  );
}

/**
 * Side effect function that applies the given hint on a given hand's cards
 */
function applyHint(hand: IHand, hint: IHintAction) {
  hand.forEach(card => {
    if (card[hint.type] === hint.value) {
      // positive hint, e.g. card is a red 5 and the hint is "color red"
      Object.keys(card.hint[hint.type]).forEach(value => {
        if (value === hint.value) {
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

function isPlayable(card: ICard, playedCards: ICard[]): boolean {
  const isPreviousHere =
    card.number === 1 ||
    findIndex(
      playedCards,
      c => card.number === c.number + 1 && card.color === c.color
    ) > -1;

  const isSameNotHere = findIndex(playedCards, c => isEqual(c, card)) === -1;

  return isPreviousHere && isSameNotHere;
}
