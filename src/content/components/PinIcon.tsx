import { css } from "@emotion/react";
import { HTMLAttributes } from "react";
import { MyTab } from "../../utils/tabs";

export interface PinIconProps extends HTMLAttributes<HTMLDivElement> {
  data: MyTab;
}

export default function PinIcon({ data, ...props }: PinIconProps) {
  if (!data) {
    return null;
  }
  return (
    <div
      css={css`
        /* background: red; */
        cursor: pointer;

        img {
          height: 30px;
          width: 30px;
        }
      `}
      {...props}
    >
      {data?.favIconUrl && <img src={data?.favIconUrl} alt="icon" />}
    </div>
  );
}
