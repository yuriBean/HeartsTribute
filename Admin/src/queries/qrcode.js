import { db } from "../firebase"; // Adjust the import path as necessary
import { collection, addDoc, doc, getDoc, serverTimestamp, getDocs, startAfter, query, orderBy, limit, updateDoc } from "firebase/firestore";

export const createQRCode = async (data) => {
  try {
    data.updated_at = serverTimestamp();
    data.created_at = serverTimestamp();
    data.active = true;
    const docRef = await addDoc(collection(db, "qrcodes"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}
export const getPaginatedQRCode = async (lim, lastDoc) => {
  try {
    console.log(lim)
    let q = query(collection(db, "qrcodes"), orderBy("updated_at"), limit(lim));
    console.log(lastDoc)
    if (lastDoc) q = query(collection(db, "qrcodes"), orderBy("updated_at"), limit(lim), startAfter(lastDoc));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("data from paginated qr's : ", data);
    return { data: data, lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] };
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}
export const profileExists = async (id) => {
  try {
    const docRef = doc(db, "profiles", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error getting document:", error);
    return false;
  }
}
export const getQRCodeIDs = async () => {
  try {
    const docRef = doc(db, "qrids",
      "1"
    );
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
}
export const changeCurrentIDIndex = async (index) => {
  try {
    const docRef = doc(db, "qrids",
      "1"
    );
    updateDoc(docRef, {
      currentIndex: index
    })
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
}

export const createExtraIDs = async (numberOfIds) => {
  try {
    const qrCodesRef = collection(db, "qrcodes");
    const docRef = doc(db, "qrids", "1");
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();

    for (let i = 0; i < numberOfIds; i++) {
      const newId = generateRandomId();
      const dateCreated = new Date().toISOString(); // Get the current date in ISO format
      data.idsAvailable.push({ id: newId, dateCreated }); // Store both id and dateCreated

      // Create corresponding QR code with profile_id as null
      const qrCodeData = {
        qr_id: newId,
        profile_id: null,
        active: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      await addDoc(qrCodesRef, qrCodeData);
    }

    await updateDoc(docRef, {
      idsAvailable: data.idsAvailable,
    });

    return docSnap.data();
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

export const removeUsedID = async (id) => {
  try {
    const docRef = doc(db, "qrids",
      "1"
    );
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    data.idsAvailable = data.idsAvailable.filter((item) => item !== id);
    await updateDoc(docRef, {
      idsAvailable: data.idsAvailable
    })
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}
const generateRandomId = () => {
  // genere random id of 7 characters with numbers and Capital alphabets
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
};