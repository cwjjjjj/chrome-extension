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
      d="M9.14175 15.9916C5.35842 15.9916 2.29175 12.925 2.29175 9.14163C2.29175 5.35829 5.35842 2.29163 9.14175 2.29163C12.9251 2.29163 15.9917 5.35829 15.9917 9.14163C15.9917 12.925 12.9251 15.9916 9.14175 15.9916Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.7084 17.7083L14.2834 14.2833"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
