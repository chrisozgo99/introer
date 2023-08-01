import { db } from "@src/pages/background";
import { Search } from "@src/types/search";
import { User } from "@src/types/user";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";

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
        name: user.displayName || "",
        profilePhoto: user.photoURL,
      };

      await setUser(user.uid, data);

      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function searchForUser(searchQuery: Search) {
  const querySnapshot = await getDocs(
    query(
      collection(db, "users"),
      where(searchQuery.type, "==", searchQuery.search)
    )
  );

  if (querySnapshot.empty) {
    return null;
  } else {
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });
    return users;
  }
}

async function handleSearch(
  type: "url" | "name",
  query: [
    { name: string; company: string } | string,
    { name: string; company: string } | string
  ]
): Promise<[User[] | null, User[] | null]> {
  let results: [User[] | null, User[] | null] = [null, null];
  let search1: Promise<User[]> | null;
  let search2: Promise<User[]> | null;

  if (type === "url") {
    search1 = searchForUser({
      search: query[0] as string,
      type: "linkedin",
    });
    search2 = searchForUser({
      search: query[1] as string,
      type: "linkedin",
    });
  } else if (type === "name") {
    search1 = searchForUser({
      search: (query[0] as { name: string; company: string }).name,
      type: "name",
    });
    search2 = searchForUser({
      search: (query[1] as { name: string; company: string }).name,
      type: "name",
    });
  }

  const res = await Promise.all([search1, search2]);

  if (res[0] && res[1]) {
    results = [res[0], res[1]];
  } else if (res[0]) {
    results = [res[0], null];
  } else if (res[1]) {
    results = [null, res[1]];
  } else {
    results = [null, null];
  }

  return results;
}

export { setUser, getUser, searchForUser, handleSearch };
