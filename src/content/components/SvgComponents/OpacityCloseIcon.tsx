import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="10" height="10" rx="5" fill="white" fillOpacity="0.15" />
    <path
      d="M7 3L3 7"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 3L7 7"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
