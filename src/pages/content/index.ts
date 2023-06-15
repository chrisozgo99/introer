console.log("content is loaded!");

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./components/Demo");
