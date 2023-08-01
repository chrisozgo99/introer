import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">INTROER</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <div className="mb-4">
          <a
            className="App-link"
            href="chrome-extension://jjjhhhikdembmidfggagefoiecdogfoj/src/pages/options/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Settings
          </a>
        </div>
        <a
          className="App-link"
          href="https://forms.gle/aJBtDQiXvBfJaJHk9"
          target="_blank"
          rel="noopener noreferrer"
        >
          Provide Feedback
        </a>
      </header>
    </div>
  );
};

export default Popup;
