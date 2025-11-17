import type { SVGProps } from "react";

export interface SVGIconT extends SVGProps<SVGSVGElement> {
  theme?: "dark" | "light";
}
