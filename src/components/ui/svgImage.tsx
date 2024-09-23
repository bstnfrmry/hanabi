import Image from "next/legacy/image";
import React from "react";
interface ImportedSvg {
  src: string;
  width: number;
  height: number;
}

export function SvgImage(props: { svg: ImportedSvg; alt?: string; width?: number; height?: number }) {
  const svg = props.svg;
  const location = window.location;
  return (
    <Image
      alt={props.alt}
      height={props.height || svg.height}
      src={location.protocol + "//" + location.host + svg.src.substr(1)}
      width={props.width || svg.width}
    />
  );
}
