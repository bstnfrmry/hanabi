/**
 * This function will be called at each turn with the current player.
 * Returns the action taken by the player.
 * Options:
 * { type: "play", card }
 * { type: "discard", card }
 * { type: "hint-color", color }
 * { type: "hint-value", value }
 */
function ai({ game, player }) {
  return { type: "discard", card: player.hand[0] }
}

module.exports = { ai }
