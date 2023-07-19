import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { firebaseConfig } from "@src/utils/firebase/config";
import { User, UserSearchResult } from "@src/types/user";
import { handleSearch } from "@src/utils/firebase/firestore/users";

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

    let results: [UserSearchResult, UserSearchResult] = [null, null];

    const dbSearch: Promise<[User[] | null, User[] | null]> = handleSearch(
      request.type,
      request.values
    );

    const passParams = httpsCallable(functions, "passParams");
    const res = passParams({
      type: request.type,
      values: request.values,
    })
      .then((res: { data: { data: [UserSearchResult, UserSearchResult] } }) => {
        return res.data.data;
      })
      .catch((error) => {
        console.log(error);
        return [[], []];
      });

    const dbQuery = await Promise.resolve(dbSearch);

    if (dbQuery[0] === null || dbQuery[1] === null) {
      console.log("scraping");
      const scrapingQuery = await Promise.resolve(res);
      if (dbQuery[0] === null && dbQuery[1] === null) {
        results = [scrapingQuery[0], scrapingQuery[1]];
      } else if (dbQuery[0] === null) {
        results = [scrapingQuery[0], dbQuery[1]];
      } else if (dbQuery[1] === null) {
        results = [dbQuery[0], scrapingQuery[1]];
      }
    } else {
      results = [dbQuery[0], dbQuery[1]];
    }

    console.log(results);

    const tabId = tabIds.get(request);

    try {
      chrome.tabs.sendMessage(tabId, {
        action: "searchIntrosResult",
        search: request.type === "name",
        results: [results[0], results[1]],
      });
    } catch (error) {
      console.log(error);
    }
  }
});
