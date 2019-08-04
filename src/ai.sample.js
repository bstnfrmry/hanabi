/**
 * This function will be called at each turn with the current player.
 * It has to return the action take by the player.
 * Options:
 * { type: "play", card }
 * { type: "discard", card }
 * { type: "hint-color", color}
 * { type: "hint-value", color }
 */
function ai({ game, player }) {
  return { type: "discard", card: player.hand[0] }
}

module.exports = { ai }
