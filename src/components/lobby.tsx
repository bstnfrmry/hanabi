import { last } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";

import Button from "~/components/ui/button";
import { Checkbox, Field, TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { GameMode, IPlayer } from "~/game/state";
import { useGame, useSelfPlayer } from "~/hooks/game";

function listPlayerNames(players: IPlayer[]) {
  if (!players.length) {
    return null;
  }

  if (players.length === 1) {
    return players[0].name;
  }

  const firstNames = players
    .slice(0, -1)
    .map(player => player.name)
    .join(", ");
  const lastName = last(players).name;

  return `${firstNames} & ${lastName}`;
}

function Meta() {
  const game = useGame();

  const playersNames = listPlayerNames(
    game.players.filter(player => !player.bot)
  );

  const description = playersNames
    ? `${playersNames} invited you to a game of Hanabi 🎉`
    : `You've been invited to a game of Hanabi 🎉`;

  return (
    <Head>
      <meta content={description} property="og:description" />
    </Head>
  );
}

interface Props {
  host: string;
  onJoinGame: Function;
  onAddBot: Function;
  onStartGame: Function;
}

const NAME_KEY = "name";

export default function Lobby(props: Props) {
  const { host, onJoinGame, onAddBot, onStartGame } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const router = useRouter();
  const [name, setName] = useState("");
  const [bot, setBot] = useState(false);

  const gameFull = game.players.length === game.options.playersCount;
  const canJoin =
    (game.options.gameMode === GameMode.PASS_AND_PLAY || !selfPlayer) &&
    !gameFull;
  const canStart = gameFull;

  const shareLink = `${host}/play?gameId=${router.query.gameId}`;
  const inputRef = React.createRef<HTMLInputElement>();
  function copy() {
    inputRef.current.select();
    document.execCommand("copy");
  }

  useEffect(() => {
    if (
      game.options.gameMode === GameMode.PASS_AND_PLAY &&
      game.players.length > 0
    ) {
      setName("");
    } else {
      setName(localStorage.getItem(NAME_KEY) || "");
    }
  }, [game.players.length]);

  function onJoinGameSubmit(e: FormEvent) {
    e.preventDefault();
    onJoinGame({ name, bot });

    if (game.players.length === 0) {
      localStorage.setItem(NAME_KEY, name);
    }
  }

  return (
    <div className="flex items-center justify-center h-100 w-100 pa2">
      <Meta />
      <div className="flex flex-column pa2 w-100 h-100">
        <div className="mb3 ttu flex items-center">
          <Txt size={TxtSize.MEDIUM} value="Lobby" />
        </div>
        {game.players.length > 0 && (
          <div className="flex justify-between items-start flex-grow-1 align-start w-100 mb2">
            <div>
              <div className="flex flex-column justify-center mb2">
                <div className="flex items-center">
                  <Txt
                    value={
                      gameFull
                        ? "Everybody's here!"
                        : `${game.players.length} / ${game.options.playersCount} joined already`
                    }
                  />
                  {canStart && (
                    <Button
                      primary
                      className="ml3"
                      disabled={!gameFull}
                      id="start-game"
                      text="Start game"
                      onClick={() => onStartGame()}
                    />
                  )}
                </div>
                {selfPlayer && !gameFull && (
                  <div>
                    <Txt className="gray">Wait for others, or </Txt>
                    <a
                      className="underline gray pointer ml1"
                      id="add-ai"
                      onClick={() => onAddBot()}
                    >
                      <Txt value="+ add AI" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {canJoin && (
          <form
            className="flex items-start mt5 w-100 flex-grow-1"
            onSubmit={onJoinGameSubmit}
          >
            <div className="flex flex-column justify-left">
              <Txt>Choose your player name</Txt>
              <div className="flex justify-center items-center mr2">
                <TextInput
                  autoFocus={true}
                  className="flex-grow-1 mr2"
                  id="player-name"
                  style={{ width: "12rem" }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <Button
                  primary
                  disabled={name.length === 0}
                  id="join-game"
                  text="Join"
                />
              </div>
              {process.env.NODE_ENV !== "production" && (
                <Field
                  label={
                    <Txt
                      className="gray"
                      size={TxtSize.SMALL}
                      value="Autoplay"
                    />
                  }
                  style={{ width: "80px" }}
                >
                  <Checkbox
                    checked={bot}
                    className="ml2"
                    id="autoplay"
                    onChange={e => setBot(e.target.checked)}
                  />
                </Field>
              )}
            </div>
          </form>
        )}
        {!gameFull && (
          <div className="flex mt4">
            <div className="flex flex-column mr2">
              <Txt className="mb1" value="Share this game" />
              <a
                className="lavender flex-1"
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
            <Button text="Copy" onClick={copy} />
          </div>
        )}
      </div>
    </div>
  );
}
