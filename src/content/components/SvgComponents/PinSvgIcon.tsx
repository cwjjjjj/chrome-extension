import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="28"
    viewBox="0 0 22 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11 27L11 20"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 20H21C21 17.0059 19.9697 14.5636 17.9287 12.9305C17.3805 12.4919 17 11.8562 17 11.1542V5C17 2.79086 15.2091 1 13 1H9C6.79086 1 5 2.79086 5 5L5 11.1542C5 11.8562 4.61946 12.4919 4.07135 12.9305C2.03035 14.5636 1 17.0059 1 20Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
