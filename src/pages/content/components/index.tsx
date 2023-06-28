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
import { UserInfo } from "@src/types/user";

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

  info.className =
    "introer-popup-container hidden absolute z-50 right-[295px] bottom-[55px]";

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
        const { results, user, type } = request;
        console.log(results);

        let person1: UserInfo, person2: UserInfo;
        if (type === "name") {
          person1 = results[0].data[0];
          person2 = results[1].data[0];
        } else if (type === "url") {
          person1 = results[0].data;
          person2 = results[1].data;
        }

        // Write an intro sentence based on the data received from the background script
        const sentence1 = `${person2.name.split(" ")[0]}, <a href="${
          person1.linkedInUrl
        }" target="_blank">${person1.name.split(" ")[0]}</a> is a ${
          person1.title
        } based in ${person1.location
          .split(" ")[0]
          .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "")}.`;

        const sentence2 = `${person1.name.split(" ")[0]}, <a href=${
          person2.linkedInUrl
        } target="_blank">${person2.name.split(" ")[0]}</a> is a ${
          person2.title
        } based in ${person2.location
          .split(" ")[0]
          .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "")}.`;

        // Upon receiving the result, render the result in the div nested inside the div with class editable
        const composeWindow = document.querySelector(".editable");
        if (composeWindow instanceof HTMLElement) {
          const innerHTML = composeWindow.innerHTML;
          const prependHTML = `
            <div>
              Hi ${person1.name.split(" ")[0]} and ${
            person2.name.split(" ")[0]
          },
            </div>
            <div>
              <br />
            </div>
            <font color="#E15A32">
              [Write your intro here]
            </font>
            <div>
              <br />
            </div>
            <div>
              ${sentence1}
            </div>
            <div>
              <br />
            </div>
            <div>
              ${sentence2}
            </div>
            <div>
              <br />
            </div>
            <div>
              I'll let you two take it from here!
            </div>
            <div>
              <br />
            </div>
            <div>
              Best,
            </div>
            <div>
              ${user.split(" ")[0]}
            </div>
          `;
          composeWindow.innerHTML = prependHTML + innerHTML;
        }
      }
    });

    init(".introer-popup-container");

    // createRoot(info).render(<App />);
  }
};

render();
