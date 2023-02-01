import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { Input, InputGroup, InputProps } from "rsuite";
import Browser from "webextension-polyfill";
import { SEARCH_ENGINE, TAB_ACTION } from "../../constant/tabAction";
import SearchEnginePicker from "./SearchEnginePicker";
import GoogleIcon from "./SvgComponents/GoogleIcon";
import SearchIcon from "./SvgComponents/SearchIcon";

export interface SearchProps extends InputProps {}

const SearchEngineList = Object.entries(SEARCH_ENGINE).map(
  ([searchEngine, url]) => {
    return {
      searchEngine,
      url,
    };
  }
);
const SearchEngineListLength = SearchEngineList.length;

export default function Search({ ...props }: SearchProps) {
  const [inputValue, setInputValue] = useState<string>();
  const [currentHoverItemIndex, setCurrentHoverItemIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const port = Browser.runtime.connect();

  const handleSearch = (value: string, searchEngineUrl?: string) => {
    port.postMessage({
      type: TAB_ACTION.CREATE,
      url: `${searchEngineUrl}${value}`,
      active: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // @ts-ignore
      handleSearch(inputValue, SearchEngineList[currentHoverItemIndex].url);
      setInputValue("");
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCurrentHoverItemIndex((prev) =>
        prev - 1 < 0 ? SearchEngineListLength - 1 : prev - 1
      );
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCurrentHoverItemIndex((prev) =>
        prev + 1 > SearchEngineListLength - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div
      css={css`
        position: relative;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 12px;

        .rs-input {
          background: rgba(255, 255, 255, 0);
          height: 46px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #ffffff;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 234px;

          :focus {
            outline: unset;
          }
        }

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
          box-sizing: border-box;
        }

        .picker {
          width: 100%;
          position: absolute;
          top: 36px;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(17.5px);
          border-radius: 0 0 12px 12px;
          padding: 10px 0;
          z-index: 9999999999;
        }

        .picker-item {
          height: 32px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 70px;
          justify-content: center;
          align-items: center;
          padding: 0 10px;

          &-active {
            background-color: rgba(0, 0, 0, 0.3);
            cursor: pointer;
          }
        }

        .input-value {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}
    >
      <InputGroup inside>
        <InputGroup.Button className="favIcon">
          <SearchIcon />
        </InputGroup.Button>
        <Input
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e);
          }}
          ref={inputRef}
          placeholder="请输入需要查询的内容"
          {...props}
        />
        <InputGroup.Button className="favIcon">
          <GoogleIcon />
          <SearchEnginePicker />
        </InputGroup.Button>
      </InputGroup>
      {inputValue && (
        <div className="picker">
          {SearchEngineList.map(({ searchEngine, url }, index) => {
            return (
              <div
                key={searchEngine}
                className={`picker-item ${
                  index === currentHoverItemIndex ? "picker-item-active" : ""
                }`}
                onMouseEnter={() => {
                  setCurrentHoverItemIndex(index);
                }}
              >
                <span className="input-value">{inputValue}</span>
                <span>{searchEngine}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
