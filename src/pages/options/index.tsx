import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { setupReduxed, ReduxedSetupOptions } from "reduxed-chrome-storage";
import Options from "@pages/options/Options";
import "@pages/options/index.css";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import reducers from "@src/state/reducers";
import { configureStore } from "@reduxjs/toolkit";

refreshOnUpdate("pages/options");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);

  const storeCreatorContainer = (preloadedState: unknown) =>
    configureStore({
      reducer: reducers,
      preloadedState,
    });

  const options: ReduxedSetupOptions = {
    namespace: "chrome",
  };

  const instantiate = setupReduxed(storeCreatorContainer, options);

  instantiate().then((store) => {
    root.render(
      <Provider store={store}>
        <Options />
      </Provider>
    );
  });
}

init();
