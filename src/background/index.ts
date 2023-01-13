import Browser from "webextension-polyfill";
import pRetry from "p-retry";
import { TAB_ACTION } from "../constant/tabAction";
import {
  findTabById,
  getAllChildren,
  handleActiveTabById,
  handleUpdateTabById,
  MyTab,
  removeTab,
  removeTabOnly,
} from "../utils/tabs";

let TABS: any[] = [];
let PINNED_TABS: any[] = [];
let CURRENT_TAB;
let isFirst = true;

const port = Browser.runtime.connect();

export const setCurrentTab = async (currentTab: MyTab) => {
  return Browser.storage.local.set({ currentTab });
};

const updateCurrentTab = async () => {
  let [tab] = await Browser.tabs.query({ active: true });
  CURRENT_TAB = tab;
  await setCurrentTab(tab);
  return tab;
};

const getAllTabs = async () => {
  const tabs = await Browser.tabs.query({});
  return tabs;
};

export const setTabs = async (tabs: MyTab[]) => {
  return Browser.storage.local.set({ tabs });
};

export const setPinnedTabs = async (pinnedTabs: any[]) => {
  return Browser.storage.local.set({ pinnedTabs });
};

const clearStorage = () => {
  return Browser.storage.local.clear();
};
// clearStorage();

const updateTabs = async () => {
  console.log("isFirst", isFirst);
  if (isFirst) {
    TABS = await getAllTabs();
    await setTabs(TABS);
    await setPinnedTabs([]);
    isFirst = false;
  } else {
    const { tabs } = await Browser.storage.local.get(["tabs"]);
    const { pinnedTabs } = await Browser.storage.local.get(["pinnedTabs"]);
    TABS = tabs;
    PINNED_TABS = pinnedTabs;
  }
  console.log("storage new tabs", TABS);
};

Browser.tabs.onCreated.addListener(async (newTab) => {
  if (newTab?.openerTabId) {
    const parentTab = findTabById(TABS, newTab?.openerTabId as number);
    if (parentTab) {
      parentTab.children = parentTab?.children
        ? [...parentTab.children, newTab]
        : [newTab];
    }
    await setTabs(TABS);
    console.log("parent tab", parentTab, TABS);
  } else {
    const newTabs = [...TABS, newTab];
    TABS = newTabs;
    await setTabs(newTabs);
    console.log("tab created", Date.now(), newTab, TABS);
  }
});

Browser.tabs.onRemoved.addListener(async (res) => {
  console.log("tab removed only", res);
  const result = removeTabOnly(TABS, (tab: MyTab) => tab.id !== res);
  TABS = result;
  console.log("TABS", TABS);
  await setTabs(result);

  // let removeIds: number[] = [];
  // const removedTab = findTabById(TABS, res);
  // console.log("removedTab", removedTab, TABS);
  // if (removedTab?.children) {
  //   const childrenIds = getAllChildren(removedTab.children as MyTab[]);
  //   removeIds = [...removeIds, ...childrenIds];
  // }
  // console.log("removeIds", removeIds);
  // if (removeIds.length) {
  //   await Browser.tabs.remove(removeIds);
  // }

  // const result = removeTab(TABS as MyTab[], (tab: MyTab) => tab.id !== res);
  // TABS = result;
  // console.log("TABS", TABS);
  // await setTabs(result);
});

// Browser.tabs.onDetached.addListener(async (res) => {
//   console.log("tab detached", res);
// });

Browser.tabs.onActivated.addListener(async (res) => {
  console.log("tab onActivated", res);
  handleActiveTabById(TABS, res.tabId);
  await setTabs(TABS);
});

// Browser.tabs.onAttached.addListener(async (res) => {
//   console.log("tab onAttached", res);
// });

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
  if (changeInfo?.status === "complete") {
    PINNED_TABS.forEach(async (pinnedTab, index) => {
      if (tab?.url?.includes(pinnedTab.url)) {
        if (tab?.favIconUrl) {
          PINNED_TABS[index].favIconUrl = tab?.favIconUrl;
        }
        console.log("PINNED_TABS", PINNED_TABS);
        setPinnedTabs(PINNED_TABS);
      }
    });

    handleUpdateTabById(TABS, tab);
    console.log("update", TABS);
    await setTabs(TABS);

    // let currentTab = findTabById(TABS, tabId);
    // currentTab = tab;
    // console.log("update", currentTab, TABS);
    // await setTabs(TABS);

    // const index = TABS.findIndex((item) => item.id === tabId);
    // if (index !== -1) {
    //   TABS.splice(index, 1, tab);
    //   console.log("update", TABS);
    //   await setTabs(TABS);
    // }
  }
});

Browser.storage.local.onChanged.addListener((res) => {
  console.log("storage change", res);
  if (res?.pinnedTabs) {
    PINNED_TABS = res.pinnedTabs.newValue;
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
  await updateTabs();
  port.onMessage.addListener(async (msg: Record<string, any>) => {
    if (msg.type === TAB_ACTION.REMOVE) {
      await Browser.tabs.remove(msg.tabIds);
    }
    if (msg.type === TAB_ACTION.CREATE) {
      console.log("create");
      await Browser.tabs.create({ active: false, url: msg?.url });
    }
    if (msg.type === TAB_ACTION.ACTIVE) {
      console.log("active");
      // await getCurrentTab();
      await Browser.tabs.update(msg.tabId, { active: true });
    }
    // getAllTabs();
    // port.postMessage(tabs);
  });
});
