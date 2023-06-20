import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
// import Icon from "./icon/icon";
// import ReactDOM from "react-dom";

refreshOnUpdate("pages/content");

if (
  window.location.href === "https://mail.google.com/mail/u/0/#inbox?compose=new"
) {
  addIconToComposeWindow();
}

const body = document.querySelector("body");
const info = document.createElement("div");

info.className = "introer-popup-container";

body?.appendChild(info);

// Try to select the "Compose" button
const composeButton = document.querySelector(".T-I.T-I-KE.L3");

// Check if the "Compose" button exists
if (composeButton instanceof Node) {
  // If it exists, add a click event listener to it
  composeButton.addEventListener("click", function () {
    addIconToComposeWindow();
  });

  createRoot(info).render(<App />);
}

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

          const introerIconUrl = chrome.runtime.getURL("introer_logo.png");

          const img = document.createElement("img");

          img.src = introerIconUrl;
          img.className = "introer-icon";
          img.alt = "Introer";
          img.width = 34;
          img.height = 34;

          newTd.appendChild(img);

          // ReactDOM.render(
          //   <Icon introerIconUrl={introerIconUrl} />,
          //   newTd
          // );

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
