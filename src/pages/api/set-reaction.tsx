import { getPlayerFromGame, getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import withSession from "~/lib/session";

interface Payload {
  gameId: string;
  reaction: string;
}

export default withSession(async (req, res) => {
  const { gameId, reaction } = req.body as Payload;
  const playerId = await getPlayerIdFromSession(req);

  const game = await loadGame(gameId);
  const player = getPlayerFromGame(game, playerId);
  if (!player) {
    return res.status(403).json({ error: "Player is not in game", gameId, playerId });
  }

  player.reaction = reaction;

  updateGame(game);

  return res.json(game);
});
