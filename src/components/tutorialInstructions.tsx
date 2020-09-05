import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useTutorialAction } from "~/lib/tutorial";

export default function TutorialInstructions() {
  const [showTutorial, setShowTutorial] = useState(true);
  const action = useTutorialAction();
  const { t } = useTranslation();

  if (!showTutorial) {
    return null;
  }

  if (!action) {
    return (
      <div className="relative flex flex-column bg-black-50 bt b--yellow pv3 ph6.5-m ph2">
        <Txt
          size={TxtSize.XSMALL}
          value={t(
            "tutorialComplete",
            "That's it! You should be ready to play now. You can either finish this game or start a new one with friends!\n\nThanks for following along 🎉\n\nYou can access the complete rules and tour by taping the ☰ button"
          )}
        ></Txt>
        <Button void className="absolute right-0 bottom-0 mb1" text="&times;" onClick={() => setShowTutorial(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-column bg-black-50 bt b--yellow pv3 ph6.5-m ph2">
      <Txt size={TxtSize.XSMALL}>{action.content}</Txt>
      <Txt className="mt3 txt-yellow" size={TxtSize.SMALL}>
        ➤ {action.todo}
      </Txt>
    </div>
  );
}
