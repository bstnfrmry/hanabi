import { joinGame } from "~/lib/actions";
import { getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import withSession from "~/lib/session";
import { IPlayer } from "~/lib/state";

interface Payload {
  gameId: string;
  player: IPlayer;
}

export default withSession(async (req, res) => {
  const { gameId, player } = req.body as Payload;
  const playerId = await getPlayerIdFromSession(req);

  const game = await loadGame(gameId);

  if (game.players.length === game.options.playersCount) {
    return res.status(403).json({ error: "Game is full", gameId: game.id });
  }

  const updatedGame = joinGame(game, {
    ...player,
    id: playerId,
  });

  updateGame(updatedGame);

  return res.json(updatedGame);
});
