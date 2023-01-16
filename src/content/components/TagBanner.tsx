import TagIcon from "./SvgComponents/TagIcon";
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";

export interface TagBannerProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function TagBanner({ title, ...props }: TagBannerProps) {
  if (!title) {
    return null;
  }

  return (
    <div
      {...props}
      css={css`
        height: 36px;
        border-radius: 0px 0px 0px 12px;
        display: grid;
        grid-template-columns: 30px 1fr;
        padding: 0 15px;
        align-items: center;
      `}
    >
      <TagIcon />
      <p>{title}</p>
    </div>
  );
}
