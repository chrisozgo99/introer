import React, { useState, useEffect } from "react";
import "@pages/options/Options.css";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../background";
import { accountAuth, accountLogout, accountProfile } from "@src/state/actions";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "@src/utils/firebase/firestore/users";
import { User } from "@src/types/user";
import { RootState } from "@src/state/reducers";

const Options: React.FC = () => {
  const dispatch = useDispatch();
  const user: User = useSelector(
    (state: RootState) => state.account.user as User
  );

  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [company, setCompany] = useState(user?.company || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [intro, setIntro] = useState(user?.intro || "");

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
        .then(async (res) => {
          const val = await getUser(res.user);
          dispatch(
            accountProfile({
              type: "ACCOUNT_PROFILE",
              user: val,
            })
          );
          dispatch(
            accountAuth({
              type: "ACCOUNT_AUTH",
              token: token,
            })
          );
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
      dispatch(accountLogout());
      chrome.identity.clearAllCachedAuthTokens();
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (authState) => {
      if (authState == null) return;
      const val = await getUser(authState);
      dispatch(
        accountProfile({
          type: "ACCOUNT_PROFILE",
          user: val,
        })
      );
    });
  }, []);

  if (undefined === user) return <h1>Loading...</h1>;

  if (user != null)
    return (
      <div>
        <h1>Signed in as {user.name}.</h1>
        <div>
          <h2>Modify your information</h2>
          <h3>This will help other Introer users know how to intro you</h3>
          <form>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              type="text"
              placeholder="LinkedIn"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your Intro"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
            <button
              onClick={async (e) => {
                const updatedUser: Partial<User> = {};
                if (name && name !== user.name) updatedUser["name"] = name;
                if (title && title !== user.title) updatedUser["title"] = title;
                if (company && company !== user.company)
                  updatedUser["company"] = company;
                if (linkedin && linkedin !== user.linkedin)
                  updatedUser["linkedin"] = linkedin;
                if (intro && intro !== user.intro) updatedUser["intro"] = intro;
                e.preventDefault();
                await setUser(user.id, {
                  ...user,
                  ...updatedUser,
                });
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

// const mapStateToProps = (state) =>
//   Object.assign({}, state.account as AccountState);

// const mapDispatchToProps = (dispatch) => ({
//   accountAuth: (data) => {
//     dispatch(accountAuth(data));
//   },
//   accountProfile: (data) => {
//     dispatch(accountProfile(data));
//   },
//   accountLogout: () => {
//     dispatch(accountLogout());
//   },
// });

export default Options;
