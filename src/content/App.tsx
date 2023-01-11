import React, { createContext, Dispatch, useEffect, useRef } from "react";
import Browser, { Tabs } from "webextension-polyfill";
import { useState } from "react";
import { TAB_ACTION } from "../constant/tabAction";
import { Button } from "rsuite";
import TabsTree from "./components/TabsTree";
import { css } from "@emotion/react";
import "rsuite/dist/rsuite.min.css";
import Tab from "./components/Tab";
import { getAllChildren, MyTab, removeTab } from "../utils/tabs";
import AddPin from "./components/AddPin";

export type PinnedTab = {
  url: string;
  icon?: string;
};

export const Context = createContext<{
  pinnedTabs: PinnedTab[];
  setPinnedTabs: Dispatch<PinnedTab[]>;
}>({} as any);

const port = Browser.runtime.connect();

export default function App() {
  const [storageTabs, setStorageTabs] = useState<Tabs.Tab[]>([]);
  const [pinnedTabs, setPinnedTabs] = useState<PinnedTab[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const isFirstRef = useRef(true);
  console.log("storageTabs", storageTabs);

  useEffect(() => {
    console.log("isFirstRef", isFirstRef.current);

    if (isFirstRef?.current) {
      Browser.storage.local.get(["tabs"]).then((res) => {
        setStorageTabs(res.tabs);
        isFirstRef.current = false;
      });
      Browser.storage.local.get(["pinnedTabs"]).then((res) => {
        setPinnedTabs(res.pinnedTabs);
        isFirstRef.current = false;
      });
      // Browser.storage.local.set({ pinnedTabs: pinnedTabs ?? [] });
    } else {
      Browser.storage.onChanged.addListener((res) => {
        console.log("storage change", res);
        if (res?.tabs) {
          setStorageTabs(res?.tabs?.newValue);
        }
        if (res?.pinnedTabs) {
          setPinnedTabs(res?.pinnedTabs?.newValue ?? []);
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
    <Context.Provider
      value={{
        pinnedTabs,
        setPinnedTabs,
      }}
    >
      <div
        style={{
          width: `${isExpanded ? "300px" : "1px"}`,
          // backgroundColor: "pink",
          position: "fixed",
          top: "0px",
          left: "0px",
          zIndex: "99999",
          height: "100vh",
          overflow: "auto",
          transition: "all .6s ",
          opacity: `${isExpanded ? 1 : 0}`,
          fontSize: "18px",
          backdropFilter: "blur(10px)",
          // backgroundImage: 'url("https://i.loli.net/2019/11/23/cnKl1Ykd5rZCVwm.jpg")',
        }}
        css={css`
          color: red;

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
        <div
          css={css`
            background-color: orange;
            display: grid;
            justify-content: space-evenly;
            grid: repeat(2, 40px) / repeat(5, 40px);
            gap: 5px;
          `}
        >
          {/* <img src="https://i.loli.net/2019/11/23/cnKl1Ykd5rZCVwm.jpg" alt="" /> */}
          {pinnedTabs?.map((item, index) => {
            return (
              <div
                css={css`
                  background-color: blue;
                `}
                key={`${item.url}_${index}`}
              >
                <img src={item?.favIconUrl} alt="" />
                {item.url}
              </div>
            );
          })}

          <AddPin pinnedTabs={pinnedTabs} handleAdd={setPinnedTabs} />
        </div>

        {/* body */}
        <TabsTree
          css={css`
            background-color: red;
          `}
          data={storageTabs}
          valueKey="id"
          labelKey="title"
          draggable
          className="my-tree"
          onDrop={({ createUpdateDataFunction }, event) => {
            const treeTabs = createUpdateDataFunction(storageTabs);
            Browser.storage.local.set({ tabs: treeTabs });
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
        {/* footer */}
        <div
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
        </div>
      </div>
    </Context.Provider>
  );
}
