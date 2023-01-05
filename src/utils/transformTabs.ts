import { Tabs } from "webextension-polyfill";

export interface MyTab extends Tabs.Tab {
  children: MyTab[];
}

export const removeTab = (removeTabId: number, tabs: MyTab[]) => {
  if (!removeTabId || tabs.length === 0) {
    return;
  }

  console.log("removeTab", removeTabId, tabs);
  const res = tabs.map((tab, index) => {
    if (tab.id === removeTabId) {
      return null;
    }
    if (tab.id != removeTabId && !tab?.children) {
      console.log("no removeTab and no children");
      return tab;
    }
    if (tab?.children) {
      console.log("has children");
      return removeTab(removeTabId, tab.children);
    }
    console.log("nothing");
  });
  // const res = tabs.filter((tab) => {
  //   if(tabs[removeTabId]){
  //     return tab.id != removeTabId
  //   }
  // });
  console.log("res", res);
  return res;
};

// function removeId(tree) {
//   delete tree.id;
//   if (tree.children) {
//     tree.children.forEach(child => removeId(child));
//   }
// }

// export function removeNode(tree, id) {
//   if (!tree) return;
//   if (tree.id === id) {
//     tree = null;
//     return;
//   }
//   if (tree.children) {
//     tree.children = tree.children
//       .map((child) => removeNode(child, id))
//       .filter(Boolean);
//   }
//   return tree;
// }
