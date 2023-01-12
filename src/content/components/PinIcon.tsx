import { css } from "@emotion/react";
import { HTMLAttributes } from "react";
import { IconButton } from "rsuite";
import { MyTab } from "../../utils/tabs";
import CloseIcon from "@rsuite/icons/Close";
import PinnedIcon from "@rsuite/icons/Pin";
import { PinnedTab } from "../App";

export interface PinIconProps extends HTMLAttributes<HTMLDivElement> {
  data: PinnedTab;
  onRemove: () => void;
}

export default function PinIcon({
  data,
  onClick,
  onRemove,
  ...props
}: PinIconProps) {
  if (!data) {
    return null;
  }
  return (
    <div
      css={css`
        /* 60 - 1 , 60 - 2  */
        height: 59px;
        width: 58px;

        .favIconImg {
          height: 20px;
          width: 20px;
          object-fit: contain;
          pointer-events: none;
        }

        /* .closeIcon {
          position: absolute;
          width: 15px;
          height: 15px;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          color: red;
        } */
      `}
      onClick={onClick}
      {...props}
    >
      {data?.favIconUrl ? (
        <img src={data?.favIconUrl} alt="icon" className="favIconImg" />
      ) : (
        <PinnedIcon className="favIconImg" />
      )}

      {/* <CloseIcon className="closeIcon" onClick={onRemove} /> */}
    </div>
  );
}
