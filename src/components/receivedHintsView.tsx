import React, { CSSProperties } from "react";
import Turn from "~/components/turn";
import { IHintAction, ITurn } from "~/lib/state";

export function ReceivedHintsView(props: { hints: ITurn<IHintAction>[]; style?: CSSProperties }) {
  return (
    <div className="flex items-center justify-center ba bw1 bg-black pa2 pr3 br2" style={props.style}>
      <div className="flex flex-column">
        {props.hints.map((turn, i) => {
          return (
            <div key={i} className="nb1">
              <Turn showDrawn={false} showPosition={false} turn={turn} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
