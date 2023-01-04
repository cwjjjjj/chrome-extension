import Browser from "webextension-polyfill";
import pRetry from "p-retry";

const port = Browser.runtime.connect();

const getAllTabs = async () => {
  const tabs = await Browser.tabs.query({ currentWindow: true });
  console.log("tabs", tabs);
  // await pRetry(
  //   () =>
  //     new Promise((resolve, reject) => {
  //       console.log("retry...");
  //       port.postMessage(JSON.stringify(tabs));
  //       resolve("test");
  //     }),
  //   {
  //     retries: 5,
  //   }
  // );
  return tabs;
};
getAllTabs();

Browser.tabs.onCreated.addListener(async (res) => {
  console.log("tab created", res);
  port.postMessage(await getAllTabs());
});

Browser.tabs.onRemoved.addListener(async (res) => {
  console.log("tab removed", res);
  port.postMessage(await getAllTabs());
});

Browser.tabs.onDetached.addListener(async (res) => {
  console.log("tab detached", res);
  port.postMessage("onDetached");
});

Browser.tabs.onActivated.addListener(async (res) => {
  console.log("tab onActivated", res);
});

Browser.tabs.onAttached.addListener(async (res) => {
  console.log("tab onAttached", res);
});

Browser.tabs.onHighlighted.addListener(async (res) => {
  console.log("tab onHighlighted", res);
});

Browser.tabs.onMoved.addListener(async (res) => {
  console.log("tab onMoved", res);
});

Browser.tabs.onReplaced.addListener(async (res) => {
  console.log("tab onReplaced", res);
});

Browser.tabs.onUpdated.addListener(async (res) => {
  console.log("tab onUpdated", res);
});

Browser.tabs.onZoomChange.addListener(async (res) => {
  console.log("tab onZoomChange", res);
});

Browser.runtime.onConnect.addListener(async (port) => {
  port.onMessage.addListener(async (msg) => {
    console.log("background received msg", msg);
    getAllTabs();
    port.postMessage(await getAllTabs());
  });
});
