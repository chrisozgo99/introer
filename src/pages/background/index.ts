import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { firebaseConfig } from "@src/utils/firebase/config";
import { searchForUser } from "@src/utils/firebase/firestore/users";

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
    const search1 = searchForUser({
      search:
        request.type === "url" ? request.values[0] : request.values[0].name,
      type: request.type === "url" ? "linkedin" : "name",
    });
    const search2 = searchForUser({
      search:
        request.type === "url" ? request.values[1] : request.values[1].name,
      type: request.type === "url" ? "linkedin" : "name",
    });

    const promises = await Promise.all([search1, search2]);

    console.log(promises);

    let results = [];
    const searchIntros = httpsCallable(functions, "searchIntros");

    if (promises[0] && promises[1]) {
      results = [promises[0], promises[1]];
    } else if (promises[0]) {
      const queryPromise = searchIntros(
        request.type === "url"
          ? { name: null, url: request.values[1] }
          : { name: request.values[1].name, url: null }
      );
      const query = await Promise.all([queryPromise]);
      console.log(query);
      results = [promises[0], request.type === "url" ? query : query[0].data];
    } else if (promises[1]) {
      const queryPromise = searchIntros(
        request.type === "url"
          ? { name: null, url: request.values[0] }
          : { name: request.values[0].name, url: null }
      );
      const query = await Promise.all([queryPromise]);
      console.log(query);
      results = [request.type === "url" ? query : query[0].data, promises[1]];
    } else {
      const queryPromise1 = searchIntros(
        request.type === "url"
          ? { name: null, url: request.values[0] }
          : { name: request.values[0].name, url: null }
      );
      const queryPromise2 = searchIntros(
        request.type === "url"
          ? { name: null, url: request.values[1] }
          : { name: request.values[1].name, url: null }
      );
      const query = await Promise.all([queryPromise1, queryPromise2]);
      console.log(query);
      results = [
        request.type === "url" ? query[0] : query[0].data,
        request.type === "url" ? query[1] : query[1].data,
      ];
    }

    console.log(results);
    try {
      const tabId = tabIds.get(request);

      chrome.tabs.sendMessage(tabId, {
        action: "searchIntrosResult",
        results,
        search: request.type === "name",
      });
    } catch (error) {
      console.log(error);
    }
  }
});
