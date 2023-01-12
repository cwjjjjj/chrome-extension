import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.59998 1H7.90001L3.00002 5.84615L3.00002 6.53846M8.59998 1H14.2C15.7464 1 17 2.23983 17 3.76923L17 16.2308C17 17.7602 15.7464 19 14.2 19H5.79999C4.2536 19 3 17.7602 3 16.2308L3.00002 6.53846M8.59998 1V6.53846H3.00002"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
