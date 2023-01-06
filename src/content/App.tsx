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
  const [receiveMsg, setReceiveMsg] = useState();
  const [storageTabs, setStorageTabs] = useState<Tabs.Tab[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const isFirstRef = useRef(true);

  useEffect(() => {
    console.log("isFirstRef", isFirstRef.current);

    if (isFirstRef.current) {
      Browser.storage.local.get(["tabs"]).then((res) => {
        console.log("storageTabs", res);
        setStorageTabs(res.tabs);
        isFirstRef.current = false;
      });
    } else {
      Browser.storage.onChanged.addListener((res) => {
        // setTimeout(() => {
        setStorageTabs(res.tabs.newValue);
        // }, 300);
        console.log("change", res);
      });
    }
  }, [isFirstRef.current]);

  const listener = (res: any) => {
    console.log("content res", res);
    setReceiveMsg(res);
  };

  const port = Browser.runtime.connect();

  useEffect(() => {
    port.onMessage.addListener(listener);
    // port.postMessage(JSON.stringify({ content: sendMsg }));
    return () => {
      port.onMessage.removeListener(listener);
      port.disconnect();
    };
  }, []);
  return (
    <div
      style={{
        width: `${isExpanded ? "200px" : "5px"}`,
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
        // color: "pink",
      }}
      css={css`
        color: red;

        .rs-tree {
          height: 100% !important;
          max-height: 90%;
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
      <TabsTree
        data={storageTabs}
        valueKey="id"
        labelKey="title"
        draggable
        className="my-tree"
        onDrop={({ createUpdateDataFunction }, event) => {
          const a = createUpdateDataFunction(storageTabs);
          console.log("a", a);
          // setStorageTabs(a);
          Browser.storage.local.set({ tabs: a });
          // setTreeData(createUpdateDataFunction(treeData));
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
                console.log("removeIds", removeIds);

                port.postMessage({
                  type: TAB_ACTION.REMOVE,
                  tabIds: removeIds,
                });
              }}
              data={item as Tabs.Tab}
            />
          );
        }}
        // style={{
        //   height: "unset !important",s
        //   maxHeight: "unset !important",
        // }}
      />
      {/* {storageTabs.map((item) => {
        return (
          <div
            key={item?.id}
            style={{
              backgroundColor: "orange",
              margin: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              style={{
                margin: "5px",
              }}
              onClick={() => {
                console.log("remove", item.title);
                port.postMessage({
                  type: TAB_ACTION.REMOVE,
                  tab: item,
                });
              }}
            >
              -
            </button>
            {item?.favIconUrl && (
              <img
                src={item.favIconUrl}
                alt="icon"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            )}
            <span>{item?.title}</span>
          </div>
        );
      })} */}
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
