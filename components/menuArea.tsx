import { useContext, useState } from "react";
import { useRouter } from "next/router";

import Button, { IButtonSize } from "~/components/ui/button";
import { TutorialContext } from "~/components/tutorial";
import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import { IColor } from "~/game/state";
import Vignette from "~/components/vignette";

interface Props {
  onCloseArea: Function;
}

export default function MenuArea(props: Props) {
  const { onCloseArea } = props;

  const [showRules, setShowRules] = useState(false);
  const { reset } = useContext(TutorialContext);
  const router = useRouter();

  function onMenuClick() {
    router.push("/");
  }

  function onTutorialClick() {
    reset();
    onCloseArea();
  }

  return (
    <div className="flex justify-center items-center w-100 h-100">
      {!showRules && (
        <div className="flex flex-column w-50 h-50">
          <Button
            size={IButtonSize.SMALL}
            onClick={onTutorialClick}
            className="mb4"
          >
            Watch tutorial again
          </Button>
          <Button
            size={IButtonSize.TINY}
            onClick={() => setShowRules(true)}
            className="mb4"
          >
            Show rules
          </Button>
          <Button size={IButtonSize.TINY} onClick={onMenuClick}>
            Back to menu
          </Button>
        </div>
      )}

      {showRules && (
        <div className="w-100 h-100 w-75-l ph4 relative tj lh-copy">
          <Button
            className="absolute left-2 top-1"
            size={IButtonSize.TINY}
            onClick={() => setShowRules(false)}
          >
            {"<"}
          </Button>
          <img
            className="absolute top-0 right-0 mw4 o-50"
            src="/static/hanabi.png"
          />

          <h1 className="w-100 tc f2 f1-l mt2">Hanabi</h1>
          <h2 className="f4 f2-l">Objective</h2>
          <p className="f6 f3-l">
            Hanabi is a cooperative game, which means a game in which players
            are not against each other but assemble to reach a common goal. They
            incarn here distracted arsonists who - by inattention - mixed their
            powder, wicks and rockets for a large fireworks display. The show
            will begin soon and the situation is a bit chaotic. They will need
            to help each other to prevent the show turning to disaster.
          </p>
          <p className="f6 f3-l">
            J'ai pas non plus envie de traduire tout le manuel, mais c'est un
            bon début.
          </p>
          <p className="f6 f3-l">
            On devrait facilement pouvoir reprendre les composants visuels pour
            mieux illustrer, par exemple
            <Card
              className="inline-flex mh1"
              context={ICardContext.OTHER}
              card={{ color: IColor.RED, number: 4 }}
              size={CardSize.SMALL}
            />
            ou
            <Vignette className="inline-flex mh1" type="number" value={5} />
          </p>
        </div>
      )}
    </div>
  );
}
