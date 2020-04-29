import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

import Rules from "~/components/rules";
import { TutorialContext } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
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
    <div className="flex justify-center items-center w-100 h-100 pa2">
      {!showRules && (
        <div className="flex justify-center">
          <Button className="mr2" size={ButtonSize.MEDIUM} text="Menu" onClick={onMenuClick} />
          {game.status === IGameStatus.ONGOING && (
            <Button className="mr2" size={ButtonSize.MEDIUM} text="Tutorial" onClick={onTutorialClick} />
          )}
          <Button size={ButtonSize.MEDIUM} text="Rules" onClick={() => setShowRules(true)} />
        </div>
      )}

      {showRules && <Rules setShowRules={setShowRules} />}
    </div>
  );
}
