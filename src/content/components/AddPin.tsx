import { css } from "@emotion/react";
import PlusIcon from "@rsuite/icons/Plus";
import {
  Dispatch,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconButton, Input } from "rsuite";
import Browser from "webextension-polyfill";
import { TAB_ACTION } from "../../constant/tabAction";
import { MyTab } from "../../utils/tabs";
import { Context, PinnedTab } from "../App";

export interface AddPinProps extends HTMLAttributes<HTMLDivElement> {
  pinnedTabs: PinnedTab[];
  setPinnedTabs: Dispatch<PinnedTab[]>;
}

const port = Browser.runtime.connect();

export const URLRegExp =
  /^(?:(http|https|ftp):\/\/)((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;

export default function AddPin({
  setPinnedTabs,
  pinnedTabs,
  ...props
}: AddPinProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const { pinnedTabs, setPinnedTabs } = useContext(Context);
  // console.log("context", pinnedTabs, setPinnedTabs);

  const handleSave = (nextValue: string) => {
    console.log("value", nextValue, URLRegExp.test(nextValue));
    if (!URLRegExp.test(nextValue)) {
      console.log("不是正确是 URL 路径");
      return;
    }
    setIsEditing(false);
    const res = [
      ...pinnedTabs,
      {
        url: nextValue,
        id: String(Date.now()),
      } as PinnedTab,
    ];
    setPinnedTabs(res);

    Browser.storage.local.set({
      pinnedTabs: res,
    });

    port.postMessage({
      type: TAB_ACTION.CREATE,
      url: nextValue,
    });

    console.log("save res open", res, nextValue);
  };

  // 按下回车自动保存
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // @ts-ignore
      handleSave(e.target.value);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  return (
    <div
      {...props}
      css={css`
        /* 60 - 1 , 60 - 2  */
        height: 59px;
        width: 58px;
        color: grey;

        .favIconImg {
          height: 20px;
          width: 20px;
          object-fit: contain;
        }
      `}
    >
      {isEditing ? (
        <Input
          onBlur={(e) => {
            handleSave(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          placeholder="请输入需要固定的快捷入口"
          defaultValue="https://"
        />
      ) : (
        <PlusIcon
          className="favIconImg"
          onClick={() => {
            setIsEditing(true);
          }}
        />
      )}
    </div>
  );
}
