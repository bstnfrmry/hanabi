import React from "react";

export default ({ type, value, selected }) => {
  if (type === "color") {
    return (
      <div
        className={
          "ba pointer flex items-center justify-center mr1 br-100 h2 w2 bg-hanabi-" +
          value +
          (selected === "true" ? " bw1" : "")
        }
      />
    );
  } else {
    return (
      <div
        className={
          "ba pointer flex items-center justify-center mr1 br-100 h2 w2 bg-silver " +
          (selected === "true" ? " bw1" : "")
        }
      >
        {value}
      </div>
    );
  }
};
