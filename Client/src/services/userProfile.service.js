import { collection, doc, updateDoc, query, getDocs, where, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";


export const getUserWithEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("No user found with the provided email:", email);
      return null; 
    }
    const user = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return user[0];
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

export const updateUserWithId = async (id, data) => {
  try {
    const docRef = doc(db, "users", id);
    data.updated_at = serverTimestamp();
    await updateDoc(docRef,
      data
    );
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

