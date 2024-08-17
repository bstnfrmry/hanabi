import classnames from "classnames";
import Image from "next/legacy/image";
import React from "react";
interface Props {
  className?: string;
}

// Copied from the HTML style guide of the buymeacoffee button

export default function BuymeacoffeeButton(props: Props) {
  const { className } = props;

  return (
    <>
      <a
        className={classnames("bmc-button flex", className)}
        href="https://www.buymeacoffee.com/hanabicards"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image
          alt="Buy us a coffee on website buymeacoffee.com"
          height={34}
          src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
          width={35}
        />
        <span>Buy us a coffee</span>
        <style jsx>
          {`
            .bmc-button img {
              height: 34px;
              width: 35px;
              margin: 0 5px 1px 0;
              box-shadow: none;
              border: none;
              vertical-align: middle;
            }
            .bmc-button {
              padding: 7px 15px 7px 10px;
              line-height: 35px;
              height: 51px;
              width: fit-content;
              text-decoration: none;
              color: #111;
              background-color: #ffdd00;
              border-radius: 8px;
              border: 1px solid transparent;
              font-size: 24px;
              letter-spacing: 0.6px;
              box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
              font-family: "Cookie", cursive;
              box-sizing: border-box;
            }
            .bmc-button:hover,
            .bmc-button:active,
            .bmc-button:focus {
              text-decoration: none;
              box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
              opacity: 0.85;
              color: #111;
            }
          `}
        </style>
      </a>
    </>
  );
}
