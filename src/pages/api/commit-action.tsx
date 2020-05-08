import { commitAction, getMaximumPossibleScore } from "~/lib/actions";
import { getPlayerFromGame, getPlayerIdFromSession, playForBots } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import withSession from "~/lib/session";
import { IAction } from "~/lib/state";

interface Payload {
  gameId: string;
  action: IAction;
}

export default withSession(async (req, res) => {
  const { gameId, action } = req.body as Payload;
  const playerId = await getPlayerIdFromSession(req);

  let game = await loadGame(gameId);
  const player = getPlayerFromGame(game, playerId);
  if (!player) {
    return res.status(403).json({ error: "Player is not in game", gameId, playerId });
  }
  if (player.bot) {
    return res.status(403).json({ error: "Player is a bot", gameId, playerId });
  }

  const maximumPossibleScore = getMaximumPossibleScore(game);

  game = commitAction(game, {
    ...action,
    from: player.index,
  });

  const misplay = maximumPossibleScore !== getMaximumPossibleScore(game);
  if (game.options.preventLoss && misplay) {
    return res.json({ misplay: true });
  }

  updateGame(game);
  playForBots(game);

  return res.json(game);
});
