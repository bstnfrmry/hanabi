import IGameState, { ITurn } from "./state";

export function turnToText(turn: ITurn, game: IGameState) {
  if (!turn) {
    return "";
  }

  if (turn.action.action === "hint") {
    return `hinted ${game.players[turn.action.to].name} about ${
      turn.action.value
    }${turn.action.type === "color" ? " cards" : "s"}`;
  }

  let message;

  if (turn.action.action === "discard") {
    message = `discarded ${turn.action.card.number} ${turn.action.card.color}`;
  }

  if (turn.action.action === "play") {
    message = `played ${turn.action.card.number} ${turn.action.card.color}`;
  }

  if (turn.card) {
    message += ` & drew ${turn.card.number} ${turn.card.color}`;
  }

  return message;
}
