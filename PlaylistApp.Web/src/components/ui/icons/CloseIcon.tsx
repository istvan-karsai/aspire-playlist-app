import { type SVGProps } from "react";
import { BaseIcon } from "./BaseIcon";

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
    <BaseIcon d="M6 18L18 6M6 6l12 12" {...props} />
);