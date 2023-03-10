import { css } from "@emotion/react";
import { HTMLAttributes, useState } from "react";
import PinnedIcon from "@rsuite/icons/Pin";
import { PinnedTab } from "../App";
import OpacityCloseIcon from "./SvgComponents/OpacityCloseIcon";

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
  const [isShowCloseButton, setIsShowCloseButton] = useState(false);
  if (!data) {
    return null;
  }
  return (
    <div
      css={css`
        /* 46 - 1 , 46 - 2  */
        height: 45px;
        width: 44px;
        position: relative;

        .favIconImg {
          height: 20px;
          width: 20px;
          object-fit: contain;
          pointer-events: none;
          color: white;
        }

        .closeIcon {
          position: absolute;
          width: 10px;
          height: 10px;
          right: 3px;
          top: 3px;
          border-radius: 50%;

          &:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        }
      `}
      onClick={onClick}
      onMouseEnter={() => {
        setIsShowCloseButton(true);
      }}
      onMouseLeave={() => {
        setIsShowCloseButton(false);
      }}
      {...props}
    >
      {data?.favIconUrl ? (
        <img src={data?.favIconUrl} alt="icon" className="favIconImg" />
      ) : (
        <PinnedIcon className="favIconImg" />
      )}

      {isShowCloseButton && (
        <OpacityCloseIcon
          className="closeIcon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </div>
  );
}
