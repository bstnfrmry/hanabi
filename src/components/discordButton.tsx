import React from "react";

export default function DiscordButton() {
  return (
    <a
      className="db br2 w4 pr1"
      href="https://discord.gg/QEWtYdW"
      rel="noopener noreferrer"
      style={{ backgroundColor: "#7289DA", height: "40px" }}
      target="_blank"
    >
      <img src="/static/discord.svg" />
    </a>
  );
}
