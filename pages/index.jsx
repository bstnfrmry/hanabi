import React from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push("/new-game")}>Create a room</button>
      <button onClick={() => router.push("/join-game")}>Join a room</button>
    </div>
  );
}
