import classnames from "classnames";
import { uniq } from "lodash";
import React, { CSSProperties, PropsWithChildren, useEffect, useState } from "react";
import Popover from "react-popover";
import { ReceivedHintsView } from "~/components/receivedHintsView";
import { useUserPreferences } from "~/hooks/userPreferences";
import {
  IColor,
  IColorHintAction,
  IHintAction,
  INumberHintAction,
  isColorHintAction,
  isNumberHintAction,
  ITurn,
} from "~/lib/state";

export function TombstoneHintMark(
  props: PropsWithChildren<{
    classnames?: string;
    style?: CSSProperties;
    onActivationChange: (b: boolean) => void;
    heightFactor?: number;
  }>
) {
  const heightFactor = props.heightFactor || 1;
  const verticalRadiusPercent = 100.0 / heightFactor / 2;
  const heightPercent = heightFactor * 20;
  return (
    <div
      className={classnames("absolute top-0 bg-hints flex justify-center flex-column items-center")}
      style={{
        ...props.style,
        borderBottomRightRadius: `50%  ${verticalRadiusPercent}%`,
        borderBottomLeftRadius: `50%  ${verticalRadiusPercent}%`,
        width: "20%",
        height: `${heightPercent}%`,
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

function Dot(props: { color: IColor }) {
  return (
    <div
      style={{
        width: "60%",
        height: "80%",
        marginTop: "20%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        className={`bg-${props.color}`}
        style={{
          borderRadius: "50%",
          aspectRatio: "1/1",
        }}
      />
    </div>
  );
}

function ColorHintMark(props: { hintActions: IHintAction[]; onActivationChange: (activate: boolean) => void }) {
  const colors = uniq(props.hintActions.filter(isColorHintAction).map((a) => a.value));
  return (
    <TombstoneHintMark
      heightFactor={colors.length}
      style={{ right: "2%" }}
      onActivationChange={props.onActivationChange}
    >
      {colors.map((c: IColor, index) => (
        <Dot key={index} color={c} />
      ))}
    </TombstoneHintMark>
  );
}

function NumberHintMark(props: { onActivationChange: (activate: boolean) => void; hintAction: INumberHintAction }) {
  const fontSize = "100cqh";
  return (
    <TombstoneHintMark style={{ right: "24%" }} onActivationChange={props.onActivationChange}>
      <div
        className={`light-gray fs-normal sans-serif tc bg-transparent number-hint-mark`}
        style={{ height: "80%", width: "100%" }}
      >
        <div style={{ fontSize: fontSize }}>{props.hintAction.value}</div>
      </div>
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

function SelfActivatingHintsPopover<HA extends IHintAction>(props: {
  hints: ITurn<HA>[];
  enableMouseEnterMark: boolean;
  onPopoverActivated: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  if (props.hints?.length === 0) {
    return null;
  }
  const colorHintActions = props.hints.map((t) => t.action);
  const action = props.hints[0].action;
  return (
    <HintsPopover hints={props.hints} open={isOpen} onActivationChange={onActivation}>
      {isNumberHintAction(action) ? <NumberHintMark hintAction={action} onActivationChange={onActivation} /> : null}
      {isColorHintAction(action) ? (
        <ColorHintMark hintActions={colorHintActions} onActivationChange={onActivation} />
      ) : null}
    </HintsPopover>
  );

  function onActivation(activate: boolean) {
    if (!props.enableMouseEnterMark) {
      return;
    }
    setIsOpen(activate);
    props.onPopoverActivated(activate);
  }
}

function isColorHintTurn(turn: ITurn<IHintAction>): turn is ITurn<IColorHintAction> {
  return isColorHintAction(turn.action);
}
function isNumberHintTurn(turn: ITurn<IHintAction>): turn is ITurn<INumberHintAction> {
  return isNumberHintAction(turn.action);
}
export function ReceivedHints(props: {
  hints: ITurn<IHintAction>[];
  allHintsOpen: boolean;
  large: boolean;
  onActivationChange: (shouldActivate: boolean) => void;
}) {
  let allHintsOpen = props.allHintsOpen;
  const [codeHintsOpen, setCodedHintsOpen] = useState(false);
  const [userPreferences] = useUserPreferences();
  const hints = props.hints || [];

  const colorHints = hints.filter(isColorHintTurn);
  const numberHints = hints.filter(isNumberHintTurn);
  useEffect(() => {
    if (codeHintsOpen && allHintsOpen && userPreferences.codedHintMarkers) {
      props.onActivationChange(false);
      allHintsOpen = false;
    }
  }, [allHintsOpen]);

  if (userPreferences.codedHintMarkers) {
    return (
      <>
        <HintsPopover hints={hints} open={allHintsOpen} onActivationChange={props.onActivationChange}>
          <HiddenMark />
        </HintsPopover>
        <SelfActivatingHintsPopover
          enableMouseEnterMark={!allHintsOpen}
          hints={colorHints}
          onPopoverActivated={setCodedHintsOpen}
        />
        <SelfActivatingHintsPopover
          enableMouseEnterMark={!allHintsOpen}
          hints={numberHints}
          onPopoverActivated={setCodedHintsOpen}
        />
      </>
    );
  }

  return (
    <HintsPopover hints={hints} open={allHintsOpen} onActivationChange={props.onActivationChange}>
      <CornerMark onActivationChange={props.onActivationChange} />
    </HintsPopover>
  );
}
