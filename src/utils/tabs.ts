import { Tabs } from "webextension-polyfill";

export interface MyTab extends Tabs.Tab {
  children?: MyTab[];
  level?: number;
}

export function removeTab(tabs: MyTab[], predicate: any) {
  // 如果已经没有节点了，结束递归
  if (!(tabs && tabs.length)) {
    return [];
  }

  const newChildren = [];
  for (const node of tabs) {
    if (predicate(node)) {
      // 如果节点符合条件，直接加入新的节点集
      newChildren.push(node);
      node.children = removeTab(node?.children ?? [], predicate);
    } else {
      // 如果当前节点不符合条件，递归过滤子节点，
      // 把符合条件的子节点提升上来，并入新节点集
      // newChildren.push(...deal(node.children, predicate));
    }
  }
  return newChildren;
}

export function removeTabOnly(tabs: MyTab[], predicate: any): any {
  // 如果已经没有节点了，结束递归
  if (!(tabs && tabs.length)) {
    return [];
  }

  const newChildren = [];
  for (const node of tabs) {
    if (predicate(node)) {
      // 如果节点符合条件，直接加入新的节点集
      newChildren.push(node);
      node.children = removeTabOnly(node?.children ?? [], predicate);
    } else {
      // 如果当前节点不符合条件，递归过滤子节点，
      // 把符合条件的子节点提升上来，并入新节点集
      newChildren.push(...removeTabOnly(node?.children ?? [], predicate));
    }
  }
  return newChildren;
}

export function getAllChildren(tabs: MyTab[], arr: number[] = []) {
  if (!tabs || !Array.isArray(tabs)) {
    return [];
  }
  for (let item of tabs) {
    arr.push(item.id as number);
    if (item.children && item.children.length)
      getAllChildren(item.children, arr);
  }
  return arr;
}

export function findTabById(tabs: MyTab[], id: number): MyTab | null {
  if (!(tabs && tabs.length)) {
    return null;
  }
  for (const tab of tabs) {
    if (tab.id === id) {
      return tab;
    } else if (tab?.children && tab.children.length) {
      const res = findTabById(tab.children, id);
      if (res) {
        return res;
      }
    }
  }
  return null;
}

export function handleActiveTabById(tabs: MyTab[], id: number) {
  if (!(tabs && tabs.length)) {
    return;
  }
  for (const tab of tabs) {
    if (tab.id === id) {
      tab.active = true;
    } else {
      tab.active = false;
      if (tab?.children) {
        handleActiveTabById(tab.children, id);
      }
    }
  }
}

export function handleUpdateTabById(tabs: MyTab[], updateTab: MyTab) {
  if (!(tabs && tabs.length)) {
    return;
  }
  for (let tab of tabs) {
    if (tab.id === updateTab.id) {
      tab.favIconUrl = updateTab.favIconUrl;
      tab.title = updateTab.title;
    } else {
      tab.active = false;
      if (tab?.children) {
        handleUpdateTabById(tab.children, updateTab);
      }
    }
  }
}

export function calculateLevel(tabs: MyTab[], initLevel: number) {
  tabs.forEach((tab) => {
    tab.level = initLevel;
    if (tab.children) {
      calculateLevel(tab.children, initLevel + 1);
    }
  });
  return tabs;
}
