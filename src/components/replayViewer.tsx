import Slider from "rc-slider";
import { MarkObj } from "rc-slider/lib/Marks";
import React, { useCallback, useState } from "react";
import { ReadOnlyCommentMarker, ReviewCommentPopover, StaticReviewComment } from "~/components/reviewComments";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { useReplay } from "~/hooks/replay";
import { isGameFinished } from "~/lib/game";
import { findComment } from "~/lib/reviewComments";
import { IReviewComment } from "~/lib/state";

function Empty() {
  return <div className={"dn"} />;
}
const SliderStyle = {
  DOT: {
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderBottom: "10px solid transparent",
    backgroundColor: "transparent",
    borderTop: "10px solid var(--color-review-comment)",
    borderRadius: 0,
    top: "-20px",
  },
  HANDLE: {
    backgroundColor: "var(--color-yellow)",
    borderColor: "var(--color-yellow)",
    height: "18px",
    width: "18px",
  },
  RAIL: {
    height: "8px",
    backgroundColor: "var(--color-lavender)",
  },
  TRACK: {
    backgroundColor: "var(--color-main)",
    height: "8px",
  },
};

interface Props {
  onReplayCursorChange: (cursor: number) => void;
  onStopReplay: () => void;
}

export default function ReplayViewer(props: Props) {
  const { onReplayCursorChange, onStopReplay } = props;
  const game = useGame();
  const selfPlayer = useSelfPlayer(game);
  const [comment, setComment] = useState<IReviewComment | undefined>(
    findComment(game, selfPlayer?.id, game.turnsHistory.length)
  );
  const replay = useReplay();
  const replayChange = useCallback(
    (cursor: number) => {
      onReplayCursorChange(cursor);
      setComment(findComment(game, selfPlayer?.id, cursor));
    },
    [game, selfPlayer, onReplayCursorChange]
  );

  const maxTurns = game.originalGame.turnsHistory.length;

  const marks: Record<string | number, React.ReactNode | MarkObj> = {};
  const selfReviewComments = game.reviewComments.filter((rc) => rc.playerId === selfPlayer?.id);
  selfReviewComments.forEach((rc) => {
    marks[rc.afterTurnNumber] = {
      style: "",
      label: <Empty />,
    };
  });

  return (
    <div className="flex flex-column items-center w-100">
      <div className="flex justify-between items-center pa2 w-100">
        <div className="flex flex-column">
          <Txt className="db" size={TxtSize.SMALL} value={`Replay`} />
          <Txt
            className="mt1 light-silver nowrap"
            multiline={false}
            size={TxtSize.SMALL}
            value={`${replay.cursor} / ${maxTurns}`}
          />
        </div>
        <Button
          void
          className="ml3"
          disabled={replay.cursor === 0}
          size={ButtonSize.TINY}
          text="<"
          onClick={() => replayChange(replay.cursor - 1)}
        />
        <Slider
          className="ml3 nt1"
          dotStyle={SliderStyle.DOT}
          marks={marks}
          max={maxTurns}
          min={0}
          styles={{
            rail: SliderStyle.RAIL,
            track: SliderStyle.TRACK,
            handle: SliderStyle.HANDLE,
          }}
          value={replay.cursor}
          onChange={replayChange}
          onChangeComplete={replayChange}
        />
        <Button
          void
          className="ml3"
          disabled={replay.cursor === maxTurns}
          size={ButtonSize.TINY}
          text=">"
          onClick={() => replayChange(replay.cursor + 1)}
        />
        <Button void className="ml3 pointer:hover" size={ButtonSize.TINY} text="&times;" onClick={onStopReplay} />
      </div>

      {comment ? (
        <div className={"flex flex-row justify-center"} style={{ gap: "0.5rem" }}>
          <div className={"flex-grow-0"}>
            {isGameFinished(game) ? (
              <ReadOnlyCommentMarker size={15} />
            ) : (
              <ReviewCommentPopover showAlways={true} turnNumber={replay.cursor} />
            )}
          </div>
          <StaticReviewComment comment={comment} />
        </div>
      ) : null}
    </div>
  );
}
