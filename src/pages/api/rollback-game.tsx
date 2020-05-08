import { getStateAtTurn } from "~/lib/actions";
import { getPlayerFromGame, getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import withSession from "~/lib/session";

interface Payload {
  gameId: string;
  turn: number;
}

export default withSession(async (req, res) => {
  const { gameId, turn } = req.body as Payload;
  const playerId = await getPlayerIdFromSession(req);

  let game = await loadGame(gameId);

  if (!getPlayerFromGame(game, playerId)) {
    return res.status(403).json({ error: "Player is not in game", gameId, playerId });
  }

  game = getStateAtTurn(game, turn);

  updateGame(game);

  return res.json(game);
});
