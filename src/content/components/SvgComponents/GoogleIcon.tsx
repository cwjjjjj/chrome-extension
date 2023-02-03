import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 11.1787C19 10.6596 18.9308 10.2766 18.8703 9.85957H11.1297V12.6H15.7222C15.5578 13.7915 14.347 16.0553 11.1297 16.0553C8.34486 16.0553 6.07892 13.8 6.07892 10.9915C6.07892 6.50638 11.4584 4.4383 14.3384 7.18723L16.5697 5.09362C15.16 3.8 13.2919 3 11.1297 3C6.60648 3 3 6.58297 3 11C3 15.4511 6.60648 19 11.1297 19C15.8173 18.983 19 15.7575 19 11.1787Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
