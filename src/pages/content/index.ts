if (window.location.href.includes("linkedin.com")) {
  console.log("on linkedin");
} else {
  console.log("content is loaded!");
}

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./components");
