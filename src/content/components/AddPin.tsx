import PlusIcon from "@rsuite/icons/Plus";
import { HTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import { IconButton, Input } from "rsuite";
import Browser from "webextension-polyfill";
import { TAB_ACTION } from "../../constant/tabAction";
import { Context, PinnedTab } from "../App";

export interface AddPinProps extends HTMLAttributes<HTMLDivElement> {
  pinnedTabs: any;
  handleAdd: any;
}

const port = Browser.runtime.connect();

export default function AddPin({
  handleAdd,
  pinnedTabs,
  ...props
}: AddPinProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const { pinnedTabs, setPinnedTabs } = useContext(Context);
  // console.log("context", pinnedTabs, setPinnedTabs);

  const handleSave = (nextValue: string) => {
    console.log("value", nextValue);
    setIsEditing(false);
    const res = [
      ...pinnedTabs,
      {
        url: nextValue,
      },
    ];
    handleAdd(res);

    Browser.storage.local.set({
      pinnedTabs: res,
    });

    port.postMessage({
      type: TAB_ACTION.CREATE,
      url: nextValue,
    });

    console.log("save res open", res, nextValue);
  };
  console.log("pinnedTabs", pinnedTabs);

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
    <div {...props}>
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
        <IconButton
          icon={<PlusIcon />}
          color="blue"
          appearance="primary"
          circle
          onClick={() => {
            setIsEditing(true);
          }}
        />
      )}
    </div>
  );
}
