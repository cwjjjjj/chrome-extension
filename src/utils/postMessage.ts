import Browser from "webextension-polyfill";

export const postMessage = async (msg: any) => {
  try {
    await Browser.runtime.sendMessage(msg);
  } catch (err: any) {
    if (
      err.message ===
      "Could not establish connection. Receiving end does not exist."
    ) {
      return console.warn("error ignored", err.message);
    }
    throw err;
  }
};
