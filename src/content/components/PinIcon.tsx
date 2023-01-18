import { css } from "@emotion/react";
import { HTMLAttributes, useState } from "react";
import { IconButton } from "rsuite";
import PinnedIcon from "@rsuite/icons/Pin";
import { PinnedTab } from "../App";
import CloseIcon from "./SvgComponents/CloseIcon";

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
        /* 60 - 1 , 60 - 2  */
        height: 59px;
        width: 58px;
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
          width: 15px;
          height: 15px;
          right: 10px;
          top: 10px;
          transform: translate(50%, -50%);
          &:hover {
            background-color: rgba(255, 255, 255, 0.15);
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
        <CloseIcon
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
