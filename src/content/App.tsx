import React, {
  createContext,
  Dispatch,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Browser, { Tabs } from "webextension-polyfill";
import { useState } from "react";
import { ADD_ICON_POSITION, TAB_ACTION } from "../constant/tabAction";
import { Button } from "rsuite";
import TabsTree from "./components/TabsTree";
import { css } from "@emotion/react";
import "rsuite/dist/rsuite.min.css";
import Tab from "./components/Tab";
import { getAllChildren, MyTab, removeTab } from "../utils/tabs";
import AddPin from "./components/AddPin";
import PinIcon from "./components/PinIcon";
import Search from "./components/Search";
import { DraggableArea } from "react-draggable-tags";
import { flushSync } from "react-dom";
import TagBanner from "./components/TagBanner";
import ArrowIcon from "./components/SvgComponents/ArrowIcon";

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
  const [expandItemValues, setExpandItemValues] = useState<string[]>([]);
  const isFirstRef = useRef(true);
  console.log(
    "pinnedTabs",
    pinnedTabs,
    ADD_ICON_POSITION[pinnedTabs.length].right,
    ADD_ICON_POSITION[pinnedTabs.length].bottom
  );

  useEffect(() => {
    console.log("isFirstRef", isFirstRef.current);

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

      // Browser.storage.local.set({ pinnedTabs: pinnedTabs ?? [] });
    } else {
      Browser.storage.onChanged.addListener((res) => {
        if (res?.tabs) {
          setStorageTabs(res?.tabs?.newValue);
        }
        if (res?.pinnedTabs) {
          setPinnedTabs(res?.pinnedTabs?.newValue);
        }
        if (res?.expandedTabs) {
          console.log("expanded Tabs change", res?.expandedTabs?.newValue);
          setStorageTabs(res?.expandedTabs?.newValue);
        }
      });
    }
  }, [isFirstRef?.current]);

  const listener = (res: any) => {
    console.log("content res", res);
  };

  useEffect(() => {
    // document.body.style.marginLeft = `${isExpanded ? "200px" : "1px"}`;
    port.onMessage.addListener(listener);
    return () => {
      port.disconnect();
    };
  }, [isExpanded]);
  return (
    // <Context.Provider
    //   value={{
    //     pinnedTabs,
    //     setPinnedTabs,
    //   }}
    // >
    <div
      style={{
        width: `${isExpanded ? "300px" : "1px"}`,
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "99999",
        height: "100vh",
        overflow: "auto",
        transition: "all .6s ",
        opacity: `${isExpanded ? 1 : 0}`,
        fontSize: "18px",
        backdropFilter: "blur(80px)",
        backgroundColor: "rgba(0,0,0,.25)",
        transform: "translateZ(0)",
        borderRadius: "0 8px 8px 0 ",
        // backgroundImage: 'url("https://i.loli.net/2019/11/23/cnKl1Ykd5rZCVwm.jpg")',
      }}
      css={css`
        padding: 54px 10px;

        .rs-tree {
          height: 100% !important;
          max-height: 90%;
          overflow: hidden auto;

          /* .rs-tree-node-expand-icon-wrapper {
            display: none;
          } */
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
                }}
                className="pinnedTab"
              />
            )}
            onChange={(tags) => console.log(tags)}
          />
        </div>
        {pinnedTabs.length < 8 && (
          <AddPin
            pinnedTabs={pinnedTabs}
            setPinnedTabs={setPinnedTabs}
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

      {/* body */}
      <main
        css={css`
          /* display: grid;
          gap: 15px; */
          padding-top: 20px;

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
          renderTreeIcon={(item) => {
            if (!item?.children?.length) {
              return <div></div>;
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
                onRemove={() => {
                  let removeIds: number[] = [];
                  const result = removeTab(
                    storageTabs as MyTab[],
                    (tab: MyTab) => tab.id !== item.id
                  );
                  Browser.storage.local.set({ tabs: result });
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
      {/* footer */}
      {/* <div
        css={css`
          background-color: white;
        `}
        style={{
          height: "50px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => {
            console.log("add");
            port.postMessage({
              type: TAB_ACTION.CREATE,
            });
          }}
        >
          add
        </Button>
      </div> */}
    </div>
    // </Context.Provider>
  );
}
