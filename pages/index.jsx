import React from "react";
import { useRouter } from "next/router";
import Button from "../components/button";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/new-game")}>Create a room</Button>
      <Button onClick={() => router.push("/join-game")}>Join a room</Button>
    </div>
  );
}
