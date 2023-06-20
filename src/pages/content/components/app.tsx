import { useState } from "react";
import EnterNames from "./enter-names/enter-names";

export default function App() {
  const [loggedIn] = useState(true);

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

  return <EnterNames />;
}
