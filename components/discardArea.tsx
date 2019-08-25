import { useGame } from "~/hooks/game";

import DiscardPile from "~/components/discardPile";

interface Props {
  onCloseArea: Function;
}

export default function DiscardArea(props: Props) {
  const { onCloseArea } = props;

  const game = useGame();

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f7 f4-l fw2 ttu ml1">
        <a onClick={() => onCloseArea()}>
          Discarded cards
          <span className="ml2">&times;</span>
        </a>
      </div>
      <DiscardPile cards={game.discardPile} />
    </div>
  );
}
