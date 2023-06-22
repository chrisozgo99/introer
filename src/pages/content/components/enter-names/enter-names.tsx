import { useState } from "react";

export default function EnterNames() {
  const [linkedIn1, setLinkedIn1] = useState("");
  const [linkedIn2, setLinkedIn2] = useState("");

  return (
    <div className="introer-popup-main">
      <div className="introer-header-div">
        <h1 className="introer-header">Who do you want to introduce?</h1>
      </div>
      <div className="introer-popup-body">
        <div className="introer-popup-body-content">
          <div className="introer-popup-body-content-input">
            <input
              type="text"
              placeholder="Name"
              value={linkedIn1}
              onChange={(e) => setLinkedIn1(e.target.value)}
            />
          </div>
          <div className="introer-popup-body-content-input">
            <input
              type="text"
              placeholder="Name"
              value={linkedIn2}
              onChange={(e) => setLinkedIn2(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <button
          className="introer-popup-body-content-input-button"
          type="button"
          onClick={() => {
            chrome.runtime.sendMessage({
              action: "hello_world",
            });
          }}
        >
          <span id="introer-popup-body-content-input-button">Next</span>
        </button>
      </div>
    </div>
  );
}
