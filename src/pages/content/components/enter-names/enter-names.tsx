import { useState } from "react";

export default function EnterNames() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const [url, setUrl] = useState(true);

  return (
    <div className="introer-popup-main bg-slate-400">
      <div className="introer-header-div">
        <h1 className="introer-header text-2xl font-bold mb-4 text-center text-black shadow-lg">
          Who do you want to introduce?
        </h1>
      </div>
      <div className="introer-popup-body">
        <div className="introer-popup-body-content">
          <div>
            <div>Toggle to enter names or LinkedIn URLs</div>
            <label>
              <input type="checkbox" onChange={() => setUrl(!url)} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="introer-popup-body-content-div">
            <input
              className="introer-popup-body-content-input w-[300px]"
              type="text"
              placeholder={
                url
                  ? "Ex: https://www.linkedin.com/in/john-doe/"
                  : "Ex: John Doe"
              }
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
            />
          </div>
          <div className="introer-popup-body-content-div">
            <input
              className="introer-popup-body-content-input w-[300px]"
              type="text"
              placeholder={
                url
                  ? "Ex: https://www.linkedin.com/in/jane-doe/"
                  : "Ex: Jane Doe"
              }
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
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
              action: "searchIntros",
              values: [value1, value2],
              type: url ? "url" : "name",
            });
          }}
        >
          <span id="introer-popup-body-content-input-button">Next</span>
        </button>
      </div>
    </div>
  );
}
