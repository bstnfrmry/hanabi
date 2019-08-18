import { useState } from "react";

export default function Lobby({ game, player, onJoinGame, onStartGame }) {
  const [name, setName] = useState("");

  const players = Object.values(game.players || {});
  const canStart = players.length > 1 && players.length < 6;

  return (
    <>
      <h1>Lobby</h1>

      {player && <h2>Joined as {player.name}</h2>}

      <p>Share this link to other players</p>

      <h2>Players:</h2>
      {players.map((player, i) => (
        <p key={i}>{player.name}</p>
      ))}

      <hr />

      {!player && (
        <form>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type="button" onClick={() => onJoinGame({ name })}>
            Join game
          </button>
        </form>
      )}

      <hr />

      <button disabled={!canStart} onClick={onStartGame}>
        Start game
      </button>
    </>
  );
}
