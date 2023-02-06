import { createContext, Dispatch, useEffect, useMemo, useRef } from "react";
import Browser, { Tabs } from "webextension-polyfill";
import { useState } from "react";
import {
  ADD_ICON_POSITION,
  SearchEngine,
  TAB_ACTION,
  URLRegExp,
} from "../constant/tabAction";
import TabsTree from "./components/TabsTree";
import { css } from "@emotion/react";
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
import PinSvgIcon from "./components/SvgComponents/PinSvgIcon";
import { NoiseBg } from "../assets/NoiseBg";
import { postMessage } from "../utils/postMessage";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandItemValues, setExpandItemValues] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSideBarExpanded, setIsSideBarExpanded] = useState(true);
  const [currentSearchEngine, setCurrentSearchEngine] = useState<SearchEngine>({
    searchEngine: "Google",
  });
  const isFirstRef = useRef(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey && e.key === "b") || (e.metaKey && e.key === "b")) {
        searchRef.current?.focus();
      }
    });
  }, []);

  const handleSave = async (nextValue: string) => {
    if (!URLRegExp.test(nextValue)) {
      console.log("不是正确是 URL 路径");
      setShowError(true);
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

    await postMessage({
      type: TAB_ACTION.CREATE,
      url: nextValue,
    });
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
        setExpandItemValues(res.expandedTabs);
      });
      Browser.storage.local.get(["isSideBarExpanded"]).then((res) => {
        setIsSideBarExpanded(res.isSideBarExpanded);
      });
      Browser.storage.local.get(["currentSearchEngine"]).then((res) => {
        setCurrentSearchEngine(res.currentSearchEngine);
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
          setExpandItemValues(res?.expandedTabs?.newValue);
        }
        if (res?.isSideBarExpanded) {
          setIsSideBarExpanded(res?.isSideBarExpanded?.newValue);
        }
        if (res?.currentSearchEngine) {
          setCurrentSearchEngine(res?.currentSearchEngine?.newValue);
        }
      });
    }
  }, [isFirstRef?.current]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    return () => {
      port.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isSideBarExpanded) {
      setIsExpanded(true);
      document.body.style.marginLeft = "320px";
    } else {
      setIsExpanded(false);
      document.body.style.marginLeft = "0";
    }
  }, [isSideBarExpanded]);

  return (
    <div
      style={{
        width: `${isExpanded ? "320px" : "15px"}`,
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "99999",
        height: "100vh",
        overflow: "hidden",
        transition: `${isExpanded ? "all .6s" : "all .6s .3s"}`,
        opacity: `${isExpanded ? 1 : 0.5}`,
        backdropFilter: `${isSideBarExpanded ? "none" : "blur(80px)"}`,
        backgroundColor: `${
          isSideBarExpanded ? "#A6CCB5" : "rgba(0, 0, 0, 0.25) "
        }`,
        backgroundImage: `${isSideBarExpanded ? NoiseBg : ""}`,
        backgroundBlendMode: "soft-light",
        backgroundSize: "contain",
        transform: "translateZ(0)",
        paddingTop: "20px",
        boxSizing: "border-box",
      }}
      css={css`
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: #ffffff;

        .rs-tree {
          /* padding-block 20px ,header-height 186px ,banner 36px ,link-input 80px */
          height: ${isEditing
            ? "calc(100vh - 40px - 186px - 36px - 70px - 42px) !important"
            : "calc(100vh - 40px - 186px - 36px - 42px) !important"};
          max-height: unset;
          overflow: hidden auto;
        }

        input::placeholder {
          color: white;
          font-size: 14px;
        }

        * {
          box-sizing: border-box;
        }

        *::-webkit-scrollbar {
          height: 1px !important;
          width: 5px;
          border-radius: 10px;
        }
        *::-webkit-scrollbar-track {
          display: none;
        }
        *::-webkit-scrollbar-track-piece {
          display: none;
        }
        *::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          height: 5px !important;
          width: 5px;
          border-radius: 10px;
        }
        *::-webkit-scrollbar-button {
          display: none;
        }
        *::-webkit-scrollbar-corner {
          display: none;
        }
      `}
      onMouseEnter={() => {
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        if (isSideBarExpanded) {
          setIsExpanded(true);
        } else {
          setIsExpanded(false);
        }
      }}
    >
      {/* header */}
      <div
        css={css`
          position: relative;
          padding: 0 10px;
          transition: opacity 0.3s 0.3s;
          opacity: ${isExpanded ? "1" : "0"};
        `}
      >
        <Search
          ref={searchRef}
          currentSearchEngine={currentSearchEngine}
          // setCurrentSearchEngine={setCurrentSearchEngine}
        />
        <div
          css={css`
            .DraggableTags {
              display: grid;
              justify-content: space-evenly;
              grid: repeat(2, 46px) / repeat(5, 46px);
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

              &:hover {
                background: linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0.15) 0%,
                  rgba(255, 255, 255, 0.6) 100%,
                  rgba(255, 255, 255, 0.5) 100%
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
                  postMessage({
                    type: TAB_ACTION.CREATE,
                    url: item.url,
                  });
                }}
                onRemove={() => {
                  const res = pinnedTabs.filter((tab) => tab.id !== item.id);
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
        {pinnedTabs.length < 10 && (
          <AddPin
            pinnedTabs={pinnedTabs}
            setPinnedTabs={setPinnedTabs}
            setIsEditing={setIsEditing}
            className="pinnedTab"
            css={css`
              position: absolute;
              right: ${ADD_ICON_POSITION[pinnedTabs.length].right}px;
              bottom: ${ADD_ICON_POSITION[pinnedTabs.length].bottom}px;
            `}
          />
        )}
      </div>
      {isEditing && (
        <div
          css={css`
            margin-top: 20px;
            padding: 0 10px;

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
              defaultValue="https://www."
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
          {showError && (
            <div
              css={css`
                font-size: 12px;
                color: red;
                margin: 5px;
              `}
            >
              输入的不是正确地址~
            </div>
          )}
        </div>
      )}

      {/* body */}
      <div
        css={css`
          padding-top: 20px;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #ffffff;
          display: grid;
          gap: 15px;
          transition: opacity 0.3s 0.3s;
          opacity: ${isExpanded ? "1" : "0"};

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
            height: 42px;

            :hover {
              background: rgba(255, 255, 255, 0.15);
            }
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

          .rs-tree-node-label-content.rs-tree-node-label-content-focus,
          .rs-tree-node-label-content:focus,
          .rs-tree-node-label-content:hover {
            background-color: transparent;
            color: white;
          }

          .rs-tree-node:not(.rs-tree-node-disabled):focus
            > .rs-tree-node-label
            > .rs-tree-node-label-content,
          .rs-tree-node:not(.rs-tree-node-disabled)
            > .rs-tree-node-label:focus
            > .rs-tree-node-label-content {
            background-color: transparent;
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
          onExpand={(expandValues, item, concat) => {
            const childrenIds = getAllChildren(item?.children as MyTab[]);
            const res = [...new Set([...expandValues, ...childrenIds])];
            Browser.storage.local.set({ expandedTabs: res });
          }}
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

                  postMessage({
                    type: TAB_ACTION.REMOVE,
                    tabIds: removeIds,
                  });
                }}
                onRemoveOne={() => {
                  postMessage({
                    type: TAB_ACTION.REMOVE,
                    tabIds: [item.id],
                  });
                }}
                onActive={() => {
                  postMessage({
                    type: TAB_ACTION.ACTIVE,
                    tabId: item.id,
                  });
                }}
                data={item as Tabs.Tab}
              />
            );
          }}
        />
      </div>
      <div
        css={css`
          height: 30px;
          width: 100%;
          background: rgba(255, 255, 255, 0.4);
          display: grid;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 0;
          opacity: ${isExpanded ? "1" : "0"};
          transition: opacity 0.6s;

          :hover {
            cursor: pointer;
          }
        `}
        onClick={() => {
          let newState = !isSideBarExpanded;
          Browser.storage.local.set({ isSideBarExpanded: newState });
        }}
      >
        <PinSvgIcon fill={isSideBarExpanded ? "white" : "none"} />
        test
      </div>
    </div>
  );
}
