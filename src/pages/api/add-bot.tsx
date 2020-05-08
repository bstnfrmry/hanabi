import { joinGame } from "~/lib/actions";
import { getPlayerFromGame, getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import { uniqueId } from "~/lib/id";
import withSession from "~/lib/session";
import { IPlayer } from "~/lib/state";

interface Payload {
  gameId: string;
  bot: IPlayer;
}

export default withSession(async (req, res) => {
  const { gameId, bot } = req.body as Payload;
  const playerId = await getPlayerIdFromSession(req);

  const game = await loadGame(gameId);
  if (!getPlayerFromGame(game, playerId)) {
    return res.status(403).json({ error: "Player is not in game", gameId, playerId });
  }

  const updatedGame = joinGame(game, {
    ...bot,
    id: uniqueId(),
    bot: true,
  });

  updateGame(updatedGame);

  return res.json(updatedGame);
});
