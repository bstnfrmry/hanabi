import classnames from "classnames";
import { TFunction } from "i18next";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowContainer, Popover } from "react-tiny-popover";
import posed, { PoseGroup } from "react-pose";
import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import ChatPopover from "~/components/chatPopover";
import PlayerName, { PlayerNameSize } from "~/components/playerName";
import PlayerStats from "~/components/playerStats";
import ReactionsPopover from "~/components/reactionsPopover";
import { ReviewCommentPopover } from "~/components/reviewComments";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import Vignettes from "~/components/vignettes";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";
import { useReplay } from "~/hooks/replay";
import { matchColor, matchNumber, MaxHints } from "~/lib/actions";
import IGameState, {
  GameMode,
  GameVariant,
  IAction,
  ICard,
  IColor,
  IGameStatus,
  IHintAction,
  INumber,
  IPlayer,
} from "~/lib/state";
import { isTutorialAction, useTutorialAction } from "~/lib/tutorial";
import { POPOVER_ARROW_COLOR, POPOVER_CONTENT_STYLE } from "~/components/popoverAppearance";

function isCardHintable(game: IGameState, hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? matchColor(card.color, hint.value as IColor)
    : matchNumber(game, card.number, hint.value as INumber);
}
function textualHint(game: IGameState, hint: IHintAction, cards: ICard[], t: TFunction) {
  const hintableCards = cards
    .map((c, i) => (isCardHintable(game, hint, c) ? i : null))
    .filter((i) => i !== null)
    .map((i) => PositionMap[i]);

  if (hintableCards.length === 0) {
    if (hint.type === "color") return t("negativeHintColor", { color: t(hint.value as string, { count: 5 }) });
    // count= 5, to force plural in some languages
    else return t("negativeHintNumber", { number: hint.value });
  }

  if (hint.type === "color") {
    return t("positiveHintColor", {
      count: hintableCards.length, // whether to use the plural translation
      positions: hintableCards.join(", "),
      color: t(hint.value as string, { count: hintableCards.length }),
    });
  } else {
    if (game.options.variant === GameVariant.SEQUENCE) {
      return t("positiveHintNumberSequence", {
        count: hintableCards.length,
        positions: hintableCards.join(", "),
        number: hint.value,
      });
    }

    return t("positiveHintNumber", {
      count: hintableCards.length,
      positions: hintableCards.join(", "),
      number: hint.value,
    });
  }
}

interface Props extends HTMLAttributes<HTMLElement> {
  player: IPlayer;
  selected: boolean;
  active?: boolean;
  self?: boolean;
  cardIndex?: number;
  displayStats: boolean;
  onSelectPlayer: (player: IPlayer, cardIndex: number) => void;
  onNotifyPlayer?: (player: IPlayer) => void;
  onReaction?: (reaction: string) => void;
  onCommitAction: (action: IAction) => void;
  onCloseArea: () => void;
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
    displayStats,
    ...attributes
  } = props;

  const game = useGame();
  const { t } = useTranslation();
  const replay = useReplay();
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [hideCards, setHideCards] = useState(true);
  const [selectedCard, selectCard] = useState<number>(cardIndex);
  const [revealCards, setRevealCards] = useState(false);
  const [pendingHint, setPendingHint] = useState<IHintAction>({
    type: null,
    value: null,
  } as IHintAction);

  const selfPlayer = useSelfPlayer(game);
  const currentPlayer = useCurrentPlayer(game);
  const tutorialAction = useTutorialAction();

  function nothingInvoked() {
    return chatOpen === false && reactionsOpen === false;
  }
  useEffect(() => {
    setRevealCards(false);
  }, [game.id]);

  useEffect(() => {
    let tempHideCards = true;
    // Show cards when spectating game
    if (!selfPlayer) {
      tempHideCards = false;
    }
    // Show cards to other players
    if (!self && selfPlayer) {
      tempHideCards = false;
    }
    // Show cards in replay mode (when toggled)
    if (revealCards) {
      tempHideCards = false;
    }
    // Before game has started, hide cards in pass&play mode
    if (game.options.gameMode === GameMode.PASS_AND_PLAY && game.status === IGameStatus.LOBBY) {
      tempHideCards = true;
    }
    setHideCards(tempHideCards);
  }, [game.status, revealCards, game.options.gameMode, selfPlayer, self]);

  const canPlay = [IGameStatus.ONGOING, IGameStatus.OVER].includes(game.status) && !replay.cursor;

  const hasSelectedCard = selectedCard !== null;
  const cardContext = selected
    ? ICardContext.TARGETED_PLAYER
    : self
    ? ICardContext.SELF_PLAYER
    : ICardContext.OTHER_PLAYER;

  const showReviewCommentPopover =
    self && game.status === IGameStatus.ONGOING && game.originalGame?.status !== IGameStatus.OVER;
  return (
    <>
      <div
        className={classnames("cards flex justify-between bg-main-dark pa2 pv2-l ph6.5-m relative", {
          "flex-column": selected,
        })}
        onClick={() => {
          if (!selected) onSelectPlayer(player, 0);
        }}
        {...attributes}
      >
        <div className="flex items-center">
          <div className="flex flex-wrap flex-row">
            <div className="flex flex-column">
              {player === selfPlayer && player === currentPlayer && (
                <Tutorial placement="right" step={ITutorialStep.YOUR_TURN}>
                  <Txt
                    className="yellow nt1"
                    id="your-turn"
                    size={TxtSize.XSMALL}
                    value={game.status === IGameStatus.LOBBY ? t("youWillStart") : t("yourTurn")}
                  />
                </Tutorial>
              )}
              <div className={classnames("flex items-center")}>
                {player === currentPlayer && <Txt className="yellow mr2" size={TxtSize.SMALL} value="➤" />}
                <PlayerName className="mr2" explicit={true} player={player} size={PlayerNameSize.MEDIUM} />
              </div>
            </div>

            {!self && player.reaction && (
              <Txt
                style={{
                  animation: "FontPulse 600ms 5",
                }}
                value={player.reaction}
              />
            )}
          </div>
          <div>
            {self && !replay.cursor && (
              <Popover
                containerClassName="z-999"
                content={({ position, childRect, popoverRect }) => {
                  return (
                    <ArrowContainer
                      arrowColor={POPOVER_ARROW_COLOR} // determined from .b--yellow
                      arrowSize={10}
                      arrowStyle={{ opacity: 1 }}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      position={position}
                    >
                      <ReactionsPopover
                        style={POPOVER_CONTENT_STYLE}
                        onClose={() => setReactionsOpen(false)}
                        onReaction={onReaction}
                      />
                    </ArrowContainer>
                  );
                }}
                isOpen={reactionsOpen}
                padding={5}
                onClickOutside={() => setReactionsOpen(false)}
              >
                <a
                  className="pointer grow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReactionsOpen(!reactionsOpen);
                    setChatOpen(false);
                  }}
                >
                  {player.reaction && (
                    <Txt
                      style={{
                        animation: "FontPulse 600ms 5",
                      }}
                      value={player.reaction}
                    />
                  )}
                  {!player.reaction && <Txt style={{ filter: "grayscale(100%)" }} value="︎︎︎︎😊" />}
                </a>
              </Popover>
            )}

            {self && !replay.cursor && game.status !== IGameStatus.LOBBY && (
              <Popover
                containerClassName="z-999"
                content={({ position, childRect, popoverRect }) => {
                  return (
                    <ArrowContainer
                      arrowColor={POPOVER_ARROW_COLOR} // determined from .b--yellow
                      arrowSize={10}
                      arrowStyle={{ opacity: 1 }}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      position={position}
                    >
                      {<ChatPopover style={POPOVER_CONTENT_STYLE} onClose={() => setChatOpen(false)} />}
                    </ArrowContainer>
                  );
                }}
                isOpen={chatOpen}
                padding={5}
                onClickOutside={() => setChatOpen(false)}
              >
                <a
                  className="pointer grow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatOpen(!chatOpen);
                    setReactionsOpen(false);
                  }}
                >
                  <span className={classnames({ grayscale: !chatOpen })}>
                    &nbsp;
                    <Txt value="💬" />
                  </span>
                </a>
              </Popover>
            )}

            {showReviewCommentPopover && (
              <ReviewCommentPopover
                handleKeyEvent={nothingInvoked() ? "c" : undefined}
                initiallyGray={true}
                showAlways={true}
                turnNumber={game.turnsHistory.length}
              />
            )}

            {active && selfPlayer && !self && !player.notified && !player.bot && (
              <a
                className="ml1 ml4-l pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onNotifyPlayer(player);
                }}
              >
                <Txt value="🔔" />
              </a>
            )}
          </div>

          {selected && (
            <a className="absolute top-0 right-0 mt2 mr3 pr6.5-m" onClick={() => onCloseArea()}>
              <Txt value="×" />
            </a>
          )}
        </div>

        <div className={classnames("flex justify-end self-end flex-grow-1 dib")}>
          {displayStats && (
            <div className="ml3">
              <PlayerStats className="w4.5" player={player} />
            </div>
          )}
          {!displayStats && (
            <div className="relative flex items-center justify-end flex-grow-1 dib">
              {selected && (
                <Txt
                  className="lavender absolute top--1 right-2 dib"
                  size={TxtSize.XSMALL}
                  style={{ marginTop: "-1px" }}
                  value="⟶"
                />
              )}

              {/* When game has ended (even in replay mode)
              Enable user to view their game */}
              {(game.endedAt || game.originalGame?.endedAt) && player === selfPlayer && (
                <Button
                  void
                  className={classnames(
                    {
                      revealCardButton: selected,
                    },
                    "tracked-tight"
                  )}
                  size={ButtonSize.TINY}
                  text={revealCards ? t("hide") : t("reveal")}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRevealCards(!revealCards);
                  }}
                />
              )}

              <PoseGroup>
                {player.hand.map((card, i) => (
                  <AnimatedCard key={card.id}>
                    <Card
                      card={card}
                      className={classnames({
                        "ma1": selected,
                        "mr1 mr2-l": i < player.hand.length - 1,
                      })}
                      context={cardContext}
                      hidden={hideCards}
                      position={i}
                      selected={
                        selected &&
                        (player === selfPlayer ? selectedCard === i : isCardHintable(game, pendingHint, card))
                      }
                      size={selected ? CardSize.LARGE : CardSize.MEDIUM}
                      style={{
                        ...(selected && { transition: "all 50ms ease-in-out" }),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlayer(player, i);
                        if (player === selfPlayer) {
                          selectCard(i);
                        }
                      }}
                    />
                  </AnimatedCard>
                ))}
              </PoseGroup>
            </div>
          )}
        </div>
      </div>

      {/* Self player actions */}
      <div
        className="ph6.5-m"
        style={{
          transform: "translateY(0)",
          transition: "transform 150ms ease-in-out",
          ...(!selected && { opacity: 0, transform: "translateY(-100px)" }),
        }}
      >
        {canPlay && selected && player === selfPlayer && selfPlayer === currentPlayer && (
          <div className="flex flex-column items-end mb2">
            <div className="flex justify-end items-center h-100-l">
              {hasSelectedCard && (
                <Txt
                  className="pb1 pb2-l ml1 mb2 mr3 ml2-l"
                  value={t("cardSelected", { position: PositionMap[selectedCard] })}
                />
              )}

              {hasSelectedCard && (
                <div className="flex flex pb2">
                  {["discard", "play"].map((action) => (
                    <Button
                      key={action}
                      className="mr2"
                      disabled={
                        (action === "discard" && game.tokens.hints === 8) ||
                        (action === "discard" && player.hand.length === 0) ||
                        !isTutorialAction(game, tutorialAction?.action, {
                          action: action as "discard" | "play",
                          from: 0,
                          cardIndex: selectedCard,
                        })
                      }
                      id={action}
                      text={t(action)}
                      onClick={() => {
                        onCommitAction({
                          action: action as "discard" | "play",
                          from: selfPlayer.index,
                          cardIndex: selectedCard,
                        });
                        setPendingHint({ value: null, type: null } as IHintAction);
                        selectCard(null);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            {hasSelectedCard && game.tokens.hints === MaxHints && (
              <Txt className="orange mr2 flex flex-column items-end">
                <span>{t("eightTokens")}</span>
                <span>{t("cannotDiscard")}</span>
              </Txt>
            )}
          </div>
        )}
      </div>

      {/* Other player actions */}
      <div
        className="ph6.5-m"
        style={{
          opacity: 1,
          transform: "translateY(0)",
          transition: "all 150ms ease-in-out",
          ...(!selected && { opacity: 0, transform: "translateY(-100px)" }),
        }}
      >
        {canPlay && selected && player !== selfPlayer && selfPlayer === currentPlayer && (
          <div className="flex flex-column items-end pb2 mr2">
            <Vignettes pendingHint={pendingHint} onSelect={(action) => setPendingHint(action)} />

            <div className="mt2 flex items-center">
              {pendingHint.value && game.tokens.hints !== 0 && (
                <Txt italic className="mr3" value={textualHint(game, pendingHint, player.hand, t)} />
              )}
              {game.tokens.hints === 0 && <Txt className="mr3 orange" value={t("noTokens")} />}
              {!pendingHint.value && game.tokens.hints > 0 && <Txt className="mr3" value={t("selectVignette")} />}

              <Button
                disabled={
                  !pendingHint.type ||
                  game.tokens.hints === 0 ||
                  !isTutorialAction(game, tutorialAction?.action, { action: "hint", to: player.index, ...pendingHint })
                }
                id="give-hint"
                text={t("hint")}
                onClick={() => {
                  onCommitAction({
                    action: "hint",
                    from: currentPlayer.index,
                    to: player.index,
                    ...pendingHint,
                  });
                  setPendingHint({ value: null, type: null } as IHintAction);
                  selectCard(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <style global jsx>{`
        .revealCardButton {
          position: absolute;
          top: -1.3rem;
          right: 3.5rem;
        }

        @media screen and (min-width: 60em) {
          .revealCardButton {
            position: relative;
            top: 0;
            right: 0;
          }
        }
      `}</style>
    </>
  );
}

const AnimatedCard = posed.div({
  enter: {
    opacity: 1,
    transition: {
      delay: 200,
      duration: 100,
    },
  },
  exit: {
    opacity: 0.1,
    transition: {
      duration: 100,
    },
  },
});
