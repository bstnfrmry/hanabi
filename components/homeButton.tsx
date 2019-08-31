import React from "react";
import { useRouter } from "next/router";

import Button, { IButtonSize } from "./ui/button";

interface Props {
  className?: string;
  onClick?: Function;
}

export default function HomeButton(props: Props) {
  const { className, onClick } = props;

  const router = useRouter();

  function onMenuClick() {
    if (onClick) {
      return onClick();
    } else {
      router.push("/");
    }
  }

  return (
    <Button size={IButtonSize.TINY} onClick={onMenuClick} className={className}>
      ☰
    </Button>
  );
}
