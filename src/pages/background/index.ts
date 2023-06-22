import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { firebaseConfig } from "@src/utils/firebase/config";

reloadOnUpdate("pages/background");

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "open_options_page") {
    chrome.runtime.openOptionsPage();
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
/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);

// import pupeeteer from "puppeteer";
// import type { Browser, Page } from "puppeteer";
// import fs from "fs";

// async function searchIntros(name: string) {
//     const browser: Browser = await pupeeteer.launch({ headless: false });

//     const page: Page = await browser.newPage();

//     const cookies = JSON.parse(fs.readFileSync("./data/cookies.json", "utf8"));

//     console.log(cookies);

//     await page.setCookie(...cookies);

//     // await page.goto("https://www.linkedin.com/login");
//     // await page.type("#username", "chrisozgo99@gmail.com");
//     // await page.type("#password", "BYM7501513017");
//     // await page.click(".btn__primary--large");

//     // const cookies = await page.cookies();

//     // Save the cookies in a json file
//     // fs.writeFileSync("./data/cookies.json", JSON.stringify(cookies));

//     // console.log(cookies);

//     // Navigate to search page
//     await page.goto(
//         `https://www.linkedin.com/search/results/people/?keywords=${name}&network=%5B"F"%2C"S"%5D&origin=GLOBAL_SEARCH_HEADER`
//     );

//     return cookies;
// }

// const cookies = searchIntros("Patrack Tisdale");
