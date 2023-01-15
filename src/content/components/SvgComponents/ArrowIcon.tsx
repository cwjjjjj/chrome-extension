import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.8355 8.57788L10.5445 12.263C10.4089 12.4135 10.2105 12.5 10 12.5C9.78955 12.5 9.58918 12.4135 9.45559 12.263L6.16457 8.57788C5.98646 8.37848 5.95003 8.11136 6.06944 7.8781C6.18684 7.64485 6.43376 7.5 6.71105 7.5H13.2911C13.5684 7.5 13.8153 7.64485 13.9327 7.8781C14.0501 8.11136 14.0116 8.38036 13.8355 8.57788Z"
      fill="white"
    />
  </svg>
);

export default SvgComponent;
