import React from "react";
import Popover from "react-popover";
import { CornerMark } from "~/components/cornerMark";
import { ReceivedHintsView } from "~/components/receivedHintsView";
import { ITurn } from "~/lib/state";

export function ReceivedHintsPopover(props: {
  hints: ITurn[];
  open: boolean;
  onActivationChange: (shouldActivate: boolean) => void;
}) {
  return (
    <Popover
      body={<ReceivedHintsView hints={props.hints} />}
      className="z-999"
      isOpen={props.open}
      onOuterAction={() => props.onActivationChange(false)}
    >
      <CornerMark onActivationChange={props.onActivationChange} />
    </Popover>
  );
}
