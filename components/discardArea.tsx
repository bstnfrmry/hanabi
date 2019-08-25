import { useGame } from "~/hooks/game";

import DiscardPile from "~/components/discardPile";

interface Props {
  onCloseDiscard: Function;
}

export default function DiscardArea(props: Props) {
  const { onCloseDiscard } = props;

  const game = useGame();

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f7 f4-l fw2 ttu ml1">
        Discarded cards
        <a className="ml2" onClick={() => onCloseDiscard()}>
          &times;
        </a>
      </div>
      <DiscardPile cards={game.discardPile} />
    </div>
  );
}
