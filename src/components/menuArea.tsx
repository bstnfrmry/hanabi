import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Rules from "~/components/rules";
import { TutorialContext } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import { useGame } from "~/hooks/game";
import { IGameStatus } from "~/lib/state";

interface Props {
  onCloseArea: Function;
}

export default function MenuArea(props: Props) {
  const { onCloseArea } = props;

  const [showRules, setShowRules] = useState(false);
  const { reset } = useContext(TutorialContext);
  const router = useRouter();
  const game = useGame();
  const { t } = useTranslation();

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
          <Button className="mr2" size={ButtonSize.MEDIUM} text={t("menu")} onClick={onMenuClick} />
          {game.status === IGameStatus.ONGOING && (
            <Button className="mr2" size={ButtonSize.MEDIUM} text={t("tutorial")} onClick={onTutorialClick} />
          )}
          <Button size={ButtonSize.MEDIUM} text={t("rules")} onClick={() => setShowRules(true)} />
        </div>
      )}

      {showRules && (
        <div className="aspect-ratio--object z-9999 overflow-y-scroll">
          <Rules setShowRules={setShowRules} />
        </div>
      )}
    </div>
  );
}
