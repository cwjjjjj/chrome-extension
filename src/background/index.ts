import Browser from "webextension-polyfill";
import pRetry from "p-retry";
import { TAB_ACTION } from "../constant/tabAction";
import { MyTab, removeTab } from "../utils/tabs";

let storageTabs: any[] = [];

const port = Browser.runtime.connect();

const getAllTabs = async () => {
  const tabs = await Browser.tabs.query({ currentWindow: true });
  return tabs;
};

export const setTabs = async (tabs: MyTab[]) => {
  return Browser.storage.local.set({ tabs });
};

const clearStorage = () => {
  return Browser.storage.local.clear();
};
clearStorage();

const initTabs = async () => {
  const { tabs } = await Browser.storage.local.get(["tabs"]);
  console.log("initTabs", tabs);
  if (tabs) {
    storageTabs = tabs;
  } else {
    storageTabs = await getAllTabs();
  }
  console.log("storage new tabs", storageTabs);
};

Browser.tabs.onCreated.addListener(async (res) => {
  await initTabs();
  const newTabs = [...storageTabs, res];
  await setTabs(newTabs);
  console.log("tab created", res, storageTabs);

  // await port.postMessage(tabs);
});

Browser.tabs.onRemoved.addListener(async (res) => {
  console.log("tab removed", res);
  const result = removeTab(
    storageTabs as MyTab[],
    (tab: MyTab) => tab.id !== res
  );
  storageTabs = result;
  console.log("tab removed", result);
  await Browser.storage.local.set({ tabs: result });
  // await setTabs();

  // await port.postMessage(tabs);
});

Browser.tabs.onDetached.addListener(async (res) => {
  console.log("tab detached", res);
  // await setTabs();

  // await port.postMessage("onDetached");
});

Browser.tabs.onActivated.addListener(async (res) => {
  console.log("tab onActivated", res);
});

Browser.tabs.onAttached.addListener(async (res) => {
  console.log("tab onAttached", res);
});

// Browser.tabs.onHighlighted.addListener(async (res) => {
//   console.log("tab onHighlighted", res);
// });

Browser.tabs.onMoved.addListener(async (res) => {
  console.log("tab onMoved", res);
});

Browser.tabs.onReplaced.addListener(async (res) => {
  console.log("tab onReplaced", res);
});

Browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await initTabs();
  console.log("tab onUpdated", tabId, changeInfo, tab);
  if (changeInfo?.status === "complete") {
    const index = storageTabs.findIndex((item) => item.id === tabId);
    console.log("find", index, tab);
    if (index !== -1) {
      storageTabs.splice(index, 1, tab);
      console.log("update", storageTabs);
      setTabs(storageTabs);
    }
  }
});

// Browser.tabs.onZoomChange.addListener(async (res) => {
//   console.log("tab onZoomChange", res);
// });

Browser.runtime.onConnect.addListener(async (port) => {
  /**
   * 创建新标签时 更新其他页面的 tabs 数据 ，此时可以获取到新 tab 的 title 等信息
   * 在 tabs onCreated 时 tab 在 loading 中无法获取到 title
   */
  // setTabs();
  port.onMessage.addListener(async (msg: Record<string, any>) => {
    // console.log("localtabs", tabs);
    // console.log("background received msg", msg);
    if (msg.type === TAB_ACTION.REMOVE) {
      Browser.tabs.remove(msg.tabIds);
    }
    if (msg.type === TAB_ACTION.CREATE) {
      console.log("create");
      Browser.tabs.create({});
    }
    // getAllTabs();
    // port.postMessage(tabs);
  });
});
