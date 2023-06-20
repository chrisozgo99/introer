import React, { useState, useEffect } from "react";
import "@pages/options/Options.css";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../background";
import { accountAuth, accountLogout, accountProfile } from "@src/state/actions";
import { connect } from "react-redux";
// import { User } from "@src/types/user";
import { AccountState } from "@src/state/reducers/account";

const Options: React.FC = (props: AccountState) => {
  console.log(props.user);

  const [user, setUser] = useState(undefined);

  const signIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        alert(
          `SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`
        );
        return;
      }

      signInWithCredential(auth, GoogleAuthProvider.credential(null, token))
        .then((res) => {
          console.log(res);
          console.log("signed in!");
        })
        .catch((err) => {
          alert(`SSO ended with an error: ${err}`);
        });
    });
  };

  const signOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    auth.signOut().then(() => {
      chrome.identity.clearAllCachedAuthTokens();
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user && user.uid ? user : null);
    });
  }, []);

  if (undefined === user) return <h1>Loading...</h1>;

  if (user != null)
    return (
      <div>
        <h1>Signed in as {user.displayName}.</h1>
        <div>
          <h2>Modify your information</h2>
          <h3>This will help other Introer users know how to intro you</h3>
          <form>
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Title" />
            <input type="text" placeholder="Company" />
            <input type="text" placeholder="LinkedIn URL" />
            <input type="text" placeholder="Your Intro" />
            <button
              onClick={async (e) => {
                e.preventDefault();
                // await setUser()
              }}
            >
              Save
            </button>
          </form>
        </div>
        <button onClick={signOut}>Sign Out?</button>
      </div>
    );

  return <button onClick={signIn}>Sign In with Google</button>;
};

const mapStateToProps = (state) =>
  Object.assign({}, state.account as AccountState);

const mapDispatchToProps = (dispatch) => ({
  accountAuth: (data) => {
    dispatch(accountAuth(data));
  },
  accountProfile: (data) => {
    dispatch(accountProfile(data));
  },
  accountLogout: () => {
    dispatch(accountLogout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Options);
