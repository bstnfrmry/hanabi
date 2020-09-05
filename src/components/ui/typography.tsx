import classnames from "classnames";
import React, { ReactNode } from "react";

import Txt, { TxtSize } from "~/components/ui/txt";

interface TxtProps {
  children: ReactNode;
  className?: string;
}

export const Title = (props: TxtProps) => (
  <Txt className={classnames("txt-yellow mt3", props.className)} size={TxtSize.MEDIUM}>
    {props.children}
  </Txt>
);

export const Subtitle = (props: TxtProps) => (
  <Txt className={classnames("mt2", props.className)} size={TxtSize.MEDIUM}>
    {props.children}
  </Txt>
);

export const Paragraph = (props: TxtProps) => (
  <Txt className={classnames("mv2", props.className)}>{props.children}</Txt>
);
