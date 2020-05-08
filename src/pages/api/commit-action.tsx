import { commitAction, getMaximumPossibleScore } from "~/lib/actions";
import { play } from "~/lib/ai";
import { getPlayerFromGame, getPlayerIdFromSession } from "~/lib/api";
import { loadGame, updateGame } from "~/lib/firebase";
import { sleep } from "~/lib/promise";
import withSession from "~/lib/session";
import IGameState, { IAction, IGameStatus } from "~/lib/state";

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

export async function playForBots(game: IGameState) {
  while (true) {
    const nextPlayer = game.players[game.currentPlayer];
    if (!nextPlayer.bot) {
      break;
    }
    if (game.status === IGameStatus.OVER) {
      break;
    }

    if (game.options.botsWait) {
      nextPlayer.reaction = "🧠";
      await updateGame(game);
    }

    await sleep(game.options.botsWait);

    game = play(game);
    game.players.find(player => player.id === nextPlayer.id).reaction = null;

    await updateGame(game);
  }
}
