import { auth, db } from "../../firebase";
import { doc, setDoc, getDocs, query, where, collection, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { errorMessagesFirebaseAuth } from "../utils/errorMessagesFirebaseAuth";


const usersRef = collection(db, "users");


export const signup = async (email, password, first_name, last_name) => {

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserRecord(userCredential.user.uid, email, first_name, last_name);
    await verifyEmail();
    return userCredential.user;
  } catch (error) {
    if (error.code) {
      throw new Error(errorMessagesFirebaseAuth[error.code] || error.message);
    } else {
      throw new Error(error.message);
    }

  }
}

export const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(errorMessagesFirebaseAuth[error.code] || error.message);
  }
}

export const verifyEmail = async () => {
  try {
    await sendEmailVerification(auth.currentUser, {
      url: "https://admin.heartstribute.com/redirect",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export const signout = (email, password) => {
  signOut(auth).then(() => {
    window.location.href = "/login";
    localStorage.removeItem("user");
  }).catch((error) => {
  });
}

export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "https://admin.heartstribute.com/redirect",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export const createUserRecord = async (uuid, email, first_name, last_name) => {
  try {
    await setDoc(doc(db, "users", uuid), {
      uid: uuid,
      email: email,
      first_name: first_name,
      last_name: last_name,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(error.message);
  }

}



export const checkUserProfiles = async (uid) => {
  try {
    const q = query(profilesRef, where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);
    const profiles = querySnapshot.docs.map(doc => doc.data());
    return profiles;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const linkTributeTag = async (profileID, tagID) => {
  try {
    const profileDoc = doc(db, "profiles", profileID);
    await setDoc(profileDoc, { tribute_tag_id: tagID }, { merge: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createProfile = async (uid, firstName, lastName, tagID) => {
  try {
    const profileDoc = doc(profilesRef);
    await setDoc(profileDoc, {
      id: profileDoc.id,
      user_id: uid,
      first_name: firstName,
      last_name: lastName,
      tribute_tag_id: tagID,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
