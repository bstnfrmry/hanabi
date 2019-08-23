import React from "react";
import classnames from "classnames";

export default ({ onClick, className = "", children, disabled = false }) => (
  <div>
    <button
      disabled={disabled}
      className={classnames(
        className,
        "pa2 ba br2 fw2 f6 f4-l lh-copy tracked ttu ml1 dark-gray bg-near-white hover-bg-white grow outline-0",
        { pointer: !disabled, "bg-light-gray gray": disabled }
      )}
      onClick={onClick}
    >
      {children}
    </button>
    <style></style>
  </div>
);
