import React from "react";

export default function DiscordButton() {
  return (
    <a
      className="db br3 w4 pa2 ml4 mt2 discord-button"
      href="https://discord.gg/QEWtYdW"
      rel="noopener noreferrer"
      target="_blank"
      title="Discord"
    >
      <img alt="Discord" src="/static/discord.svg" />
      <style jsx>
        {`
          .discord-button {
            height: 50px;
            background-color: #8b9dff;
            box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
          }
        `}
      </style>
    </a>
  );
}
