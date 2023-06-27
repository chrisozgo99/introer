import EnterNames from "./enter-names/enter-names";
import { AccountState } from "@src/state/reducers/account";

interface Props {
  account: AccountState;
}

export default function App(props: Props) {
  const { account } = props;
  const { user } = account;

  if (!user) {
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
                onClick={() => {
                  chrome.runtime.sendMessage({
                    action: "open_options_page",
                  });
                }}
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
