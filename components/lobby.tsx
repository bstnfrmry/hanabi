import { keyBy } from "lodash";
import { useRouter } from "next/router";
import generateName from "project-name-generator";
import React, { useState } from "react";

import PlayerName from "~/components/playerName";
import Button, { ButtonSize } from "~/components/ui/button";
import { Select, TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";

export const Emojis = ["🐶", "🦊", "🐸", "🦋", "🐯", "🐱"];

export const BotEmojis = ["🤖", "👽", "👾", "🤡"];

interface Props {
  onJoinGame: Function;
  onAddBot: Function;
  onStartGame: Function;
}

export default function Lobby(props: Props) {
  const { onJoinGame, onAddBot, onStartGame } = props;

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
    <div className="flex items-center justify-center h-100 w-100">
      <div className="flex flex-column pa2 w-100 h-100 h-50-l w-50-l">
        {game.players.length > 0 && (
          <div className="flex justify-between items-start flex-grow-1 align-start w-100 mb2">
            <div>
              <div className="mb3 ttu flex items-center">
                <Txt size={TxtSize.MEDIUM} value="Players" />
                <Txt
                  className="ml2 gray"
                  value={`· ${game.players.length} / ${game.options.playersCount}`}
                />
              </div>
              <div className="flex flex-column justify-center mb2">
                {game.players.map((player, i) => (
                  <div key={i} className="mb2">
                    <PlayerName explicit={true} player={player} />
                  </div>
                ))}
                {selfPlayer && !gameFull && (
                  <a
                    className="underline gray pointer ml3"
                    onClick={() => onAddBot()}
                  >
                    <Txt value="+ add AI" />
                  </a>
                )}
              </div>
            </div>
            {selfPlayer && (
              <Button
                disabled={!gameFull}
                text="Start game"
                onClick={() => onStartGame()}
              />
            )}
          </div>
        )}
        {game.players.length === 0 && (
          <Txt size={TxtSize.MEDIUM} value="Game is empty" />
        )}

        {canJoin && (
          <form
            className="flex items-center w-100 flex-grow-1"
            onSubmit={e => {
              e.preventDefault();
              onJoinGame({ name, emoji });
            }}
          >
            <Select
              className="w3 h2.5 indent mr2 pl1"
              options={keyBy(availableEmojis)}
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
            />
            <TextInput
              className="flex-grow-1 h2.5 ph3 mr2 ttu"
              style={{ width: "12rem" }}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Button text="Join" />
          </form>
        )}

        <div className="flex items-center justify-between mt4">
          <div className="flex flex-column mr2">
            <Txt className="mb1" value="Share this game" />
            <a
              className="gray flex-1"
              href={shareLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Txt value={shareLink} />
            </a>
          </div>
          <input
            ref={inputRef}
            readOnly
            className="fixed top--2 left--2"
            type="text"
            value={shareLink}
          />
          <Button size={ButtonSize.SMALL} text="Copy" onClick={copy} />
        </div>
      </div>
    </div>
  );
}
