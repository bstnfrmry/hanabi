import React from "react";

import Txt, { TxtSize } from "~/components/ui/txt";
import { useSelfPlayer } from "~/hooks/game";

const ClearReaction = "🚫";
const Reactions = ["👍", "👎", "👏", "😅", "🤩", "🤭", "🤔", "😬", "♻️"];

interface Props {
  onReaction: Function;
  onClose: Function;
}

export default function ReactionsPopover(props: Props) {
  const { onReaction, onClose } = props;

  const selfPlayer = useSelfPlayer();

  return (
    <div className="flex items-center justify-center b--yellow ba bw1 bg-white pa2 pt3 pr3 br2">
      {Reactions.map((reaction, i) => (
        <a
          key={i}
          className="mh1"
          onClick={() => {
            onClose();
            onReaction(null);
            setImmediate(() => {
              onReaction(reaction);
            });
          }}
        >
          <Txt size={TxtSize.LARGE} value={reaction} />
        </a>
      ))}
      {selfPlayer.reaction && (
        <a
          className="ml4"
          onClick={() => {
            onClose();
            onReaction(null);
          }}
        >
          <Txt size={TxtSize.MEDIUM} value={ClearReaction} />
        </a>
      )}
    </div>
  );
}
