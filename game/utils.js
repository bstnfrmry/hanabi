export function actionToText(action, game) {
  if (!action) {
    return "";
  } else if (action.action === "hint") {
    return `gave a hint to ${game.players[action.to].name} about their ${action.value} card(s).`;
  } else if (action.action === "discard") {
    return `discarded ${action.card.number} ${action.card.color}`;
  } else if (action.action === "play") {
    return `played ${action.card.number} ${action.card.color}`;
  }
}
