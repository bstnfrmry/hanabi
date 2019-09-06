import { keyBy } from "lodash";
import { useRouter } from "next/router";
import generateName from "project-name-generator";
import React, { useState } from "react";

import PlayerName from "~/components/playerName";
import Button, { ButtonSize } from "~/components/ui/button";
import { Checkbox, Field, Select, TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";

export const Emojis = ["🐶", "🦊", "🐸", "🦋", "🐯", "🐱"];

export const BotEmojis = ["🤖", "👽", "👾", "🤡", "🐲"];

interface Props {
  onJoinGame: Function;
  onAddBot: Function;
  onStartGame: Function;
}

export default function Lobby(props: Props) {
  const { onJoinGame, onAddBot, onStartGame } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();

  const gameFull = game.players.length === game.options.playersCount;
  const canJoin = !selfPlayer && !gameFull;
  const availableEmojis = Emojis.filter(
    e => !game.players.find(p => p.emoji === e)
  );

  const router = useRouter();
  const [name, setName] = useState(generateName().dashed);
  const [emoji, setEmoji] = useState(availableEmojis[0]);
  const [bot, setBot] = useState(false);

  const shareLink = `${window.location.origin}/play?gameId=${router.query.gameId}`;
  const inputRef = React.createRef<HTMLInputElement>();
  function copy() {
    inputRef.current.select();
    document.execCommand("copy");
  }

  return (
    <div className="flex items-center justify-center h-100 w-100">
      <div className="flex flex-column pa2 w-100 h-100">
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
                    id="add-ai"
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
                id="start-game"
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
            className="flex items-start mt5 w-100 flex-grow-1"
            onSubmit={e => {
              e.preventDefault();
              onJoinGame({ name, emoji, bot });
            }}
          >
            <Select
              className="w3 h2.5 indent mr2 pl1"
              id="player-emoji"
              options={keyBy(availableEmojis)}
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
            />
            <div className="flex flex-column justify-center items-end mr2">
              <TextInput
                className="flex-grow-1 h2.5 ttu"
                id="player-name"
                style={{ width: "12rem" }}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Field
                label={
                  <Txt className="gray" size={TxtSize.SMALL} value="Autoplay" />
                }
              >
                <Checkbox
                  checked={bot}
                  className="ml2"
                  id="autoplay"
                  onChange={e => setBot(e.target.checked)}
                />
              </Field>
            </div>
            <Button id="join-game" text="Join" />
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
