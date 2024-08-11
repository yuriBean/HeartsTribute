import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
const getStorageStats = async (size) => {
  try {
      const docRef = doc(db, "storage-stats", "1");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
     
      return data;
  } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
  }
}


export { getStorageStats };
