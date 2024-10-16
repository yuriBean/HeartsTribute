import { collection, addDoc, doc, getDoc, arrayUnion, arrayRemove, updateDoc, query, getDocs, where, serverTimestamp, orderBy, limit, startAt, startAfter } from "firebase/firestore";
import { db } from "../../firebase";


export const getQRCode = async (qr_id) => {
  try {
    const q = query(collection(db, "qrcodes"), where("qr_id", "==", qr_id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.log(error);
  }

}

export const getPrivateOwner = async (profileID, userID) => {
  try {
    const profileRef = doc(db, "profiles", profileID);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      return true;
    }

    const profileData = profileDoc.docs[0].data();
    return profileData.user_id === userID;
  } catch (error) {
    console.log(error);
    return false;
  }
};
