import classnames from "classnames";
import React, { HTMLAttributes, useState } from "react";
import Popover from "react-popover";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import PlayerName, { PlayerNameSize } from "~/components/playerName";
import ReactionsPopover from "~/components/reactionsPopover";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import Vignettes from "~/components/vignettes";
import { MaxHints } from "~/game/actions";
import { ICard, IGameStatus, IHintAction, IPlayer } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

function isCardHintable(hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? card.color === hint.value
    : card.number === hint.value;
}

function textualHint(hint: IHintAction, cards: ICard[]) {
  const hintableCards = cards
    .map((c, i) => (isCardHintable(hint, c) ? i : null))
    .filter(i => i !== null)
    .map(i => PositionMap[i]);

  if (hintableCards.length === 0) {
    if (hint.type === "color") return `You have no ${hint.value} cards.`;
    else return `You have no ${hint.value}s.`;
  }

  if (hintableCards.length === 1) {
    if (hint.type === "color")
      return `Your card ${hintableCards[0]} is ${hint.value}`;
    else return `Your card ${hintableCards[0]} is a ${hint.value}`;
  }

  if (hint.type === "color")
    return `Your cards ${hintableCards.join(", ")} are ${hint.value}`;

  return `Your cards ${hintableCards.join(", ")} are ${hint.value}s`;
}

interface Props extends HTMLAttributes<HTMLElement> {
  player: IPlayer;
  selected: boolean;
  active?: boolean;
  self?: boolean;
  cardIndex?: number;
  onSelectPlayer: Function;
  onNotifyPlayer?: Function;
  onReaction?: Function;
  onCommitAction: Function;
  onCloseArea: Function;
}

export default function PlayerGame(props: Props) {
  const {
    player,
    self = false,
    selected = false,
    cardIndex,
    onSelectPlayer,
    onNotifyPlayer,
    onCommitAction,
    onCloseArea,
    onReaction,
    active,
    ...attributes
  } = props;

  const game = useGame();
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [selectedCard, selectCard] = useState<number>(cardIndex);
  const [pendingHint, setPendingHint] = useState<IHintAction>({
    type: null,
    value: null
  } as IHintAction);

  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const hideCards =
    game.status === IGameStatus.LOBBY ||
    (game.status !== IGameStatus.OVER && (self || !selfPlayer));
  const hasSelectedCard = selectedCard !== null;
  const cardContext = selected
    ? ICardContext.TARGETED_PLAYER
    : self
    ? ICardContext.SELF_PLAYER
    : ICardContext.OTHER_PLAYER;

  return (
    <>
      <div
        className={classnames(
          "cards flex justify-between bg-main-dark pa2 pv3 relative",
          { "flex-column": selected }
        )}
        onClick={() => {
          if (!selected) onSelectPlayer(player, 0);
        }}
        {...attributes}
      >
        <div className="flex items-center">
          <div className="flex flex-column">
            {!selected && player === selfPlayer && player === currentPlayer && (
              <Txt
                className="yellow absolute top-0 mt1"
                size={TxtSize.SMALL}
                value="Your turn"
              />
            )}
            <div className="flex items-center">
              {player === currentPlayer && (
                <Txt className="yellow mr1" size={TxtSize.SMALL} value="➤" />
              )}
              <PlayerName
                className="mr2"
                explicit={true}
                player={player}
                size={PlayerNameSize.MEDIUM}
              />
            </div>
          </div>

          {!self && player.reaction && (
            <Txt
              style={{
                animation: "FontPulse 600ms 5"
              }}
              value={player.reaction}
            />
          )}

          {self && (
            <Popover
              body={
                <ReactionsPopover
                  onClose={() => setReactionsOpen(false)}
                  onReaction={onReaction}
                />
              }
              className="z-999"
              isOpen={reactionsOpen}
              onOuterAction={() => setReactionsOpen(false)}
            >
              <a
                className="pointer grow"
                onClick={e => {
                  e.stopPropagation();
                  setReactionsOpen(!reactionsOpen);
                }}
              >
                {player.reaction && (
                  <Txt
                    style={{
                      animation: "FontPulse 600ms 5"
                    }}
                    value={player.reaction}
                  />
                )}
                {!player.reaction && (
                  <Txt style={{ filter: "grayscale(100%)" }} value="︎︎︎︎😊" />
                )}
              </a>
            </Popover>
          )}

          {active && !self && !player.notified && !player.bot && (
            <a
              className="ml1 ml4-l"
              onClick={e => {
                e.stopPropagation();
                onNotifyPlayer(player);
                new Audio(`/static/sounds/bell.mp3`).play();
              }}
            >
              <Txt value="🔔" />
            </a>
          )}

          {selected && (
            <a
              className={classnames({ ml2: player.reaction || self })}
              onClick={() => onCloseArea()}
            >
              <Txt value="×" />
            </a>
          )}
        </div>

        <div
          className={classnames("flex justify-end flex-grow-1 dib", {
            mt2: selected
          })}
        >
          {player.hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              className={classnames({
                ma1: selected,
                "mr1 mr2-l": i < player.hand.length - 1
              })}
              context={cardContext}
              hidden={hideCards}
              position={i}
              selected={
                selected &&
                (player === selfPlayer
                  ? selectedCard === i
                  : isCardHintable(pendingHint, card))
              }
              size={selected ? CardSize.LARGE : CardSize.MEDIUM}
              style={{
                ...(selected && { transition: "all 50ms ease-in-out" })
              }}
              onClick={e => {
                e.stopPropagation();
                onSelectPlayer(player, i);
                if (player === selfPlayer) {
                  selectCard(i);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Self player actions */}
      <div
        style={{
          transform: "translateY(0)",
          transition: "transform 150ms ease-in-out",
          ...(!selected && { opacity: 0, transform: "translateY(-100px)" })
        }}
      >
        {selected && player === selfPlayer && (
          <div className="flex flex-column items-end mb2">
            <div className="flex justify-end items-center h-100-l">
              {hasSelectedCard && (
                <Txt
                  className="pb1 pb2-l ml1 mb2 mr3 ml2-l"
                  value={`Card ${PositionMap[selectedCard]} selected`}
                />
              )}

              {hasSelectedCard && (
                <div className="flex flex pb2">
                  {["discard", "play"].map(action => (
                    <Button
                      key={action}
                      className="mr2"
                      disabled={action === "discard" && game.tokens.hints === 8}
                      id={action}
                      text={action}
                      onClick={() =>
                        onCommitAction({
                          action,
                          from: selfPlayer.index,
                          cardIndex: selectedCard
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            {game.tokens.hints === MaxHints && (
              <Txt className="orange mr2 flex flex-column items-end">
                <span>8 tokens</span>
                <span>You cannot discard</span>
              </Txt>
            )}
          </div>
        )}
      </div>

      {/* Other player actions */}
      <div
        style={{
          opacity: 1,
          transform: "translateY(0)",
          transition: "all 150ms ease-in-out",
          ...(!selected && { opacity: 0, transform: "translateY(-100px)" })
        }}
      >
        {selected && player !== selfPlayer && (
          <div className="flex flex-column items-end pb2 mr2 mb2">
            <Vignettes
              pendingHint={pendingHint}
              onSelect={action => setPendingHint(action)}
            />

            <div className="mt2 flex items-center">
              {pendingHint.value && game.tokens.hints !== 0 && (
                <Txt
                  italic
                  className="mr3"
                  value={textualHint(pendingHint, player.hand)}
                />
              )}
              {game.tokens.hints === 0 && (
                <Txt className="mr3 orange" value="No tokens left to hint" />
              )}

              <Button
                disabled={!pendingHint.type || game.tokens.hints === 0}
                id="give-hint"
                text="Hint"
                onClick={() =>
                  onCommitAction({
                    action: "hint",
                    from: currentPlayer.index,
                    to: player.index,
                    ...pendingHint
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
