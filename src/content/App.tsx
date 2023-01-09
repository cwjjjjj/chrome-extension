import React, { useEffect, useRef } from "react";
import Browser, { Tabs } from "webextension-polyfill";
import { useState } from "react";
import { TAB_ACTION } from "../constant/tabAction";
import { Button } from "rsuite";
import TabsTree from "./components/TabsTree";
import { css } from "@emotion/react";
import "rsuite/dist/rsuite.min.css";
import Tab from "./components/Tab";
import { getAllChildren, MyTab, removeTab } from "../utils/tabs";

export default function App() {
  const [storageTabs, setStorageTabs] = useState<Tabs.Tab[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const isFirstRef = useRef(true);
  console.log("storageTabs", storageTabs);

  useEffect(() => {
    console.log("isFirstRef", isFirstRef.current);

    if (isFirstRef.current) {
      Browser.storage.local.get(["tabs"]).then((res) => {
        console.log("useeffect first storageTabs", res);
        setStorageTabs(res.tabs);
        isFirstRef.current = false;
      });
    } else {
      Browser.storage.onChanged.addListener((res) => {
        console.log("useeffect change storageTabs", res);
        setStorageTabs(res.tabs.newValue);
        console.log("change", res);
      });
    }
  }, [isFirstRef.current]);

  const listener = (res: any) => {
    console.log("content res", res);
  };

  const port = Browser.runtime.connect();

  useEffect(() => {
    port.onMessage.addListener(listener);
    return () => {
      port.disconnect();
    };
  }, []);
  return (
    <div
      style={{
        width: `${isExpanded ? "200px" : "1px"}`,
        backgroundColor: "pink",
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "99999",
        height: "100vh",
        overflow: "auto",
        transition: "all .6s ",
        opacity: `${isExpanded ? 1 : 0}`,
        fontSize: "18px",
      }}
      css={css`
        color: red;

        .rs-tree {
          height: 100% !important;
          max-height: 90%;
          overflow: hidden auto;

          .rs-tree-node-expand-icon-wrapper {
            display: none;
          }
        }
      `}
      onMouseEnter={() => {
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsExpanded(true);
      }}
    >
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
                  const childrenIds = getAllChildren(item.children as MyTab[]);
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

      <div
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
  );
}
