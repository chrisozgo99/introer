import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";
document.body.append(root);

const popup = document.createElement("div");
popup.className = "introer-popup-container";

popup.innerHTML = `
    <div class="introer-popup">
        <div class="introer-popup-header">
            <div class="bg-red-700">
                <h1 class="text-blue-500">Who do you want to introduce?</h1>
            </div>
        </div>
        <div class="introer-popup-body">
            <div class="introer-popup-body-content">
                <div class="introer-popup-body-content-input">
                    <input type="text" placeholder="Name" />
                </div>
            </div>
        </div>
    </div>
    `;

const body = document.querySelector("body");
body?.appendChild(popup);

window.addEventListener("load", function () {
  // Try to select the "Compose" button
  const composeButton = document.querySelector(".T-I.T-I-KE.L3");

  // Check if the "Compose" button exists
  if (composeButton instanceof Node) {
    // If it exists, add a click event listener to it
    composeButton.addEventListener("click", function () {
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

              newTd.innerHTML = `
                  <div class="introer-surround-div">
                      <div class="introer-embedded-button" data-tooltip="Make an Intro" aria-label="Make an Intro">
                          <img src=${introerIconUrl} class="introer-icon" alt="Introer" width="34" height="34">
                      </div>
                  </div>
              `;

              const buttonDiv = newTd.querySelector(".introer-embedded-button");

              buttonDiv?.addEventListener("click", function () {
                if (popup.style.display === "block") {
                  popup.style.display = "none";
                } else {
                  popup.style.display = "block";
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
    });

    // Start observing the document for configured mutations
  } else {
    console.log("Compose button not found");
  }
});

createRoot(root).render(<App />);
