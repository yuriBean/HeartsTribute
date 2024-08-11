import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth"
import { createUserRecord } from "./emailAuthServices";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../firebase";
import generateRandomSequence from "../utils/generateRandomSequence";

const usersRef = collection(db, "users");

const provider = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

const isNewUser = async (email) => {
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

const extractName = (displayName) => {
  if (!displayName) return { firstName: "", lastName: "" };
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  return { firstName, lastName };
};

export const signinWithGoogle = async () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const { firstName, lastName } = extractName(user.displayName);

      if (await isNewUser(user.email)) {
        try {
          await createUserRecord(user.uid, user.email, firstName, lastName);
          console.log("User record created successfully");
        } catch (error) {
          console.error("Error creating user record:", error);
        }
      }

      console.log(user);
      if (user) {
        window.location.href = "/";
      }
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during sign-in:", errorMessage, errorCode);
    });
};

export const signinWithFacebook = async () => {
  signInWithPopup(auth, providerFacebook)
    .then(async (result) => {
      const user = result.user;

      const { firstName, lastName } = extractName(user.displayName);
      if (await isNewUser(user.email)) {
        try {
          await createUserRecord(user.uid, user.email, firstName, lastName);
          console.log("User record created successfully");
        } catch (error) {
          console.error("Error creating user record:", error);
        }
      }

      console.log(user);
      if (user) {
        window.location.href = "/";
      }
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during sign-in:", errorMessage, errorCode);
    })
}






