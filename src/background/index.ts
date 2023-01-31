import Browser from "webextension-polyfill";
import { DEFAULT_PINNED_TABS, TAB_ACTION } from "../constant/tabAction";
import { PinnedTab } from "../content/App";
import {
  calculateLevel,
  findTabById,
  handleActiveTabById,
  handleUpdateTabById,
  MyTab,
  removeTabOnly,
} from "../utils/tabs";

let TABS: MyTab[] = [];
let PINNED_TABS: PinnedTab[] = [];
let EXPANDED_TABS: number[] = [];
let isFirst = true;

export const setCurrentTab = async (currentTab: MyTab) => {
  return Browser.storage.local.set({ currentTab });
};

export const setExpandedTabs = async (expandedTabs: number[]) => {
  return Browser.storage.local.set({ expandedTabs });
};

const getAllTabs = async () => {
  const tabs = await Browser.tabs.query({});
  return tabs;
};

export const setTabs = async (tabs: MyTab[]) => {
  const tabsWithLevels = calculateLevel(tabs, 1);
  return Browser.storage.local.set({ tabs: tabsWithLevels });
};

export const setPinnedTabs = async (pinnedTabs: any[]) => {
  return Browser.storage.local.set({ pinnedTabs });
};

Browser.runtime.onInstalled.addListener((detail) => {
  PINNED_TABS = DEFAULT_PINNED_TABS;
  setPinnedTabs(PINNED_TABS);
});

const updateTabs = async () => {
  const { pinnedTabs } = await Browser.storage.local.get(["pinnedTabs"]),
    PINNED_TABS = pinnedTabs;

  if (isFirst) {
    TABS = await getAllTabs();
    await Promise.all([
      setTabs(TABS),
      setPinnedTabs(PINNED_TABS),
      setExpandedTabs(EXPANDED_TABS),
    ]);
    isFirst = false;
  } else {
    const [{ tabs }, { expandedTabs }] = await Promise.all([
      Browser.storage.local.get(["tabs"]),
      Browser.storage.local.get(["expandedTabs"]),
    ]);
    TABS = tabs;
    EXPANDED_TABS = expandedTabs;
  }
};

Browser.tabs.onCreated.addListener(async (newTab) => {
  if (newTab?.openerTabId) {
    const parentTab = findTabById(TABS, newTab?.openerTabId as number);
    if (
      parentTab &&
      parentTab?.level &&
      parentTab.level <= 5 &&
      newTab.pendingUrl !== "chrome://newtab/"
    ) {
      parentTab.children = parentTab?.children
        ? [...parentTab.children, newTab]
        : [newTab];
    } else {
      const newTabs = [...TABS, newTab];
      TABS = newTabs;
      await setTabs(newTabs);
    }
    await setTabs(TABS);
  }
  if (!newTab?.openerTabId) {
    const newTabs = [...TABS, newTab];
    TABS = newTabs;
    await setTabs(newTabs);
  }
});

Browser.tabs.onRemoved.addListener(async (res) => {
  const result = removeTabOnly(TABS, (tab: MyTab) => tab.id !== res);
  TABS = result;
  await setTabs(result);

  if (EXPANDED_TABS.includes(res)) {
    EXPANDED_TABS = EXPANDED_TABS.filter((id) => id !== res);
    await setExpandedTabs(EXPANDED_TABS);
  }
});

Browser.tabs.onActivated.addListener(async (res) => {
  handleActiveTabById(TABS, res.tabId);
  await setTabs(TABS);
});

Browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo?.status === "complete" || changeInfo?.favIconUrl) {
    PINNED_TABS.forEach(async (pinnedTab, index) => {
      if (tab?.url?.includes(pinnedTab.url)) {
        if (tab?.favIconUrl) {
          PINNED_TABS[index].favIconUrl = tab?.favIconUrl;
        }
        setPinnedTabs(PINNED_TABS);
      }
    });

    handleUpdateTabById(TABS, tab);
    await setTabs(TABS);
  }
});

Browser.storage.local.onChanged.addListener((res) => {
  if (res?.pinnedTabs) {
    PINNED_TABS = res.pinnedTabs.newValue;
  }
});

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
      await Browser.tabs.create({ active: false, url: msg?.url });
    }
    if (msg.type === TAB_ACTION.ACTIVE) {
      await Browser.tabs.update(msg.tabId, { active: true });
    }
  });
});
