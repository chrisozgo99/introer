import { db } from "@src/pages/background";
import { doc, setDoc } from "firebase/firestore";

async function setUser(uid, data) {
  return await setDoc(doc(db, "users", uid), data).catch((error) => {
    console.error("Error writing document: ", error);
  });
}

export { setUser };
