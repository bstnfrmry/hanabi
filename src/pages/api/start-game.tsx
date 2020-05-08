import { getPlayerFromGame, getPlayerIdFromSession, playForBots } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import withSession from "~/lib/session";
import { IGameStatus } from "~/lib/state";

interface Payload {
  gameId: string;
}

export default withSession(async (req, res) => {
  const { gameId } = req.body as Payload;
  const playerId = await getPlayerIdFromSession(req);

  const game = await loadGame(gameId);
  if (!getPlayerFromGame(game, playerId)) {
    return res.status(403).json({ error: "Player is not in game", gameId, playerId });
  }

  game.status = IGameStatus.ONGOING;
  game.startedAt = Date.now();

  updateGame(game);
  playForBots(game);

  return res.json(game);
});
