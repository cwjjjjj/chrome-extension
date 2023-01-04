import React, { useEffect } from "react";
import Browser from "webextension-polyfill";
import { useState } from "react";

export default function App() {
  const [sendMsg, setSendMsg] = useState<number>(1);
  const [receiveMsg, setReceiveMsg] = useState();

  const listener = (res: any) => {
    console.log("content res", res);
    setReceiveMsg(res);
  };

  const port = Browser.runtime.connect();
  port.onMessage.addListener(listener);

  useEffect(() => {
    port.onMessage.addListener(listener);
    port.postMessage(JSON.stringify({ content: sendMsg }));
    console.log("post", sendMsg);
    return () => {
      port.onMessage.removeListener(listener);
      port.disconnect();
    };
  }, [sendMsg]);
  return (
    <div
      style={{
        height: "100px",
        width: "100px",
        backgroundColor: "orange",
        position: "fixed",
        top: "0px",
        right: "0px",
        zIndex: "99999",
      }}
      onMouseEnter={() => {
        console.log("onMouseEnter");
      }}
      onClick={() => {
        console.log("onClick");
        setSendMsg((prev) => prev + 1);
      }}
    >
      {receiveMsg?.bgpost?.map((item) => {
        return <div>{item.url}</div>;
      })}
    </div>
  );
}
