import { useRouter } from "next/router";

import Button, { IButtonSize } from "./ui/button";

interface Props {
  className?: string;
}

export default function HomeButton(props: Props) {
  const { className } = props;

  const router = useRouter();

  function onMenuClick() {
    router.push("/");
  }

  return (
    <Button size={IButtonSize.TINY} onClick={onMenuClick} className={className}>
      ☰
    </Button>
  );
}
