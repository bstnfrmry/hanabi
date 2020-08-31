import React, { useState } from "react";
import Popover from "react-popover";

import Txt, { TxtSize } from "~/components/ui/txt";
import { useTutorialAction } from "~/lib/tutorial";

export default function TutorialInstructions() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const action = useTutorialAction();

  if (!action) {
    return <Txt size={TxtSize.SMALL}>Hopefully you got the jist of it ;)</Txt>;
  }

  return (
    <>
      <Txt size={TxtSize.XSMALL}>{action.content}</Txt>
      <Txt className="mt3 txt-yellow" size={TxtSize.SMALL}>
        ➤ {action.todo}
      </Txt>
      <div className="absolute bottom-1 right-1">
        <Popover
          body={
            <div
              className="flex items-center justify-center b--yellow ba bw1 bg-white pa2 br2 main-dark"
              onClick={() => setIsPopoverOpen(false)}
            >
              <Txt size={TxtSize.SMALL}>
                Hanabi is a game with endless options and possibilities. There is no right choice when playing.
                <br />
                <br />
                This tutorial aims to help you understand a basic play style you'll be able to use with your friends.
              </Txt>
            </div>
          }
          className="z-999"
          isOpen={isPopoverOpen}
          onOuterAction={() => setIsPopoverOpen(false)}
        >
          <a onClick={() => setIsPopoverOpen(true)}>⚠</a>
        </Popover>
      </div>
    </>
  );
}
