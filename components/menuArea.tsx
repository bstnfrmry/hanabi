import { useContext } from "react";
import { useRouter } from "next/router";

import Button, { IButtonSize } from "~/components/ui/button";
import { TutorialContext } from "~/components/tutorial";

interface Props {
  onCloseArea: Function;
}

export default function MenuArea(props: Props) {
  const { onCloseArea } = props;

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
      <div className="flex flex-column w-50 h-50">
        <Button
          size={IButtonSize.SMALL}
          onClick={onTutorialClick}
          className="mb4"
        >
          Watch tutorial again
        </Button>
        <Button size={IButtonSize.TINY} onClick={onMenuClick}>
          Back to menu
        </Button>
      </div>
    </div>
  );
}
