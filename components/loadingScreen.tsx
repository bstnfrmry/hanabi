import React from "react";
import posed from "react-pose";

import Box from "~/components/ui/box";
import { useState, useEffect } from "react";

const Animation = posed.div({
  attention: {
    opacity: 0.7,
    transition: {
      type: "spring",
      stiffness: 10,
      damping: 0
    }
  }
});

export default function LoadingScreen() {
  const [pose, setPose] = useState(null);

  useEffect(() => {
    setTimeout(() => setPose("attention"), 100);
  });

  return (
    <Box className="w-100 h-100 flex flex-column justify-center items-center f1 outline-main-dark ttu bg-main-dark">
      <Animation pose={pose}>Loading...</Animation>
    </Box>
  );
}
