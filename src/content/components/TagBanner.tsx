import TagIcon from "./SvgComponents/TagIcon";
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";
import TabBannerBg from "./SvgComponents/TabBannerBg";

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
        position: relative;
        height: 36px;
        border-radius: 0px 0px 0px 12px;
        display: grid;
        grid-template-columns: 20px 80px;
        padding: 0 15px;
        align-items: center;

        .bg {
          position: absolute;
          inset: 0;
        }
      `}
    >
      <TabBannerBg className="bg" />
      <TagIcon />
      <span>{title}</span>
    </div>
  );
}
