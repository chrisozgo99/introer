import { UserInfo } from "@src/types/user";
import { Store } from "redux";

export function generateEmailHTML(request, store: Store) {
  const { results, type } = request;

  let person1: UserInfo, person2: UserInfo;
  if (type === "name") {
    person1 = results[0].data[0];
    person2 = results[1].data[0];
  } else if (type === "url") {
    person1 = results[0].data;
    person2 = results[1].data;
  }

  // Write an intro sentence based on the data received from the background script
  const sentence1 = `${person2.name.split(" ")[0]} – <a href="${
    person1.linkedInUrl
  }" target="_blank">${person1.name}</a> is a ${
    person1.title
  } based in ${person1.location
    .split(" ")[0]
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "")}.`;

  const sentence2 = `${person1.name.split(" ")[0]} – <a href=${
    person2.linkedInUrl
  } target="_blank">${person2.name}</a> is a ${
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
              ${store.getState().account.user.name.split(" ")[0]}
            </div>
          `;
    composeWindow.innerHTML = prependHTML + innerHTML;
  }
}
