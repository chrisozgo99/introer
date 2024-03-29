import { UserTypes } from "@src/types/user";

export function generateSentence(user: UserTypes) {
  // User has written their own intro
  if ("intro" in user) {
    const intro: string = user.intro;
    if (intro.includes(user.name) && user.linkedInUrl) {
      return intro.replace(
        user.name,
        `<a href="${user.linkedInUrl}" target="_blank">${user.name}</a>`
      );
    } else {
      return intro;
    }
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
  const signature = composeWindow?.querySelector(
    'div[data-smartmail="gmail_signature"]'
  );

  const signaturePrefix = composeWindow?.querySelector(
    'span[class="gmail_signature_prefix"]'
  );

  const signatureClone = signature ? signature.cloneNode(true) : null;
  const signaturePrefixClone = signaturePrefix
    ? signaturePrefix.cloneNode(true)
    : null;

  if (composeWindow instanceof HTMLElement) {
    composeWindow.innerHTML = "";

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
            <div ${
              !name || !name.split(" ")[0] ? `style="color: #E15A32"` : ""
            }>
              ${name && name.split(" ")[0] ? name.split(" ")[0] : "[Your Name]"}
            </div>
            <div>
              <br />
            </div>
          `;
    composeWindow.innerHTML = prependHTML;
    if (signaturePrefixClone) {
      composeWindow.appendChild(signaturePrefixClone);
    }
    if (signatureClone) {
      composeWindow.appendChild(signatureClone);
    }

    const subjectLine = document.querySelector(".aoD.az6 input");
    if (subjectLine instanceof HTMLInputElement) {
      subjectLine.value = `Connecting ${firstUser.name} & ${secondUser.name}`;
    }
  }
}
