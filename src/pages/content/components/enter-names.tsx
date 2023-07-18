import { useState } from "react";
import { useDispatch } from "react-redux";
import Lottie from "lottie-react";
import Switch from "react-switch";
import { statusUpdate } from "@src/state/actions/status";
import searching from "@src/assets/lottie/searching.json";

export default function EnterNames() {
  const dispatch = useDispatch();
  const [company1, setCompany1] = useState("");
  const [company2, setCompany2] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState(false);

  const nameCompany = (
    <div>
      <div className="introer-popup-body-content-div flex flex-row w-full justify-evenly">
        <div className="w-1/2">Name</div>
        <div className="w-1/2">(Optional) Company</div>
      </div>
      <div className="introer-popup-body-content-div flex flex-row w-full justify-evenly">
        <div className="w-1/2">
          <input
            className="introer-popup-body-content-input"
            type="text"
            placeholder={"Ex: John Doe"}
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
        </div>
        <div className="w-1/2">
          <input
            className="introer-popup-body-content-input"
            type="text"
            placeholder={"Ex: Microsoft"}
            value={company1}
            onChange={(e) => setCompany1(e.target.value)}
          />
        </div>
      </div>
      <div className="introer-popup-body-content-div flex flex-row w-full">
        <div className="w-1/2">
          <input
            className="introer-popup-body-content-input"
            type="text"
            placeholder={"Ex: John Doe"}
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </div>
        <div className="w-1/2">
          <input
            className="introer-popup-body-content-input"
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
    <div className="w-full">
      <div className="introer-popup-body-content-div">
        <input
          className="introer-popup-body-content-input w-full"
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
          className="introer-popup-body-content-input w-full"
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

  const lottie = <Lottie animationData={searching} loop={true} />;

  if (loading) {
    return (
      <div className="introer-popup-main bg-white border-black w-40 h-40">
        <div className="text-center">Locating your connections</div>
        <div>
          <button
            className="introer-popup-body-content-input-button"
            type="button"
            onClick={() => {
              setLoading(!loading);
            }}
          >
            <span id="introer-popup-body-content-input-button">Cancel</span>
          </button>
        </div>
        {lottie}
      </div>
    );
  }

  return (
    <div className="introer-popup-main bg-white border-black">
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
              <Switch
                onChange={() => {
                  setUrl(!url);
                  setValue1("");
                  setValue2("");
                }}
                checked={url}
              />
            </label>
            <div>Enter LinkedIn URL</div>
          </div>
        </div>
        {url ? linkedInUrl : nameCompany}
      </div>
      <div className="flex flex-row justify-evenly">
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
        <div className="introer-no-close">
          <button
            className="introer-popup-body-content-input-button introer-no-close"
            type="button"
            onClick={() => {
              setLoading(!loading);
              chrome.runtime.sendMessage({
                action: "searchIntros",
                values: url
                  ? [value1, value2]
                  : [
                      {
                        name: value1,
                        company: company1,
                      },
                      {
                        name: value2,
                        company: company2,
                      },
                    ],
                type: url ? "url" : "name",
              });
            }}
          >
            <span
              className="introer-no-close"
              id="introer-popup-body-content-input-button"
            >
              Next
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
