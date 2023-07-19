import React, { useState, useEffect } from "react";
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
  const [linkedin, setLinkedin] = useState(user?.linkedInUrl || "");
  const [intro, setIntro] = useState(user?.intro || "");

  useEffect(() => {
    if (!user) return;
    setName(user?.name);
    setTitle(user?.title);
    setCompany(user?.company);
    setLinkedin(user?.linkedInUrl);
    setIntro(user?.intro);
  }, [user]);

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
      <div className="w-full">
        <h1 className="text-center">Signed in as {user.name}</h1>
        <div className="flex justify-center">
          <button onClick={signOut}>Sign Out</button>
        </div>

        <div>
          <h2>Modify your information</h2>
          <h3>This will help other Introer users know how to intro you</h3>
          <form>
            <div className="grid-cols-2 gap-4">
              <div className="mb-8">
                <h4>Name:</h4>
                <input
                  className="w-2/3"
                  type="text"
                  placeholder="Ex: George Burdell"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-8">
                <h4>Title:</h4>
                <input
                  className="w-2/3"
                  type="text"
                  placeholder="Ex: Marketing Manager at Amazon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-8">
                <h4>Company:</h4>
                <input
                  className="w-2/3"
                  type="text"
                  placeholder="Ex: Amazon"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="mb-8">
                <h4>LinkedIn:</h4>
                <input
                  className="w-2/3"
                  type="text"
                  placeholder="Ex: https://www.linkedin.com/in/george-burdell/"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
              <div className="mb-8">
                <h4>Intro:</h4>
                <input
                  className="w-2/3"
                  type="text"
                  placeholder="Ex: George Burdell is a marketing manager at Amazon, working with the Alexa team to build the future of voice computing."
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={async (e) => {
                const updatedUser: Partial<User> = {};
                if (name && name !== user.name) updatedUser["name"] = name;
                if (title && title !== user.title) updatedUser["title"] = title;
                if (company && company !== user.company)
                  updatedUser["company"] = company;
                if (linkedin && linkedin !== user.linkedInUrl)
                  updatedUser["linkedInUrl"] = linkedin;
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
      </div>
    );

  return <button onClick={signIn}>Sign In with Google</button>;
};

export default Options;
