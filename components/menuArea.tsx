import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

import { TutorialContext } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { IGameStatus } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  onCloseArea: Function;
}

export default function MenuArea(props: Props) {
  const { onCloseArea } = props;

  const [showRules, setShowRules] = useState(false);
  const { reset } = useContext(TutorialContext);
  const router = useRouter();
  const game = useGame();

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
        <div className="flex justify-center">
          {game.status === IGameStatus.ONGOING && (
            <Button
              className="mr2"
              size={ButtonSize.MEDIUM}
              text="Tutorial"
              onClick={onTutorialClick}
            />
          )}
          <Button
            className="mr2"
            size={ButtonSize.MEDIUM}
            text="Rules"
            onClick={() => setShowRules(true)}
          />
          <Button size={ButtonSize.MEDIUM} text="Menu" onClick={onMenuClick} />
        </div>
      )}

      {showRules && (
        <div className="w-100 h-100 w-75-l ph4 relative tj lh-copy">
          <Button
            className="absolute left-2 top-1"
            size={ButtonSize.MEDIUM}
            text="<"
            onClick={() => setShowRules(false)}
          />
          <img
            className="absolute top-0 right-0 mw4 o-50"
            src="/static/hanabi.png"
          />

          <div className="flex flex-column">
            <Txt
              className="w-100 tc mt2 dib"
              size={TxtSize.LARGE}
              value="Hanabi"
            />

            <Txt size={TxtSize.MEDIUM} value="Objective" />

            <Txt
              className="mv2"
              value="Hanabi is a cooperative game, which means a game in which players
            are not against each other but assemble to reach a common goal. They
            incarn here distracted arsonists who - by inattention - mixed their
            powder, wicks and rockets for a large fireworks display. The show
            will begin soon and the situation is a bit chaotic. They will need
            to help each other to prevent the show turning to disaster."
            />

            <Txt
              className="mv2"
              value="J'ai pas non plus envie de traduire tout le manuel, mais
            c'est un bon début."
            />
          </div>
        </div>
      )}
    </div>
  );
}
