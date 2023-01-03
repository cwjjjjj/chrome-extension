import Browser from "webextension-polyfill";

export const test = () => {
  console.log("background");
};
test();

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await Browser.tabs.query(queryOptions);
  console.log("tab", tab);
  return tab;
}

getCurrentTab();

async function getAllTabs() {
  let [tab] = await Browser.tabs.query({ active: false });
  console.log("allTabs", tab);
  return tab;
}
getAllTabs();
