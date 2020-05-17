import { getPlayerFromGame, getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import { sleep } from "~/lib/promise";
import withSession from "~/lib/session";

interface Payload {
  gameId: string;
  playerId: string;
}

export default withSession(async (req, res) => {
  const { gameId, playerId } = req.body as Payload;
  const selfPlayerId = await getPlayerIdFromSession(req);

  const game = await loadGame(gameId);

  const selfPlayer = getPlayerFromGame(game, selfPlayerId);
  if (!selfPlayer) {
    return res.status(403).json({ error: "Player is not in game", gameId, playerId: selfPlayerId });
  }

  const player = getPlayerFromGame(game, playerId);
  if (!player) {
    return res.status(404).json({ error: "Player is not in game", gameId, playerId });
  }

  player.notified = true;
  updateGame(game);

  await sleep(10000);

  player.notified = false;
  updateGame(game);

  return res.json(game);
});
