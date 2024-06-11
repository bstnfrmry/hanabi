import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Popover from "react-popover";
import TextFieldDialog from "~/components/textFieldDialog";
import Txt from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { updateGame } from "~/lib/firebase";
import { isGameFinished } from "~/lib/game";
import { addOrReplaceReviewComment, findComment } from "~/lib/reviewComments";
import { IReviewComment } from "~/lib/state";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pencil = require("~/images/YellowPencil.svg");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Clear = require("~/images/Clear.svg");

export function ReviewCommentIcon(props: { size: number; placeholder?: boolean }) {
  if (props.placeholder) {
    return <Image height={props.size} src={Clear} width={props.size} />;
  }
  return <Image height={props.size} src={Pencil} width={props.size} />;
}

export function ReadOnlyCommentMarker(props: { size: number }) {
  const style = {
    width: props.size,
    height: props.size,
    borderLeft: "6px solid  var(--color-review-comment)",
    borderRight: "0px solid black",
    borderBottom: "6px solid black",
    borderTop: "6px solid black",
    backgroundColor: "black",
    borderRadius: 0,
  };
  return <div className="dib" style={style} />;
}
function EnterReviewComment(props: {
  existingComment: string;
  afterTurnNumber: number;
  onClose: (msg: string, afterTurnNumber: number) => void;
}) {
  const { t } = useTranslation();
  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      props.onClose(props.existingComment, props.afterTurnNumber);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <TextFieldDialog
      clearButtonText={t("clear")}
      doneButtonText={t("save")}
      initialValue={props.existingComment || ""}
      placeHolderText={t("reviewCommentPlaceholder")}
      onClose={(msg) => props.onClose(msg, props.afterTurnNumber)}
    >
      <div className={"tl"}>
        {t("turn")} # {props.afterTurnNumber}
      </div>
    </TextFieldDialog>
  );
}

export function StaticReviewComment(props: { comment: IReviewComment }) {
  return <Txt className={"b--none ma0 white"}>{props.comment?.comment}</Txt>;
}

export function ReviewCommentPopover({ showAlways = false, turnNumber }: { turnNumber: number; showAlways?: boolean }) {
  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const [reviewCommentOpenForTurn, setReviewCommentOpenForTurn] = useState<number | undefined>(undefined);
  const comment = findComment(game, selfPlayer.id, turnNumber);
  const showIcon = showAlways || comment;

  const commentIsEditable = !isGameFinished(game);
  return (
    <Popover
      body={
        !commentIsEditable ? (
          <div className={"flex flex-column bg-black pa2 items-center justify-start b--yellow br2 ba bw1"}>
            <StaticReviewComment comment={comment} />
          </div>
        ) : (
          <EnterReviewComment
            afterTurnNumber={turnNumber}
            existingComment={comment?.comment}
            onClose={(msg, turnNumber: number) => {
              addOrReplaceReviewComment(game, {
                playerId: selfPlayer.id,
                afterTurnNumber: turnNumber,
                comment: msg,
              });
              updateGame(game.originalGame ? game.originalGame : game);
              setReviewCommentOpenForTurn(undefined);
            }}
          />
        )
      }
      className="z-999"
      isOpen={reviewCommentOpenForTurn !== undefined}
      place={"below"}
      onOuterAction={() => setReviewCommentOpenForTurn(undefined)}
    >
      <a
        className="pointer grow ml2"
        onClick={(e) => {
          e.stopPropagation();
          if (reviewCommentOpenForTurn === undefined && showIcon) {
            setReviewCommentOpenForTurn(turnNumber);
          } else {
            setReviewCommentOpenForTurn(undefined);
          }
        }}
      >
        {!showIcon || commentIsEditable ? (
          <ReviewCommentIcon placeholder={!showIcon} size={15} />
        ) : (
          <ReadOnlyCommentMarker size={15} />
        )}
      </a>
    </Popover>
  );
}
