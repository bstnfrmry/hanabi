import React, { useState } from "react";
import { useRouter } from "next/router";
import generateName from "project-name-generator";

import { useGame, useSelfPlayer } from "../hooks/game";

import Button from "~/components/button";
import PlayerName from "~/components/playerName";

const Emojis = ["🐶", "🦊", "🐸", "🦋", "🐯", "🐱"];

interface Props {
  onJoinGame: Function;
  onStartGame: Function;
}

export default function Lobby(props: Props) {
  const { onJoinGame, onStartGame } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();

  const gameFull = game.players.length === game.playersCount;
  const canJoin = !selfPlayer && !gameFull;
  const availableEmojis = Emojis.filter(
    e => !game.players.find(p => p.emoji === e)
  );

  const router = useRouter();
  const [name, setName] = useState(generateName().dashed);
  const [emoji, setEmoji] = useState(availableEmojis[0]);

  const shareLink = `${window.location.origin}/play?gameId=${router.query.gameId}`;
  const inputRef = React.createRef<HTMLInputElement>();
  function copy() {
    inputRef.current.select();
    document.execCommand("copy");
  }

  return (
    <div className="ph3 pv2 bg-grey">
      {selfPlayer && (
        <h2>
          Joined as <PlayerName player={selfPlayer} />
        </h2>
      )}
      <div className="flex items-center">
        <a href={shareLink} target="_blank" className="mr2 white">
          {shareLink}
        </a>
        <input
          className="fixed"
          style={{ top: -100, left: -100 }}
          ref={inputRef}
          type="text"
          value={shareLink}
          readOnly
        />
        <Button onClick={copy}>Copy</Button>
      </div>

      <h2>Players:</h2>
      <div className="flex flex-column">
        {game.players.map((player, i) => (
          <PlayerName key={i} player={player} />
        ))}
      </div>
      {canJoin && (
        <form
          className="flex items-center"
          onSubmit={e => {
            e.preventDefault();
            onJoinGame({ name, emoji });
          }}
        >
          <select
            className="bg-white mr2 pl3"
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
          >
            {availableEmojis.map((emoji, i) => (
              <option key={i} value={emoji}>
                {emoji}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button>Join game</Button>
        </form>
      )}
      {gameFull && <p>Game is full</p>}
      {selfPlayer && (
        <Button disabled={!gameFull} onClick={onStartGame}>
          Start game
        </Button>
      )}
    </div>
  );
}
