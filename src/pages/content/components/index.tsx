import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import Icon from "./icon/icon";
import ReactDOM from "react-dom";

refreshOnUpdate("pages/content");

// If not on LinkedIn:
if (!window.location.href.includes("linkedin.com")) {
  const body = document.querySelector("body");
  const info = document.createElement("div");

  info.className = "introer-popup-container";

  body?.appendChild(info);

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

                const introerIconUrl =
                  chrome.runtime.getURL("introer_logo.png");

                ReactDOM.render(
                  <Icon introerIconUrl={introerIconUrl} />,
                  newTd
                );

                const buttonDiv = newTd.querySelector(
                  ".introer-embedded-button"
                );

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
      });

      // Start observing the document for configured mutations
    } else {
      console.log("Compose button not found");
    }
  });

  createRoot(info).render(<App />);

  info.addEventListener("click", function (event) {
    console.log("clicked");
    const target = event.target as HTMLElement;
    console.log(target, target.id);
    if (target && target.id === "introer-popup-body-content-input-button") {
      console.log("sending message");
      chrome.runtime.sendMessage({ action: "open_options_page" });
    }
  });
} else {
  console.log("on linkedin!!");
  // console.log the cookies
}
