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
        /* 60 - 1 , 60 - 2  */
        height: 59px;
        width: 58px;
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
          height: 60px;
          width: 60px;
          content: "";
          border-radius: 12px;
          background: linear-gradient(to bottom, #fff, transparent);
          top: -2px;
          left: -1px;
          z-index: -1;
        }

        &:hover {
          background-image: linear-gradient(
            to bottom,
            rgba(176, 174, 174, 0.3) 0%,
            rgba(255, 255, 255, 0.15) 100%
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
