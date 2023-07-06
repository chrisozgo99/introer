import { createRoot } from "react-dom/client";
import App from "@src/pages/content/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import Icon from "./icon";
import ReactDOM from "react-dom";
import reducers, { RootState } from "@src/state/reducers";
import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupReduxed } from "reduxed-chrome-storage";
import { Provider } from "react-redux";
import { statusUpdate } from "@src/state/actions/status";
import { generateEmailHTML } from "@src/utils/email";

refreshOnUpdate("pages/content");

let store: Store<RootState>;

function addIconToComposeWindow() {
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
          newTd.className = "introer-button-td m-0";

          const introerIconUrl = chrome.runtime.getURL("introer_logo.png");

          const img = document.createElement("img");

          img.src = introerIconUrl;
          img.className = "introer-icon";
          img.alt = "Introer";

          // If there is no icon, we want to ReactDOM.render the icon, else we don't want to render it
          if (!targetNode.querySelector(".introer-icon")) {
            ReactDOM.render(<Icon introerIconUrl={introerIconUrl} />, newTd);
          }

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

const render = async () => {
  const body = document.querySelector("body");
  const info: HTMLDivElement = document.createElement("div");

  info.className = "introer-popup-container absolute z-50";

  body?.appendChild(info);

  const appContainer = document.querySelector(".introer-popup-container");
  if (!appContainer) {
    throw new Error("Can not find .introer-popup-container");
  }
  const root = createRoot(appContainer);

  const storeCreatorContainer = (preloadedState: unknown) =>
    configureStore({
      reducer: reducers,
      preloadedState,
    });

  const instantiate = setupReduxed(storeCreatorContainer);

  instantiate().then((storeInstance: Store) => {
    store = storeInstance;
    root.render(
      <Provider store={store}>
        <App store={store} />
      </Provider>
    );
  });

  document.addEventListener("click", function (event) {
    const targetElement = event.target as HTMLElement;

    const element = document.querySelector(".introer-button-td");
    const rect = element.getBoundingClientRect();
    console.log(targetElement.classList);
    if (!targetElement.classList.value.includes("introer-no-close")) {
      console.log("can be closed");
      if (
        // Check if the clicked element is the div or a descendant of the div
        //  or the td with class introer-button-td
        !info.contains(targetElement) &&
        !targetElement.classList.contains("introer-button-td") &&
        !targetElement.classList.contains("introer-icon")
      ) {
        // The clicked element is outside the div, so we hide it
        store.dispatch(
          statusUpdate({
            type: "STATUS_UPDATE",
            hidden: true,
          })
        );
      } else if (
        // If the clicked element is the icon, we want to toggle the popup's visibility
        targetElement.classList.value.includes("introer-icon") ||
        targetElement.classList.value.includes("introer-embedded-button") ||
        targetElement.classList.value.includes("introer-surround-div")
      ) {
        store.dispatch(
          statusUpdate({
            type: "STATUS_UPDATE",
            hidden: !store.getState().status.hidden,
          })
        );
      } else if (targetElement.classList.value.includes("introer-make-intro")) {
        store.dispatch(
          statusUpdate({
            type: "STATUS_UPDATE",
            status: "choosePeople",
          })
        );
      }
    }
    if (store.getState().status.status === "makeIntro") {
      info.style.top = `${rect.top - 60}px`;
      info.style.left = `${rect.left - 45}px`;
    } else if (store.getState().status.status === "choosePeople") {
      info.style.top = `${rect.top - 200}px`;
      info.style.left = `${rect.left - 70}px`;
    } else if (store.getState().status.status === "reviewPeople") {
      info.style.top = `${rect.top - 200}px`;
      info.style.left = `${rect.left - 70}px`;
    }
  });

  if (window.location.hash === "#inbox?compose=new") {
    addIconToComposeWindow();
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash === "#inbox?compose=new") {
      addIconToComposeWindow();
    }
  });

  // Try to select the "Compose" button
  const composeButton = document.querySelector(".T-I.T-I-KE.L3");

  // Check if the "Compose" button exists
  if (composeButton instanceof Node) {
    // If it exists, add a click event listener to it
    composeButton.addEventListener("click", function () {
      addIconToComposeWindow();
    });

    chrome.runtime.onMessage.addListener((request) => {
      console.log(request.results);
      if (request.action === "searchIntrosResult" && request.search) {
        store.dispatch(
          statusUpdate({
            type: "STATUS_UPDATE",
            status: "reviewPeople",
            searchResults: {
              user1: request.results[0],
              user2: request.results[1],
            },
          })
        );
      } else if (request.action === "searchIntrosResult" && !request.search) {
        generateEmailHTML(
          request.results[0],
          request.results[1],
          store.getState().account.user.name
        );
      }
    });
  }
};

render();
