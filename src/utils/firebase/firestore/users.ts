import { db } from "@src/pages/background";
import { User } from "@src/types/user";
import { doc, setDoc, getDoc } from "firebase/firestore";

async function setUser(uid: string, data: User) {
  return await setDoc(doc(db, `users/${uid}`), data).catch((error) => {
    console.error("Error writing document: ", error);
  });
}

async function getUser(user) {
  try {
    const docRef = doc(db, `users/${user.uid}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // User does not exist, create it
      const data: User = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      };

      await setUser(user.uid, data);

      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export { setUser, getUser };
