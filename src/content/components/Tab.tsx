import { css } from "@emotion/react";
import { HTMLAttributes } from "react";
import { Button, IconButton } from "rsuite";
import CollaspedFillIcon from "@rsuite/icons/CollaspedFill";
import { MyTab } from "../../utils/tabs";

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
      `}
    >
      <IconButton
        icon={<CollaspedFillIcon />}
        onClick={onRemove}
        css={css`
          background-color: transparent;
        `}
      />
      <p className="title" onClick={onActive}>
        {data.title}
      </p>
    </div>
  );
}
