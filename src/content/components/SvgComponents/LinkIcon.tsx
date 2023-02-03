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
      d="M11.1333 5.15L13.0167 3.26667C14.0417 2.24167 15.7083 2.24167 16.7333 3.26667C17.7583 4.29167 17.7583 5.95835 16.7333 6.98335L12.2167 11.5C11.1917 12.525 9.525 12.525 8.5 11.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.86655 14.85L6.98322 16.7333C5.95822 17.7583 4.29155 17.7583 3.26655 16.7333C2.24155 15.7083 2.24155 14.0416 3.26655 13.0166L7.78322 8.49995C8.80822 7.47495 10.4749 7.47495 11.4999 8.49995"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
