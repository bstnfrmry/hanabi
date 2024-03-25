import React from "react";
import Turn from "~/components/turn";
import { ITurn } from "~/lib/state";

export function ReceivedHintsView(props: { hints?: ITurn[] }) {
  return (
    <div className="flex items-center justify-center b--yellow ba bw1 bg-black pa2 pr3 br2">
      <div className="flex flex-column">
        {props.hints?.map((turn, i) => {
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
