import { ID, uniqueId } from "~/lib/id";
import IGameState from "~/lib/state";

export async function sendRequest(path: string, payload: any) {
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
