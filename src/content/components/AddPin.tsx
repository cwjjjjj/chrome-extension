import { css } from "@emotion/react";
import { Dispatch, HTMLAttributes } from "react";
import { PinnedTab } from "../App";
import PlusIcon from "@rsuite/icons/Plus";

export interface AddPinProps extends HTMLAttributes<HTMLDivElement> {
  pinnedTabs: PinnedTab[];
  setPinnedTabs: Dispatch<PinnedTab[]>;
  setIsEditing: Dispatch<boolean>;
}

export default function AddPin({
  setPinnedTabs,
  pinnedTabs,
  setIsEditing,
  ...props
}: AddPinProps) {
  return (
    <div
      css={css`
        /* 46 - 1 , 46 - 2  */
        height: 45px;
        width: 44px;
        color: grey;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 12px;
        display: grid;
        justify-items: center;
        align-items: center;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.15);

        &:hover::after {
          position: absolute;
          height: 46px;
          width: 46px;
          content: "";
          border-radius: 12px;
          background-image: linear-gradient(to bottom, #fff, transparent);
          top: -2px;
          left: -1px;
          z-index: -1;
        }

        &:hover {
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.6) 100%,
            rgba(255, 255, 255, 0.5) 100%
          );
        }

        .favIconImg {
          height: 20px;
          width: 20px;
          object-fit: contain;
        }
      `}
      onClick={() => {
        setIsEditing(true);
      }}
      {...props}
    >
      <PlusIcon className="favIconImg" />
    </div>
  );
}
