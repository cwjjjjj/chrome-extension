import { css } from "@emotion/react";
import { HTMLAttributes } from "react";
import { Button, IconButton } from "rsuite";
import CollaspedFillIcon from "@rsuite/icons/CollaspedFill";
import { MyTab } from "../../utils/tabs";
import DefaultFavicon from "./SvgComponents/DefaultFavicon";

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  data: MyTab;
  onRemove: () => void;
  onActive: () => void;
}

export default function Tab({ data, onRemove, onActive, ...props }: TabProps) {
  if (!data) {
    return null;
  }
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 20px 40px 1fr;
        align-items: center;
        gap: 5px;

        .title {
          white-space: nowrap;
        }

        .iconImg {
          height: 20px;
          width: 20px;
          object-fit: contain;
        }
      `}
      onClick={onActive}
    >
      <IconButton
        icon={<CollaspedFillIcon />}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        css={css`
          background-color: transparent;
        `}
      />
      {data?.favIconUrl ? (
        <img src={data?.favIconUrl} className="iconImg" />
      ) : (
        <DefaultFavicon className="iconImg" />
      )}
      <p className="title">{data.title}</p>
    </div>
  );
}
