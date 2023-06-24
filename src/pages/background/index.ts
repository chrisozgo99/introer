import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
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

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "open_options_page") {
    chrome.runtime.openOptionsPage();
  } else if (request.action === "hello_world") {
    const helloWorld = httpsCallable(functions, "helloWorld");
    helloWorld().then((result) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          action: "hello_world_result",
          result,
        });
      });
    });
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
