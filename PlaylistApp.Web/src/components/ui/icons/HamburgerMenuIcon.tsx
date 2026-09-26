import { type SVGProps } from "react";
import { BaseIcon } from "./BaseIcon";

export const HamburgerMenuIcon = (props: SVGProps<SVGSVGElement>) => (
    <BaseIcon d="M4 6h16M4 12h16M4 18h16" {...props} />
);