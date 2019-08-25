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
    <div className="flex items-center justify-center b--yellow ba bw1 bg-white pa2 pt3 pr3 br2 main-dark f2">
      {Reactions.map((reaction, i) => (
        <span
          className="mh1 pointer"
          key={i}
          onClick={() => {
            onClose();
            onReaction(null);
            setImmediate(() => {
              onReaction(reaction);
            });
          }}
        >
          {reaction}
        </span>
      ))}
      {selfPlayer.reaction && (
        <span
          className="ml4 pointer f4"
          onClick={() => {
            onClose();
            onReaction(null);
          }}
        >
          {ClearReaction}
        </span>
      )}
    </div>
  );
}
