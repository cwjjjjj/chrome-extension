import { css } from "@emotion/react";
import { useRef } from "react";
import { Input, InputGroup, InputProps } from "rsuite";
import Browser from "webextension-polyfill";
import { TAB_ACTION } from "../../constant/tabAction";
import SearchEnginePicker from "./SearchEnginePicker";
import GoogleIcon from "./SvgComponents/GoogleIcon";
import SearchIcon from "./SvgComponents/SearchIcon";

export interface SearchProps extends InputProps {}

export default function Search({ ...props }: SearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const port = Browser.runtime.connect();

  const handleSearch = (value: string, searchEngine?: string) => {
    port.postMessage({
      type: TAB_ACTION.CREATE,
      url: `https://www.google.com/search?q=${value}`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // @ts-ignore
      handleSearch(e.target.value);
      // @ts-ignore
      e.target.value = "";
    }
  };
  return (
    <div
      css={css`
        .rs-input {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          height: 46px;

          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #ffffff;
        }
        /* .rs-input-group.rs-input-group-inside
          .rs-input-group-btn
          ~ input.rs-input {
          padding-left: 46px;
        } */
        .rs-input-group {
          border: none;

          &-focus {
            outline: none !important;
            border: none !important;
          }
        }
        .favIcon {
          height: 46px !important;
          width: 46px;
          pointer-events: none;
        }
      `}
    >
      <InputGroup inside>
        <InputGroup.Button className="favIcon">
          <SearchIcon />
        </InputGroup.Button>
        <Input
          onKeyDown={handleKeyDown}
          ref={inputRef}
          placeholder="请输入需要查询的内容"
          {...props}
        />
        <InputGroup.Button className="favIcon">
          <GoogleIcon />
          <SearchEnginePicker />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}
