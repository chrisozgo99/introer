import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["*://mail.google.com/mail/*"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  content_security_policy: {
    extension_pages:
      "script-src 'self'; object-src 'self'; script-src-elem 'self' 'unsafe-inline';",
  },
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png",
        "introer_logo.png",
        "src/pages/options/index.html",
      ],
      matches: ["*://*/*"],
    },
  ],
  permissions: ["storage", "identity"],
  oauth2: {
    client_id:
      "523499253505-1v0h4tv3qsi37b6fkkm1e4fdjj8pu3k3.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/userinfo.email"],
  },
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArDc5mFl+PhA2YzYgaRMwDecelDyrW+EWsI8QlhPezg1IT0JY5ApMJtX9poPrvcQcfOS+tOPfKb4GtPuz75thuCtKuOdBCIWduqwfaj7lqvsSXLPVFAaFjoNDgKy3ULgadxpzuv5o8BbmwvckJAN4I2eeVDtertYL7wk4kCY/zZ+Moq2pv9OvD2u9NuADsT1coskuksk4EQUNjaeNmyjKaU76gznlCm4Sg+o196m7nGatIPykcRwZZr1yOzHax4GJdtL6B5UaGjLWyhLJgRgW5dCYSW6U5Dd+tZZIjsuNVJi2AK6nJWaq5WbI5Qb3C6/kPFOM22/9rGZWIbxGwraHNQIDAQAB",
};

export default manifest;
