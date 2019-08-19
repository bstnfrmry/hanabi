import { useState } from "react";

export default function Lobby({ game, player, onJoinGame, onStartGame }) {
  const [name, setName] = useState("");

  const players = Object.values(game.players || {});
  const gameFull = players.length === game.playersCount;
  const canJoin = !player && !gameFull;

  return (
    <div className="pa4 bg-grey bt bg-gray-light">
      <h1>Lobby</h1>

      {player && <h2>Joined as {player.name}</h2>}

      <p>Share this link to other players</p>

      <h2>Players:</h2>
      {players.map((player, i) => (
        <p key={i}>{player.name}</p>
      ))}

      {canJoin && (
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

      {gameFull && <p>Game is full</p>}

      {player && (
        <button disabled={!gameFull} onClick={onStartGame}>
          Start game
        </button>
      )}
    </div>
  );
}
