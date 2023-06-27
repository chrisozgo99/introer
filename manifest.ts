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
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhpuMpmc2c89KK53ew2qjPxHoUBv6NmdWbTeLLOeocd2YmCbTzsr3Wpol5BvWngWp2Z8uYmFMyCATS6k1o8T2pv/m3n8g6rvGyOXyH5FfJwZTsYXaWmDil3JP0Mp7nmGAmv5zC4RkvQd3J/K1Owt3v0zbqPj8HzwR5cAumGXao2IJlEW0fhDIQ30W5jEYe1TlE7bSRQH0ZizuNlzHquDSU4jPrqYgr8FNGPZ9JI+rppQNSvcVMciYSA/EZF/4vw8fbzCWVkcscEF/U6/QAGEOYDPTr7lpG3EwSFIcjrQDrPTKP4yTdOS5UwsyQVkBykBCz/Sq3guT218JiyazypD1LwIDAQAB",
};

export default manifest;
