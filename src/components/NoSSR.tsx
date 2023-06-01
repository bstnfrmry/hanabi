import dynamic from "next/dynamic";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const NoSSR = (props: Props) => <React.Fragment>{props.children}</React.Fragment>;
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});

export const isSSREnabled = () => typeof window === "undefined";
