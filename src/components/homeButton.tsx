import { useRouter } from "next/router";
import React from "react";
import Button, { ButtonSize } from "~/components/ui/button";

interface Props {
  void?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function HomeButton(props: Props) {
  const { void: void_, className, onClick } = props;

  const router = useRouter();

  function onMenuClick() {
    if (onClick) {
      return onClick();
    } else {
      router.push("/");
    }
  }

  return <Button className={className} size={ButtonSize.TINY} text="☰" void={void_} onClick={onMenuClick} />;
}
