import { Tabs } from "webextension-polyfill";

export interface MyTab extends Tabs.Tab {
  children?: MyTab[];
}

// export const removeTab = (removeTabId: number, tabs: MyTab[]) => {
//   if (!removeTabId || tabs.length === 0) {
//     return;
//   }

//   console.log("removeTab", removeTabId, tabs);
//   const res = tabs.map((tab, index) => {
//     if (tab.id === removeTabId) {
//       return null;
//     }
//     if (tab.id != removeTabId && !tab?.children) {
//       console.log("no removeTab and no children");
//       return tab;
//     }
//     if (tab?.children) {
//       console.log("has children");
//       return removeTab(removeTabId, tab.children);
//     }
//     console.log("nothing");
//   });
//   // const res = tabs.filter((tab) => {
//   //   if(tabs[removeTabId]){
//   //     return tab.id != removeTabId
//   //   }
//   // });
//   console.log("res", res);
//   return res;
// };

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

// const result = removeTab(a, (node) => node.id !== "3");

// console.log(JSON.stringify(result, null, 4));
// console.log("result", result);

export function getAllChildren(tabs: MyTab[], arr: number[] = []) {
  for (let item of tabs) {
    arr.push(item.id as number);
    if (item.children && item.children.length)
      getAllChildren(item.children, arr);
  }
  return arr;
}

export function findTabById(tabs: MyTab[], id: number): MyTab | void {
  console.log("findTabById", tabs, id);
  if (!(tabs && tabs.length)) {
    return;
  }
  for (const tab of tabs) {
    if (tab.id === id) {
      return tab;
    } else if (tab?.children) {
      return findTabById(tab.children, id);
    }
  }
}
