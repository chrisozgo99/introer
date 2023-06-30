import { statusUpdate } from "@src/state/actions/status";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Switch from "react-switch";

export default function EnterNames() {
  const dispatch = useDispatch();
  const [company1, setCompany1] = useState("");
  const [company2, setCompany2] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const [url, setUrl] = useState(false);

  const nameCompany = (
    <div>
      <div className="introer-popup-body-content-div flex flex-row">
        <div>
          <input
            className="introer-popup-body-content-input w-[150px]"
            type="text"
            placeholder={"Ex: John Doe"}
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
        </div>
        <div>
          <input
            className="introer-popup-body-content-input w-[150px]"
            type="text"
            placeholder={"Ex: Microsoft"}
            value={company1}
            onChange={(e) => setCompany1(e.target.value)}
          />
        </div>
      </div>
      <div className="introer-popup-body-content-div flex flex-row">
        <div>
          <input
            className="introer-popup-body-content-input w-[150px]"
            type="text"
            placeholder={"Ex: John Doe"}
            value={value2}
            onChange={(e) => setValue1(e.target.value)}
          />
        </div>
        <div>
          <input
            className="introer-popup-body-content-input w-[150px]"
            type="text"
            placeholder={"Ex: Google"}
            value={company2}
            onChange={(e) => setCompany2(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const linkedInUrl = (
    <div>
      <div className="introer-popup-body-content-div">
        <input
          className="introer-popup-body-content-input w-[300px]"
          type="text"
          placeholder={
            url ? "Ex: https://www.linkedin.com/in/john-doe/" : "Ex: John Doe"
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
            url ? "Ex: https://www.linkedin.com/in/jane-doe/" : "Ex: Jane Doe"
          }
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="introer-popup-main bg-white">
      <div className="introer-header-div">
        <h1 className="introer-header text-2xl font-thin mb-4 text-center font-serif">
          Who do you want to introduce?
        </h1>
      </div>
      <div className="introer-popup-body">
        <div className="introer-popup-body-content">
          <div className="flex flex-row items-center justify-evenly">
            <div>Enter name and company</div>
            <label>
              <span className="slider round"></span>
              <Switch onChange={() => setUrl(!url)} checked={url} />
            </label>
            <div>Enter LinkedIn URL</div>
          </div>
        </div>
        {url ? linkedInUrl : nameCompany}
      </div>
      <div className="flex flex-row">
        <div>
          <button
            className="introer-popup-body-content-input-button"
            type="button"
            onClick={() => {
              dispatch(
                statusUpdate({
                  type: "STATUS_UPDATE",
                  status: "makeIntro",
                })
              );
            }}
          >
            <span id="introer-popup-body-content-input-button">Back</span>
          </button>
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
    </div>
  );
}