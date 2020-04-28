import Slider from "rc-slider";
import React from "react";

import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useReplay } from "~/hooks/game";

const SliderStyle = {
  HANDLE: {
    backgroundColor: "var(--color-yellow)",
    borderColor: "var(--color-yellow)",
    height: "18px",
    width: "18px"
  },
  RAIL: {
    height: "8px",
    backgroundColor: "var(--color-lavender)"
  },
  TRACK: {
    backgroundColor: "var(--color-main)",
    height: "8px"
  }
};

interface Props {
  onReplayCursorChange: (cursor: number) => void;
  onStopReplay: () => void;
}

export default function ReplayViewver(props: Props) {
  const { onReplayCursorChange, onStopReplay } = props;

  const game = useGame();
  const replay = useReplay();

  const maxTurns = game.originalGame.turnsHistory.length;

  return (
    <div className="bg-black-50 flex justify-between items-center pa2">
      <div className="flex flex-column">
        <Txt className="db" size={TxtSize.SMALL} value={`Replay`} />
        <Txt
          className="mt1 light-silver nowrap"
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
        onClick={() => onReplayCursorChange(replay.cursor - 1)}
      />
      <Slider
        className="ml3 nt1"
        handleStyle={SliderStyle.HANDLE}
        max={maxTurns}
        min={0}
        railStyle={SliderStyle.RAIL}
        trackStyle={SliderStyle.TRACK}
        value={replay.cursor}
        onAfterChange={onReplayCursorChange}
        onChange={onReplayCursorChange}
      />
      <Button
        void
        className="ml3"
        disabled={replay.cursor === maxTurns}
        size={ButtonSize.TINY}
        text=">"
        onClick={() => onReplayCursorChange(replay.cursor + 1)}
      />
      <Button
        void
        className="ml3"
        size={ButtonSize.TINY}
        text="&times;"
        onClick={onStopReplay}
      />
    </div>
  );
}
