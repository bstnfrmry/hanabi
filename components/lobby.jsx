import { useState } from "react";
import { useRouter } from "next/router";
import generate from "project-name-generator";

export default function Lobby({ game, player, onJoinGame, onStartGame }) {
  const router = useRouter();
  const [name, setName] = useState(generate().dashed);

  const players = Object.values(game.players || {});
  const gameFull = players.length === game.playersCount;
  const canJoin = !player && !gameFull;

  const shareLink = `${window.location.origin}?gameId=${router.query.gameId}`;

  const inputRef = React.createRef();
  function copy() {
    inputRef.current.select();
    document.execCommand("copy");
  }

  return (
    <div className="pa4 bg-grey bt bg-gray-light">
      <h1>Lobby</h1>
      {player && <h2>Joined as {player.name}</h2>}
      <a href={shareLink} target="_blank" className="mr2">
        {shareLink}
      </a>
      <input
        className="fixed"
        style={{ top: -100, left: -100 }}
        ref={inputRef}
        type="text"
        value={shareLink}
        readonly
      />
      <button onClick={copy}>Copy</button>

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
