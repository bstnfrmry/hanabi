import classnames from "classnames";
import React, { CSSProperties, PropsWithChildren, useState } from "react";
import Popover from "react-popover";
import { ReceivedHintsView } from "~/components/receivedHintsView";
import { useUserPreferences } from "~/hooks/userPreferences";
import { IColor, IHintAction, INumber, ITurn } from "~/lib/state";

export type PopoverMarkerType = "colors" | "numbers";
export function TombstoneHintMark(
  props: PropsWithChildren<{
    classnames?: string;
    style?: CSSProperties;
    onActivationChange: (b: boolean) => void;
  }>
) {
  return (
    <div
      className={classnames("absolute top-0 bg-hints flex-ns justify-center")}
      style={{
        ...props.style,
        borderBottomRightRadius: "50%",
        borderBottomLeftRadius: "50%",
        width: "20%",
        height: "20%",
      }}
      onMouseEnter={() => {
        props.onActivationChange(true);
      }}
      onMouseLeave={() => props.onActivationChange(false)}
    >
      {props.children}
    </div>
  );
}

function ColorHintMark(props: { hintColor: IColor; onActivationChange: (activate: boolean) => void }) {
  return (
    <TombstoneHintMark style={{ right: "2%" }} onActivationChange={props.onActivationChange}>
      <div
        className={`bg-${props.hintColor}`}
        style={{
          borderRadius: "50%",
          height: "60%",
          width: "60%",
          marginTop: "20%",
        }}
      ></div>
    </TombstoneHintMark>
  );
}

function NumberHintMark(props: {
  onActivationChange: (activate: boolean) => void;
  large: boolean;
  hintNumber: INumber;
}) {
  const fontSize = props.large ? "3cqh" : "1.8cqh";
  return (
    <TombstoneHintMark style={{ right: "24%" }} onActivationChange={props.onActivationChange}>
      <span className={`light-gray fs-normal sans-serif`} style={{ fontSize: fontSize }}>
        {props.hintNumber}
      </span>
    </TombstoneHintMark>
  );
}

export function CornerMark(props: { onActivationChange: (b: boolean) => void }) {
  return (
    <div
      className={"absolute right-0 br--left top-0 br--bottom br-100 bg-hints"}
      style={{ width: "20%", height: "20%" }}
      onMouseEnter={() => {
        props.onActivationChange(true);
      }}
      onMouseLeave={() => props.onActivationChange(false)}
    />
  );
}

function HiddenMark() {
  return (
    <div className={"absolute top-0 left-0 bg-hints-hidden"} style={{ width: "100%", height: "20%" }}>
      <br />
    </div>
  );
}

function HintsPopover(
  props: PropsWithChildren<{
    hints: ITurn<IHintAction>[];
    open: boolean;
    large?: boolean;
    onActivationChange: (shouldActivate: boolean) => void;
  }>
) {
  if (props.hints === undefined || props.hints?.length === 0) {
    return null;
  }
  const childCount = React.Children.toArray(props.children).length;
  if (childCount != 1) {
    console.error("Exactly one child should provided");
  }
  return (
    <Popover
      body={<ReceivedHintsView hints={props.hints} />}
      className="z-999"
      isOpen={props.open}
      onOuterAction={() => props.onActivationChange(false)}
    >
      {props.children}
    </Popover>
  );
}

function SelfActivatingHintsPopover(props: {
  markerType: PopoverMarkerType;
  hints: ITurn<IHintAction>[];
  location: "top-left" | "top-right";
  honorMouseEnterMark: boolean;
  large: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  if (props.hints?.length === 0) {
    return null;
  }
  const action = props?.hints[0].action;
  const hintValue = action.value;

  return (
    <HintsPopover hints={props.hints} large={props.large} open={isOpen} onActivationChange={onActivation}>
      {props.markerType === "colors" ? (
        <ColorHintMark hintColor={hintValue as IColor} onActivationChange={onActivation} />
      ) : (
        <NumberHintMark hintNumber={hintValue as INumber} large={props.large} onActivationChange={onActivation} />
      )}
    </HintsPopover>
  );

  function onActivation(activate: boolean) {
    if (!props.honorMouseEnterMark) {
      return;
    }
    setIsOpen(activate);
  }
}

export function ReceivedHints(props: {
  hints: ITurn<IHintAction>[];
  allHintsOpen: boolean;
  large: boolean;
  onActivationChange: (shouldActivate: boolean) => void;
}) {
  const [userPreferences] = useUserPreferences();
  const hints = props.hints || [];

  const colorHints = hints.filter((turn) => turn.action.type === "color");
  const numberHints = hints.filter((turn) => turn.action.type === "number");
  if (userPreferences.codedHintMarkers) {
    return (
      <>
        <HintsPopover hints={hints} open={props.allHintsOpen} onActivationChange={props.onActivationChange}>
          <HiddenMark />
        </HintsPopover>
        <SelfActivatingHintsPopover
          hints={colorHints}
          honorMouseEnterMark={!props.allHintsOpen}
          large={props.large}
          location="top-left"
          markerType={"colors"}
        />
        <SelfActivatingHintsPopover
          hints={numberHints}
          honorMouseEnterMark={!props.allHintsOpen}
          large={props.large}
          location="top-right"
          markerType={"numbers"}
        />
      </>
    );
  }

  return (
    <HintsPopover hints={hints} open={props.allHintsOpen} onActivationChange={props.onActivationChange}>
      <CornerMark onActivationChange={props.onActivationChange} />
    </HintsPopover>
  );
}
