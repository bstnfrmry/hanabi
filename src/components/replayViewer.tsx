import Slider from "rc-slider";
import React, { useEffect, useState } from "react";

import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";

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
  const [replayCursor, setReplayCursor] = useState(game.replayCursor);

  const maxTurns = game.originalGame.turnsHistory.length - 1;

  useEffect(() => {
    setReplayCursor(game.replayCursor);
  }, [game.replayCursor]);

  return (
    <div className="bg-black-50 flex justify-between items-center pa2">
      <div className="flex flex-column">
        <Txt className="db" size={TxtSize.SMALL} value={`Replay`} />
        <Txt
          className="mt1 light-silver nowrap"
          size={TxtSize.SMALL}
          value={`${replayCursor} / ${maxTurns}`}
        />
      </div>
      <Button
        void
        className="ml3"
        disabled={game.replayCursor === 0}
        size={ButtonSize.TINY}
        text="<"
        onClick={() => onReplayCursorChange(game.replayCursor - 1)}
      />
      <Slider
        className="ml3 nt1"
        handleStyle={SliderStyle.HANDLE}
        max={maxTurns}
        min={0}
        railStyle={SliderStyle.RAIL}
        trackStyle={SliderStyle.TRACK}
        value={replayCursor}
        onAfterChange={onReplayCursorChange}
        onChange={setReplayCursor}
      />
      <Button
        void
        className="ml3"
        disabled={game.replayCursor === maxTurns}
        size={ButtonSize.TINY}
        text=">"
        onClick={() => onReplayCursorChange(game.replayCursor + 1)}
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
