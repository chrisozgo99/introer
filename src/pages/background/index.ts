import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  HttpsCallableResult,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { firebaseConfig } from "@src/utils/firebase/config";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

chrome.runtime.onMessage.addListener(async (request, sender) => {
  const tabIds = new Map();
  if (request.action === "open_options_page") {
    chrome.runtime.openOptionsPage();
  } else if (request.action === "searchIntros") {
    tabIds.set(request, sender.tab.id);
    console.log(request);
    const searchIntros = httpsCallable(functions, "searchIntros");
    const values = request.values;
    let query1: Promise<HttpsCallableResult<unknown>>,
      query2: Promise<HttpsCallableResult<unknown>>;
    if (request.type === "url") {
      query1 = searchIntros({ name: null, url: values[0] });
      query2 = searchIntros({ name: null, url: values[1] });
    } else if (request.type === "name") {
      query1 = searchIntros({ name: values[0], url: null });
      query2 = searchIntros({ name: values[1], url: null });
    }
    const results = await Promise.all([query1, query2]);
    console.log(results);
    try {
      const tabId = tabIds.get(request);

      chrome.tabs.sendMessage(tabId, {
        action: "searchIntrosResult",
        results,
        user: auth.currentUser.displayName,
        type: request.type,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log(tabId, changeInfo, tab);
//   if (changeInfo.status === "complete" && tab.url.includes("linkedin.com")) {
//     console.log("Condition met");
//     chrome.cookies.getAll({ domain: ".linkedin.com" }, (cookies) => {
//       console.log(cookies);
//       chrome.storage.local.set({ cookies });
//     });
//   }
// });
