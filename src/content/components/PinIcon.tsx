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
        /* background: red; */
        cursor: pointer;
        position: relative;

        img {
          height: 30px;
          width: 30px;
        }

        .closeIcon {
          position: absolute;
          width: 15px;
          height: 15px;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          color: red;
        }
      `}
      {...props}
    >
      <div onClick={onClick}>
        {data?.favIconUrl ? (
          <img src={data?.favIconUrl} alt="icon" />
        ) : (
          <IconButton icon={<PinnedIcon />} />
        )}
      </div>

      {/* <IconButton className="closeIcon" icon={<CloseIcon />} /> */}
      <CloseIcon className="closeIcon" onClick={onRemove} />
    </div>
  );
}
