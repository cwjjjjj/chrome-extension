import React, { useEffect, useRef } from "react";
import Browser from "webextension-polyfill";
import { useState } from "react";
import { TAB_ACTION } from "../constant/tabAction";

export default function App() {
  const [receiveMsg, setReceiveMsg] = useState();
  const [storageTabs, setStorageTabs] = useState<any[]>([]);
  const isFirstRef = useRef(true);

  useEffect(() => {
    console.log("isFirstRef", isFirstRef.current);

    if (isFirstRef.current) {
      Browser.storage.local.get(["tabs"]).then((res) => {
        setStorageTabs(res.tabs);
        isFirstRef.current = false;
      });
    } else {
      Browser.storage.onChanged.addListener((res) => {
        setStorageTabs(res.tabs.newValue);
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
        width: "500px",
        backgroundColor: "pink",
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: "99999",
      }}
      // onMouseEnter={() => {
      //   console.log("onMouseEnter");
      // }}
      // onClick={() => {
      //   console.log("onClick");
      //   setSendMsg((prev) => prev + 1);
      // }}
    >
      {storageTabs.map((item) => {
        return (
          <div
            key={item?.id}
            style={{ backgroundColor: "orange", margin: "5px" }}
          >
            <span>{item?.title ?? "loading..."}</span>
            <button
              style={{
                marginLeft: "5px",
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
          </div>
        );
      })}
      <div
        style={{
          height: "50px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            console.log("add");
            port.postMessage({
              type: TAB_ACTION.CREATE,
            });
          }}
        >
          add
        </button>
      </div>
    </div>
  );
}
