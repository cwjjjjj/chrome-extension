import Browser from "webextension-polyfill";

export const test = () => {
  console.log("background");
};
test();

export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await Browser.tabs.query(queryOptions);
  console.log("tab", tab);
  return tab;
};

getCurrentTab();

const getAllTabs = async () => {
  let tab = await Browser.tabs.query({ currentWindow: true });
  console.log("allTabs", tab);
  return tab;
};
getAllTabs();

const handleCreateTab = async () => {
  Browser.tabs.onCreated.addListener((res) => {
    console.log("tab created", res);
  });
};
handleCreateTab();

const handleCloseTab = async () => {
  Browser.tabs.onRemoved.addListener((res) => {
    console.log("tab removed", res);
  });
};
handleCloseTab();

const handleDetachTab = async () => {
  Browser.tabs.onDetached.addListener((res) => {
    console.log("tab detached", res);
  });
};
handleDetachTab();

const handleActivetTab = async () => {
  Browser.tabs.onActivated.addListener((res) => {
    console.log("tab onActivated", res);
  });
};
handleActivetTab();

// const handleonActiveChanged = async () => {
//   Browser.tabs?.onActiveChanged.addListener((res) => {
//     console.log("tab onActiveChanged", res);
//   });
// };
// handleonActiveChanged();

const handleAttached = async () => {
  Browser.tabs.onAttached.addListener((res) => {
    console.log("tab onAttached", res);
  });
};
handleAttached();

// const handleonHighlightChanged = async () => {
//   Browser.tabs?.onHighlightChanged.addListener((res) => {
//     console.log("tab onAttaconHighlightChangedhed", res);
//   });
// };
// handleonHighlightChanged();

const handleonHighlightedTab = async () => {
  Browser.tabs.onHighlighted.addListener((res) => {
    console.log("tab onHighlighted", res);
  });
};
handleonHighlightedTab();

const handleonMovedTab = async () => {
  Browser.tabs.onMoved.addListener((res) => {
    console.log("tab onMoved", res);
  });
};
handleonMovedTab();

const handleonReplacedTab = async () => {
  Browser.tabs.onReplaced.addListener((res) => {
    console.log("tab onReplaced", res);
  });
};
handleonReplacedTab();

// const handleonSelectionChangedTab = async () => {
//   Browser.tabs.onSelectionChanged.addListener((res) => {
//     console.log("tab onSelectionChanged", res);
//   });
// };
// handleonSelectionChangedTab();

const handleonUpdatedTab = async () => {
  Browser.tabs.onUpdated.addListener((res) => {
    console.log("tab onUpdated", res);
  });
};
handleonUpdatedTab();

const handleonZoomChangeTab = async () => {
  Browser.tabs.onZoomChange.addListener((res) => {
    console.log("tab onZoomChange", res);
  });
};
handleonZoomChangeTab();

Browser.runtime.onConnect.addListener(async (port) => {
  const a = await getAllTabs();
  console.log("a", a);
  port.onMessage.addListener(async (msg) => {
    console.log("background received msg", msg);
    port.postMessage({ bgpost: a });
  });
});
