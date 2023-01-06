import Browser from "webextension-polyfill";
import pRetry from "p-retry";
import { TAB_ACTION } from "../constant/tabAction";
import { MyTab, removeTab } from "../utils/tabs";

let storageTabs: any[] = [];
let isFirst = true;

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

const updateTabs = async () => {
  console.log("isFirst", isFirst);
  if (isFirst) {
    storageTabs = await getAllTabs();
    await setTabs(storageTabs);
    isFirst = false;
  } else {
    const { tabs } = await Browser.storage.local.get(["tabs"]);
    storageTabs = tabs;
  }
  console.log("storage new tabs", storageTabs);
};

Browser.tabs.onCreated.addListener(async (res) => {
  await updateTabs();
  const newTabs = [...storageTabs, res];
  await setTabs(newTabs);
  console.log("tab created", Date.now(), res, storageTabs, storageTabs);
});

Browser.tabs.onRemoved.addListener(async (res) => {
  console.log("tab removed", res);
  const result = removeTab(
    storageTabs as MyTab[],
    (tab: MyTab) => tab.id !== res
  );
  storageTabs = result;
  console.log("tab removed", result);
  await setTabs(result);
});

Browser.tabs.onDetached.addListener(async (res) => {
  console.log("tab detached", res);
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

// Browser.tabs.onMoved.addListener(async (res) => {
//   console.log("tab onMoved", res);
// });

// Browser.tabs.onReplaced.addListener(async (res) => {
//   console.log("tab onReplaced", res);
// });

Browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await updateTabs();
  console.log("stoarge", storageTabs);
  console.log("tab onUpdated", tabId, changeInfo, tab);
  if (changeInfo?.status === "complete") {
    const index = storageTabs.findIndex((item) => item.id === tabId);
    console.log("find", index, tab);
    if (index !== -1) {
      storageTabs.splice(index, 1, tab);
      console.log("update", storageTabs);
      await setTabs(storageTabs);
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
    if (msg.type === TAB_ACTION.REMOVE) {
      await Browser.tabs.remove(msg.tabIds);
    }
    if (msg.type === TAB_ACTION.CREATE) {
      console.log("create");
      await Browser.tabs.create({ active: false });
    }
    // getAllTabs();
    // port.postMessage(tabs);
  });
});
