import { css } from "@emotion/react";
import { HTMLAttributes } from "react";
import { MyTab } from "../../utils/tabs";
import CloseIcon from "./SvgComponents/CloseIcon";
import DefaultFavicon from "./SvgComponents/DefaultFavicon";
import FileCloseIcon from "./SvgComponents/FileCloseIcon";

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  data: MyTab;
  onRemoveFolder: () => void;
  onRemoveOne: () => void;
  onActive: () => void;
}

export default function Tab({
  data,
  onRemoveFolder,
  onRemoveOne,
  onActive,
  ...props
}: TabProps) {
  if (!data) {
    return null;
  }
  const paddingLeft = data.level! * 15;

  return (
    <div
      css={css`
        width: 100%;
        padding: 0 10px;
        display: grid;
        grid-template-columns: 20px ${240 - paddingLeft}px;
        align-items: center;
        gap: 5px;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        color: #ffffff;

        &:hover {
          grid-template-columns: 20px ${190 - paddingLeft}px 25px 25px;

          .closeIcon {
            border-radius: 7px;
            width: 20px;
            height: 20px;
            display: inline-block;

            &:hover {
              background-color: rgba(255, 255, 255, 0.15);
            }
          }
        }

        .title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        .iconWrapper {
          display: flex;
          justify-content: center;
          align-items: block;
        }

        .iconImg {
          height: 20px;
          width: 20px;
          object-fit: contain;
        }

        .closeIcon {
          width: 20px;
          height: 20px;
          display: none;
        }
      `}
      onClick={onActive}
      {...props}
    >
      <div className="iconWrapper">
        {data?.favIconUrl ? (
          <img src={data?.favIconUrl} className="iconImg" />
        ) : (
          <DefaultFavicon className="iconImg" />
        )}
      </div>

      <p className="title">{data.title}</p>

      {data?.children && data?.children?.length > 0 ? (
        <FileCloseIcon
          className="closeIcon"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFolder();
          }}
        />
      ) : (
        <div
          style={{
            height: "20px",
            width: "20px",
            display: "none",
          }}
        />
      )}

      <CloseIcon
        className="closeIcon"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveOne();
        }}
      />
    </div>
  );
}
