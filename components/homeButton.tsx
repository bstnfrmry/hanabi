import { useRouter } from "next/router";
import React from "react";

import Button, { ButtonSize } from "~/components/ui/button";

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
    <Button
      className={className}
      size={ButtonSize.TINY}
      text="☰"
      onClick={onMenuClick}
    />
  );
}
