import React from "react";

export default function DiscordButton() {
  return (
    <a
      className="db br3 w4 pa2 ml4 mt2 discord-button"
      href="https://discord.gg/QEWtYdW"
      rel="noopener noreferrer"
      style={{ backgroundColor: "#8b9dff", height: "50px" }}
      target="_blank"
      title="Discord"
    >
      <img alt="Discord" src="/static/discord.svg" />
      <style jsx>
        {`
          .discord-button {
            box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
            -webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
          }
        `}
      </style>
    </a>
  );
}
