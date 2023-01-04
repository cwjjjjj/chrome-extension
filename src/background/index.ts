import Browser from "webextension-polyfill";

let tabs: any[] = [];

const port = Browser.runtime.connect();

const getAllTabs = async () => {
  const tabs = await Browser.tabs.query({ currentWindow: true });
  return tabs;
};

export const saveTabsToLocal = async () => {
  tabs = await getAllTabs();
  console.log("storage new tabs", tabs);
  return Browser.storage.local.set({ tabs });
};

Browser.tabs.onCreated.addListener(async (res) => {
  await saveTabsToLocal();
  console.log("tab created", res, tabs);

  // await port.postMessage(tabs);
});

Browser.tabs.onRemoved.addListener(async (res) => {
  console.log("tab removed", res);
  await saveTabsToLocal();

  // await port.postMessage(tabs);
});

Browser.tabs.onDetached.addListener(async (res) => {
  console.log("tab detached", res);
  await saveTabsToLocal();

  // await port.postMessage("onDetached");
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

// Browser.runtime.onConnect.addListener(async (port) => {
//   saveTabsToLocal();
//   port.onMessage.addListener(async (msg) => {
//     console.log("localtabs", tabs);
// console.log("background received msg", msg);
// getAllTabs();
// port.postMessage(tabs);
//   });
// });
