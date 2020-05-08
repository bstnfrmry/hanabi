import { play } from "~/lib/ai";
import { updateGame } from "~/lib/firebase";
import { ID, uniqueId } from "~/lib/id";
import { sleep } from "~/lib/promise";
import IGameState, { IGameStatus } from "~/lib/state";

export async function api(path: string, payload: any) {
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  }).then(res => res.json());
}

export function getPlayerFromGame(game: IGameState, playerId: ID) {
  return game.players.find(player => player.id === playerId);
}

export async function getPlayerIdFromSession(req): Promise<ID> {
  let playerId = req.session.get("playerId");
  if (playerId === undefined) {
    playerId = uniqueId();
    req.session.set("playerId", playerId);
    await req.session.save();
  }

  return playerId;
}

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
