import { newGame, recreateGame } from "~/lib/actions";
import { getPlayerFromGame, getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import { readableUniqueId } from "~/lib/id";
import withSession from "~/lib/session";
import { IGameOptions } from "~/lib/state";

interface Payload {
  options: IGameOptions;
  previousGameId: string;
}

export default withSession(async (req, res) => {
  const { options, previousGameId } = req.body as Payload;

  if (previousGameId) {
    const playerId = await getPlayerIdFromSession(req);
    const previousGame = await loadGame(previousGameId);

    const player = getPlayerFromGame(previousGame, playerId);
    if (!player) {
      return res.status(403).json({ error: "Player is not in game", gameId: previousGameId, playerId });
    }

    const nextGame = recreateGame(previousGame);

    updateGame({
      ...previousGame,
      nextGameId: nextGame.id,
    });

    await updateGame(nextGame);

    return res.json(nextGame);
  }

  const game = newGame({
    ...options,
    id: readableUniqueId(),
  });

  await updateGame(game);

  return res.json(game);
});
