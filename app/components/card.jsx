import React from "react";

const number = 4;
const color = "yellow";

export default props => {
  // Cards possible size
  let sizeClass;

  switch (props.size) {
    case "tiny":
      sizeClass = ""; // TODO h0 doesnt exist
      break;
    case "small":
      sizeClass = "h1 w1";
      break;
    case "medium":
      sizeClass = "h2 w2";
      break;
    case "large":
      sizeClass = "h3 w3";
      break;
    case "extralarge":
      sizeClass = "h4 w3";
      break;
    default:
      sizeClass = "h2 w2";
      break;
  }

  return (
    <div
      className={
        "flex items-center justify-center br1 ba " +
        sizeClass +
        " bg-hanabi-" +
        color
      }
    >
      {number}
    </div>
  );
};
