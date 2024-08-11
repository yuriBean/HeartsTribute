import { signInWithEmailAndPassword } from 'firebase/auth';
import { errorMessagesFirebaseAuth } from '../utils/errorMessagesFirebaseAuth';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //  if email field in collection admin is email then login 
    const q = query(collection(db, "admins"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("User not found");
      console.log("User not found");
    }
    return userCredential.user;
  } catch (error) {
    throw new Error(errorMessagesFirebaseAuth[error.code] || error.message);
  }
}

export const signout = async () => {
  try {
    await auth.signOut();
    window.location.href = '/sign-in';
  } catch (error) {
    throw new Error(errorMessagesFirebaseAuth[error.code] || error.message);
  }
}