import React from "react";
import "@pages/options/Options.css";
import pupeeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";

const Options: React.FC = () => {
  async function launchLinkedInBrowser() {
    console.log("launching linkedin browser");
    // Navigate to LinkedIn in new tab
    chrome.tabs.create({ url: "https://www.linkedin.com/login" });

    // const browser: Browser = await pupeeteer.launch({ headless: false });
    // const page: Page = await browser.newPage();
    // await page.goto("https://www.linkedin.com/login");
  }

  return (
    <div className="OptionsContainer">
      <button onClick={() => launchLinkedInBrowser()}>
        Sign in with LinkedIn
      </button>
    </div>
  );
};

export default Options;
