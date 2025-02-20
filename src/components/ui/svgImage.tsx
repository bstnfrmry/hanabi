import Image from "next/legacy/image";
import React from "react";

interface SizedSvg {
  src: string;
  width: number;
  height: number;
}
interface DefaultWrappedSvg {
  default: SizedSvg;
}
type ImportedSvg = DefaultWrappedSvg | SizedSvg;
function isDefaultWrappedSvg(svg: ImportedSvg): svg is DefaultWrappedSvg {
  return "default" in svg;
}
export function SvgImage(props: { svg: ImportedSvg; alt?: string; width?: number; height?: number }) {
  const svg: SizedSvg = isDefaultWrappedSvg(props.svg) ? props.svg.default : props.svg;
  const location = window.location;
  const svgUrl = location.protocol + "//" + location.host + svg.src.substring(1);
  return <Image alt={props.alt} height={props.height || svg.height} src={svgUrl} width={props.width || svg.width} />;
}
