import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="270"
    height="36"
    viewBox="0 0 270 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0.5 0.5H269.5V35.5H12C5.64873 35.5 0.5 30.3513 0.5 24V0.5Z"
      stroke="url(#paint0_linear_27499_14707)"
      stroke-opacity="0.8"
    />
    <defs>
      <linearGradient
        id="paint0_linear_27499_14707"
        x1="15"
        y1="36"
        x2="20.6778"
        y2="-5.02894"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="0.745835" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgComponent;
