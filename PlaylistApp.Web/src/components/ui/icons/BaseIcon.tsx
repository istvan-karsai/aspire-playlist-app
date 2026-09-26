import { type SVGProps } from "react";

interface BaseIconProps extends SVGProps<SVGSVGElement> {
    d: string;
}

export const BaseIcon = ({ d, ...props }: BaseIconProps) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        aria-hidden="true"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
);