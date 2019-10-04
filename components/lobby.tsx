import { useRouter } from "next/router";
import generateName from "project-name-generator";
import React, { useEffect, useState } from "react";

import PlayerName from "~/components/playerName";
import Button, { ButtonSize } from "~/components/ui/button";
import { TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { GameMode } from "~/game/state";
import { useGame, useSelfPlayer } from "~/hooks/game";

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
  const canJoin =
    (game.options.gameMode === GameMode.PASS_AND_PLAY || !selfPlayer) &&
    !gameFull;
  const canStart = gameFull;

  const router = useRouter();
  const [name, setName] = useState(generateName().dashed);
  const [bot, setBot] = useState(false);

  const shareLink = `${window.location.origin}/play?gameId=${router.query.gameId}`;
  const inputRef = React.createRef<HTMLInputElement>();
  function copy() {
    inputRef.current.select();
    document.execCommand("copy");
  }

  useEffect(() => {
    setName(generateName().dashed);
  }, [game.players.length]);

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
            {canStart && (
              <Button
                primary
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
              onJoinGame({ name, bot });
            }}
          >
            <div className="flex flex-column justify-left">
              <Txt>Chose your player name</Txt>
              <div className="flex justify-center items-center mr2">
                <TextInput
                  autoFocus={true}
                  className="flex-grow-1 mr2"
                  id="player-name"
                  style={{ width: "12rem" }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <Button primary id="join-game" text="Join" />
              </div>
              {/* <Field
                label={
                  <Txt className="gray" size={TxtSize.SMALL} value="Autoplay" />
                }
                style={{width: '80px'}}
              >
                <Checkbox
                  checked={bot}
                  className="ml2"
                  id="autoplay"
                  onChange={e => setBot(e.target.checked)}
                />
              </Field> */}
            </div>
          </form>
        )}

        <div className="flex mt4">
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
