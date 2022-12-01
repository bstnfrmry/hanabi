import React from "react";
import { Trans } from "react-i18next";
import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Hint from "~/components/hint";
import PlayerName from "~/components/playerName";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { GameMode, ICard, IDiscardAction, IHintAction, IHintLevel, IPlayAction, ITurn } from "~/lib/state";

interface Props {
  turn: ITurn;
  showDrawn: boolean;
  showPosition?: boolean;
  turnNumber?: number;
}

export default function Turn(props: Props) {
  const { turn, showDrawn, showPosition = true } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();

  const isViewingOwnActions = turn.action.from === selfPlayer?.index;
  const isViewingOwnReceivedHint = turn.action.action === "hint" && turn.action.to === selfPlayer?.index;

  const playerNameFrom = (
    <PlayerName explicit={game.options.gameMode === GameMode.PASS_AND_PLAY} player={game.players[turn.action.from]} />
  );

  let textualTurn;
  let drawnTurn;

  if (turn.action.action === "hint") {
    const playerNameTo = (
      <PlayerName explicit={game.options.gameMode === GameMode.PASS_AND_PLAY} player={game.players[turn.action.to]} />
    );

    if (isViewingOwnActions) {
      textualTurn = (
        <Trans i18nKey="youGaveHintTurn">
          You hinted {playerNameTo} about their <HintValue action={turn.action} />
        </Trans>
      );
    } else if (isViewingOwnReceivedHint) {
      textualTurn = (
        <Trans i18nKey="somebodyHintedYouTurn">
          {playerNameFrom} hinted you about <HintValue action={turn.action} />
        </Trans>
      );
    } else {
      textualTurn = (
        <Trans i18nKey="somebodyHintedSomebodyTurn">
          {playerNameFrom} hinted {playerNameTo} about <HintValue action={turn.action} />
        </Trans>
      );
    }

    if (showPosition) {
      textualTurn = (
        <>
          {textualTurn}
          <CardPosition action={turn.action} />
        </>
      );
    }
  } else if (turn.action.action === "discard") {
    textualTurn = isViewingOwnActions ? (
      <Trans i18nKey="youDiscardedTurn">
        You discarded your <TurnCard card={turn.action.card} context={ICardContext.DISCARDED} />
      </Trans>
    ) : (
      <Trans i18nKey="somebodyDiscardedTurn">
        {playerNameFrom} discarded their <TurnCard card={turn.action.card} context={ICardContext.DISCARDED} />
      </Trans>
    );

    if (showPosition) {
      textualTurn = (
        <>
          {textualTurn}
          <CardPosition action={turn.action} />
        </>
      );
    }
  } else if (turn.action.action === "play") {
    textualTurn = isViewingOwnActions ? (
      turn.failed ? (
        <Trans i18nKey="youPlayedStrikeTurn">
          You caused a strike playing
          <TurnCard card={turn.action.card} context={ICardContext.PLAYED} />
        </Trans>
      ) : (
        <Trans i18nKey="youPlayedTurn">
          You played
          <TurnCard card={turn.action.card} context={ICardContext.PLAYED} />
        </Trans>
      )
    ) : turn.failed ? (
      <Trans i18nKey="somebodyPlayedStrikeTurn">
        {playerNameFrom} caused a strike playing
        <TurnCard card={turn.action.card} context={ICardContext.PLAYED} />
      </Trans>
    ) : (
      <Trans i18nKey="somebodyPlayedTurn">
        {playerNameFrom} played
        <TurnCard card={turn.action.card} context={ICardContext.PLAYED} />
      </Trans>
    );

    if (showPosition) {
      textualTurn = (
        <>
          {textualTurn}
          <CardPosition action={turn.action} />
        </>
      );
    }
  }

  if (showDrawn && turn.card) {
    drawnTurn = (
      <Trans i18nKey={isViewingOwnActions ? "whatYouDrewTurn" : "whatTheyDrewTurn"}>
        and drew <DrawnCard card={turn.card} />
      </Trans>
    );
  }

  return (
    <div className="dib">
      {props.turnNumber ? <Txt className="di gray">{props.turnNumber})&nbsp;</Txt> : ""}
      <Txt className="di">
        {/* The player action and the card they drawn, if applicable */}
        {textualTurn}
        {drawnTurn}
      </Txt>
    </div>
  );
}

const TurnCard = ({ card, context }: { card: ICard; context: ICardContext }) => (
  <span className="dib">
    <Card card={card} className="mr1" context={context} size={CardSize.XSMALL} />
  </span>
);

const HintValue = ({ action }: { action: IHintAction }) => (
  <span className="dib">
    <Hint className="mr1" hint={IHintLevel.POSSIBLE} type={action.type} value={action.value} />
  </span>
);

const CardPosition = ({ action }: { action: IDiscardAction | IPlayAction | IHintAction }) =>
  action.action === "hint" ? (
    <Txt
      className="lavender mr1"
      size={TxtSize.XSMALL}
      value={`${(action?.cardsIndex ?? []).map((index) => PositionMap[index]).join(", ")}`}
    />
  ) : (
    <Txt className="lavender mr1" size={TxtSize.XSMALL} value={`${PositionMap[action.cardIndex]}`} />
  );

const DrawnCard = ({ card }: { card: ICard }) => (
  <span className="dib">
    <Card card={card} className="mr1" context={ICardContext.DRAWN} size={CardSize.XSMALL} />
  </span>
);
