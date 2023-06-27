import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import Icon from "./icon/icon";
import ReactDOM from "react-dom";
import reducers, { RootState } from "@src/state/reducers";
import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { ReduxedSetupOptions, setupReduxed } from "reduxed-chrome-storage";
import { Provider } from "react-redux";

refreshOnUpdate("pages/content");

function addIconToComposeWindow(info: HTMLDivElement) {
  let tdAdded = false;

  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && !tdAdded) {
        // A child node has been added or removed. Check if the 'btC' element has been added.
        const targetNode = document.querySelector(".btC");
        if (targetNode instanceof Node) {
          // Create a new <td> element
          const newTd = document.createElement("td");
          newTd.className = "introer-button-td";

          const introerIconUrl = chrome.runtime.getURL("introer_logo.png");

          const img = document.createElement("img");

          img.src = introerIconUrl;
          img.className = "introer-icon";
          img.alt = "Introer";

          ReactDOM.render(<Icon introerIconUrl={introerIconUrl} />, newTd);

          const buttonDiv = newTd.querySelector(".introer-embedded-button");

          buttonDiv?.addEventListener("click", function () {
            if (info.style.display === "block") {
              info.style.display = "none";
            } else {
              info.style.display = "block";
            }
          });

          // Append the new <td> element to the target node
          targetNode.insertBefore(newTd, targetNode.children[1]);

          tdAdded = true;

          // Once we've found the target node and added the new <td> element, we can stop observing
          observer.disconnect();
        }
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(document, config);
}

function init(container: string) {
  const appContainer = document.querySelector(container);
  if (!appContainer) {
    throw new Error("Can not find " + container);
  }
  const root = createRoot(appContainer);

  const storeCreatorContainer = (preloadedState: unknown) =>
    configureStore({
      reducer: reducers,
      preloadedState,
    });

  const options: ReduxedSetupOptions = {
    namespace: "chrome",
  };

  const instantiate = setupReduxed(storeCreatorContainer, options);

  instantiate().then((store: Store) => {
    const state: RootState = store.getState();
    const { account } = state;
    root.render(
      <Provider store={store}>
        <App account={account} />
      </Provider>
    );
  });
}

const render = () => {
  const body = document.querySelector("body");
  const info: HTMLDivElement = document.createElement("div");

  info.className = "introer-popup-container";

  body?.appendChild(info);

  document.addEventListener("click", function (event) {
    const targetElement = event.target as HTMLElement;
    // Check if the clicked element is the div or a descendant of the div
    //  or the td with class introer-button-td
    if (
      !info.contains(targetElement) &&
      !targetElement.classList.contains("introer-button-td") &&
      !targetElement.classList.contains("introer-icon")
    ) {
      // The clicked element is outside the div, change its style
      info.style.display = "none";
    }
  });

  if (window.location.hash === "#inbox?compose=new") {
    // Your code to handle compose mode goes here
    addIconToComposeWindow(info);
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash === "#inbox?compose=new") {
      // Your code to handle compose mode goes here
      addIconToComposeWindow(info);
    }
  });

  // Try to select the "Compose" button
  const composeButton = document.querySelector(".T-I.T-I-KE.L3");

  // Check if the "Compose" button exists
  if (composeButton instanceof Node) {
    // If it exists, add a click event listener to it
    composeButton.addEventListener("click", function () {
      addIconToComposeWindow(info);
    });

    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "searchIntrosResult") {
        const { result } = request;
        console.log(result); // Access the result from the background script
      }
    });

    init(".introer-popup-container");

    // createRoot(info).render(<App />);
  }
};

render();
