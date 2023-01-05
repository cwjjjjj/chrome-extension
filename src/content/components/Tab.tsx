import { css } from "@emotion/react";
import { HTMLAttributes } from "react";
import { Button, IconButton } from "rsuite";
import { Tabs } from "webextension-polyfill";
import CollaspedFillIcon from "@rsuite/icons/CollaspedFill";

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  data: Tabs.Tab;
  onRemove: () => void;
}

export default function Tab({ data, onRemove, ...props }: TabProps) {
  if (!data) {
    return null;
  }
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 40px 1fr;
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
      <p className="title">{data.title}</p>
    </div>
  );
}
