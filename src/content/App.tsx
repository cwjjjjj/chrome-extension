import { createContext, Dispatch, useEffect, useMemo, useRef } from "react";
import Browser, { Tabs } from "webextension-polyfill";
import { useState } from "react";
import {
  ADD_ICON_POSITION,
  TAB_ACTION,
  URLRegExp,
} from "../constant/tabAction";
import TabsTree from "./components/TabsTree";
import { css } from "@emotion/react";
import "rsuite/dist/rsuite.min.css";
import Tab from "./components/Tab";
import { getAllChildren, MyTab } from "../utils/tabs";
import AddPin from "./components/AddPin";
import PinIcon from "./components/PinIcon";
import Search from "./components/Search";
import { DraggableArea } from "react-draggable-tags";
import TagBanner from "./components/TagBanner";
import ArrowIcon from "./components/SvgComponents/ArrowIcon";
import { Input, InputGroup } from "rsuite";
import LinkIcon from "./components/SvgComponents/LinkIcon";

export interface PinnedTab {
  url: string;
  id: string;
  favIconUrl?: string;
}

export const Context = createContext<{
  pinnedTabs: PinnedTab[];
  setPinnedTabs: Dispatch<PinnedTab[]>;
}>({} as any);

const port = Browser.runtime.connect();

export default function App() {
  const [storageTabs, setStorageTabs] = useState<Tabs.Tab[]>([]);
  const [pinnedTabs, setPinnedTabs] = useState<PinnedTab[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandItemValues, setExpandItemValues] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const isFirstRef = useRef(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async (nextValue: string) => {
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
    // setPinnedTabs(res);

    await Browser.storage.local.set({
      pinnedTabs: res,
    });

    await port.postMessage({
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
    if (isFirstRef?.current) {
      Browser.storage.local.get(["tabs"]).then((res) => {
        setStorageTabs(res.tabs);
      });
      Browser.storage.local.get(["pinnedTabs"]).then((res) => {
        setPinnedTabs(res.pinnedTabs);
      });
      Browser.storage.local.get(["expandedTabs"]).then((res) => {
        console.log("res get", res);
        setExpandItemValues(res.expandedTabs);
      });
      isFirstRef.current = false;
    } else {
      Browser.storage.onChanged.addListener((res) => {
        if (res?.tabs) {
          setStorageTabs(res?.tabs?.newValue);
        }
        if (res?.pinnedTabs) {
          setPinnedTabs(res?.pinnedTabs?.newValue);
        }
        if (res?.expandedTabs) {
          setStorageTabs(res?.expandedTabs?.newValue);
        }
      });
    }
  }, [isFirstRef?.current]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // const listener = (res: any) => {
  //   console.log("content res", res);
  // };

  useEffect(() => {
    // document.body.style.marginLeft = `${isExpanded ? "200px" : "1px"}`;
    // port.onMessage.addListener(listener);
    return () => {
      port.disconnect();
    };
  }, []);

  return (
    // <Context.Provider
    //   value={{
    //     pinnedTabs,
    //     setPinnedTabs,
    //   }}
    // >
    <div
      style={{
        width: `${isExpanded ? "300px" : "5px"}`,
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "99999",
        height: "100vh",
        overflow: "auto",
        transition: "all .6s ",
        opacity: `${isExpanded ? 1 : 0.5}`,
        fontSize: "18px",
        backdropFilter: "blur(80px)",
        backgroundColor: "rgba(0,0,0,.25)",
        transform: "translateZ(0)",
        borderRadius: "0 8px 8px 0 ",
        paddingBlock: "54px",
        paddingInline: `${isExpanded ? "10px" : "0px"}`,
      }}
      css={css`
        .rs-tree {
          /* padding-block 54px ,header-height 186px ,banner 36px ,inner-padding 20px */
          height: calc(100vh - 108px - 186px - 36px - 20px) !important;
          max-height: unset;
          overflow: hidden auto;
        }
      `}
      onMouseEnter={() => {
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsExpanded(true);
      }}
    >
      {/* header */}
      <header
        css={css`
          position: relative;
        `}
      >
        <Search />
        <div
          css={css`
            .DraggableTags {
              display: grid;
              justify-content: space-evenly;
              grid: repeat(2, 60px) / repeat(4, 60px);
              gap: 10px;
              align-items: center;
              justify-items: center;
              padding-top: 10px;
            }

            .pinnedTab {
              cursor: pointer;
              position: relative;
              border-radius: 12px;
              display: grid;
              justify-items: center;
              align-items: center;
              box-sizing: border-box;
              background-color: rgba(255, 255, 255, 0.15);

              &:hover::after {
                position: absolute;
                height: 60px;
                width: 60px;
                content: "";
                border-radius: 12px;
                background: linear-gradient(to bottom, #fff, transparent);
                top: -2px;
                left: -1px;
                z-index: -1;
              }

              &:hover {
                background-image: linear-gradient(
                  to bottom,
                  rgba(176, 174, 174, 0.3) 0%,
                  rgba(255, 255, 255, 0.15) 100%
                );
              }
            }
          `}
        >
          <DraggableArea
            tags={pinnedTabs}
            key={JSON.stringify(pinnedTabs)}
            render={({ tag: item, index }) => (
              <PinIcon
                data={item}
                key={item.id}
                onClick={() => {
                  port.postMessage({
                    type: TAB_ACTION.CREATE,
                    url: item.url,
                  });
                }}
                onRemove={() => {
                  const res = pinnedTabs.filter((tab) => tab.id !== item.id);
                  console.log("Removed", item, index, res);
                  setPinnedTabs(res);
                  Browser.storage.local.set({ pinnedTabs: res });
                }}
                className="pinnedTab"
              />
            )}
            onChange={(tags) => {
              setPinnedTabs(tags);
              Browser.storage.local.set({ pinnedTabs: tags });
            }}
          />
        </div>
        {pinnedTabs.length < 8 && (
          <AddPin
            pinnedTabs={pinnedTabs}
            setPinnedTabs={setPinnedTabs}
            setIsEditing={setIsEditing}
            className="pinnedTab"
            css={css`
              position: absolute;
              right: ${ADD_ICON_POSITION[pinnedTabs.length].right}px;
              bottom: ${ADD_ICON_POSITION[pinnedTabs.length].bottom}px;
              /* right: 6px;
              bottom: 0px; */
            `}
          />
        )}
      </header>
      {isEditing && (
        <div
          css={css`
            margin-top: 20px;

            .rs-input {
              box-sizing: border-box;
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.3) 100%
              );
              backdrop-filter: blur(17.5px);
              border-radius: 12px;
              height: 46px;
              font-weight: 500;
              font-size: 16px;
              line-height: 22px;
              color: #ffffff;
            }

            .rs-input-group {
              border: none;

              &-focus {
                outline: none !important;
                border: none !important;
              }
            }

            .linkIcon {
              height: 46px !important;
              width: 46px;
              pointer-events: none;
              box-sizing: border-box;
            }
          `}
        >
          <InputGroup inside>
            <InputGroup.Button className="linkIcon">
              <LinkIcon />
            </InputGroup.Button>
            <Input
              onBlur={(e) => {
                handleSave(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              placeholder="请输入需要固定的快捷入口"
              defaultValue="https://"
              css={css`
                background: linear-gradient(
                  180deg,
                  rgba(255, 255, 255, 0.15) 0%,
                  rgba(255, 255, 255, 0.3) 100%
                );
                backdrop-filter: blur(17.5px);
                border-radius: 12px;
              `}
            />
          </InputGroup>
        </div>
      )}

      {/* body */}
      <main
        css={css`
          padding-top: 20px;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #ffffff;
          display: grid;
          gap: 15px;

          .none {
            display: none;
          }

          .icon-wrapper {
            height: 30px;
            width: 30px;
            display: flex;
            align-items: center;
          }

          .arrow-icon-right {
            transform: rotate(-90deg);
          }

          .rs-tree-node {
            display: flex;
            align-items: center;
          }

          .rs-tree-node-label {
            padding-left: 15px;
          }

          .rs-tree-node-active .rs-tree-node-label-content {
            background-color: unset;
            color: unset;
            font-weight: unset;
          }

          .rs-tree-node-label-content {
            padding: 0;
          }
        `}
      >
        <TagBanner title="标签页" />
        <TabsTree
          data={storageTabs}
          valueKey="id"
          labelKey="title"
          draggable
          className="my-tree"
          onDrop={({ createUpdateDataFunction }, event) => {
            const treeTabs = createUpdateDataFunction(storageTabs);
            Browser.storage.local.set({ tabs: treeTabs });
          }}
          expandItemValues={expandItemValues}
          // fixme 希望所有页签同步 expand 状态，但是这个会触发报错
          // onExpand={(expandValues, item, concat) => {
          //   console.log("expand", expandValues, item, concat);
          //   Browser.storage.local.set({ expandedTabs: expandValues });
          // }}
          renderTreeIcon={(item) => {
            if (!item?.children?.length) {
              return <div className="none"></div>;
            }
            return (
              <div className="icon-wrapper">
                <ArrowIcon
                  className={
                    expandItemValues.includes(item.id) ? "" : "arrow-icon-right"
                  }
                  onClick={() => {
                    let res;
                    if (expandItemValues.includes(item.id)) {
                      res = expandItemValues.filter((id) => item.id !== id);
                      setExpandItemValues(res);
                    } else {
                      res = [...expandItemValues, item.id];
                      setExpandItemValues(res);
                    }
                  }}
                />
              </div>
            );
          }}
          renderTreeNode={(item) => {
            return (
              <Tab
                onRemoveFolder={() => {
                  let removeIds: number[] = [];

                  removeIds.push(item.id);
                  if (item?.children) {
                    const childrenIds = getAllChildren(
                      item.children as MyTab[]
                    );
                    removeIds = [...removeIds, ...childrenIds];
                  }

                  port.postMessage({
                    type: TAB_ACTION.REMOVE,
                    tabIds: removeIds,
                  });
                }}
                onRemoveOne={() => {
                  port.postMessage({
                    type: TAB_ACTION.REMOVE,
                    tabIds: [item.id],
                  });
                }}
                onActive={() => {
                  console.log("active", item.id);
                  port.postMessage({
                    type: TAB_ACTION.ACTIVE,
                    tabId: item.id,
                  });
                }}
                data={item as Tabs.Tab}
              />
            );
          }}
        />
      </main>
    </div>
    // </Context.Provider>
  );
}
