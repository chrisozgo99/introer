import { useState } from "react";

export default function App() {
  const [loggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <div className="introer-popup">
        <div className="introer-popup-header">
          <div>
            <h1>You need to log in</h1>
          </div>
        </div>
        <div className="introer-popup-body">
          <div className="introer-popup-body-content">
            <div className="introer-popup-body-content-input">
              <button
                className="introer-popup-body-content-input-button"
                type="button"
              >
                <span id="introer-popup-body-content-input-button">Log in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="introer-popup">
      <div className="introer-popup-header">
        <div>
          <h1>Who do you want to introduce?</h1>
        </div>
      </div>
      <div className="introer-popup-body">
        <div className="introer-popup-body-content">
          <div className="introer-popup-body-content-input">
            <input type="text" placeholder="Name" />
          </div>
        </div>
      </div>
    </div>
  );
}
