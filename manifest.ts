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
      matches: ["*://mail.google.com/mail/*", "*://*.linkedin.com/*"],
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
  permissions: ["cookies", "storage", "identity"],
  oauth2: {
    client_id:
      "523499253505-1v0h4tv3qsi37b6fkkm1e4fdjj8pu3k3.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/userinfo.email"],
  },
  key: "agpgpkgbchmgjcpkdpoidldaobdipock",
};

// const manifest: chrome.runtime.ManifestV2 = {
//   manifest_version: 2,
//   name: packageJson.name,
//   version: packageJson.version,
//   description: packageJson.description,
//   options_page: "src/pages/options/index.html",
//   background: {
//     scripts: ["src/pages/background/index.js"],
//     persistent: false,
//   },
//   browser_action: {
//     default_popup: "src/pages/popup/index.html",
//     default_icon: "icon-34.png",
//   },
//   icons: {
//     "128": "icon-128.png",
//   },
//   content_scripts: [
//     {
//       matches: ["*://mail.google.com/mail/*"],
//       js: ["src/pages/content/index.js"],
//       // KEY for cache invalidation
//       css: ["assets/css/contentStyle<KEY>.chunk.css"],
//     },
//   ],
//   web_accessible_resources: [
//     "assets/js/*.js",
//     "assets/css/*.css",
//     "icon-128.png",
//     "icon-34.png",
//     "introer_logo.png",
//     "src/pages/options/index.html",
//   ],
//   permissions: ["cookies", "storage", "identity"],
//   content_security_policy:
//     "script-src 'self' https://www.gstatic.com/ https://*.firebaseio.com https://www.googleapis.com; object-src 'self'",
//   oauth2: {
//     client_id:
//       "523499253505-1v0h4tv3qsi37b6fkkm1e4fdjj8pu3k3.apps.googleusercontent.com",
//     scopes: [""],
//   },
// };

export default manifest;
