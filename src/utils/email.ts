import { UserTypes } from "@src/types/user";

export function generateSentence(user: UserTypes) {
  // User has written their own intro
  if ("intro" in user) {
    return user.intro;
    // User has not written their own intro, but data is not coming from LinkedIn
  } else if ("email" in user) {
    return `${
      user.linkedInUrl && user.linkedInUrl !== ""
        ? `<a href="${user.linkedInUrl}" target="_blank">${user.name}</a>`
        : user.name
    } is a ${user.title ? user.title : "good friend of mine"}`;
    // User has not written their own intro, and data is coming from LinkedIn
  } else {
    return `<a href="${user.linkedInUrl}" target="_blank">${
      user.name
    }</a> is a ${user.title} based in ${user.location
      .split(" ")[0]
      .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "")}.`;
  }
}

export function generateEmailHTML(
  firstUser: UserTypes,
  secondUser: UserTypes,
  name: string
) {
  const sentence1 = `${secondUser.name.split(" ")[0]} – ${generateSentence(
    firstUser
  )}`;
  const sentence2 = `${firstUser.name.split(" ")[0]} – ${generateSentence(
    secondUser
  )}`;

  // Upon receiving the result, render the result in the div nested inside the div with class editable
  const composeWindow = document.querySelector(".editable");
  if (composeWindow instanceof HTMLElement) {
    const innerHTML = composeWindow.innerHTML;
    const prependHTML = `
            <div>
              Hi ${firstUser.name.split(" ")[0]} and ${
      secondUser.name.split(" ")[0]
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
              ${name.split(" ")[0]}
            </div>
          `;
    composeWindow.innerHTML = prependHTML + innerHTML;

    // Add subject line
    const subjectLine = document.querySelector(".aoD.az6 input");
    if (subjectLine instanceof HTMLInputElement) {
      subjectLine.value = `Connecting ${firstUser.name} & ${secondUser.name}`;
    }
  }
}
