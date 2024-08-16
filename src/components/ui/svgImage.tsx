import Image from "next/legacy/image";
import React from "react";
interface ImportedSvg {
  default: {
    src: string;
    width: number;
    height: number;
  };
}

export function SvgImage(props: { svg: ImportedSvg; alt?: string }) {
  const svg = props.svg.default;
  console.debug(`SvgImage: ${svg.src.substr(1)}`);
  const location = window.location;
  return (
    <Image
      alt={props.alt}
      height={svg.height}
      src={location.protocol + "//" + location.host + svg.src.substr(1)}
      width={svg.width}
    />
  );
}
