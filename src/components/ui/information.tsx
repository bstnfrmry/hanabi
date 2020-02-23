import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const Information = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative pl2 z-5" onClick={() => setOpen(!open)}>
      <div className="absolute w1 h1 flex justify-center items-center br-100 bg-white black">
        i
      </div>

      {open && (
        <div className="absolute ml4 pa2 br2 bg-white black w5">
          {props.children}
        </div>
      )}
    </div>
  );
};

export default Information;
