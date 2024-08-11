import { collection, query, getDocs, where, orderBy, limit, startAfter, limitToLast, endBefore, deleteDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


export const getPaginatedProfileManagers = async (size = 10, direction = "next", lastDoc = null, firstDoc = null, username = null, email = null) => {
  try {
    let dataquery = query(
      collection(db, 'users'),
      orderBy("updated_at", "desc"),
      limit(size)
    );
    if (direction == "next" && lastDoc) {
      dataquery = query(dataquery, startAfter(lastDoc));
    }
    if (direction == "previous" && firstDoc) {
      dataquery = query(dataquery, limitToLast(size), endBefore(firstDoc));
    }

    if (username) {
      dataquery = query(dataquery, where("username", "==", username));
    }

    if (email) {
      dataquery = query(dataquery, where("email", "==", email));
    }

    const snapshot = await getDocs(dataquery);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const last = snapshot.docs[size - 1];
    const first = snapshot.docs[0];
    return { data, last, first };
  } catch (error) {
    console.error("Error getting discover data:", error);
    return { data: [], last: null, first: null };
  }
}
export const getPaginatedMedallionProfiles = async (size = 10, direction = "next", lastDoc = null, firstDoc = null, user_id = null) => {
  try {
    let dataquery = query(
      collection(db, 'profiles'),
      orderBy("updated_at", "desc"),
      limit(size)
    );
    if (direction == "next" && lastDoc) {
      dataquery = query(dataquery, startAfter(lastDoc));
    }
    if (direction == "previous" && firstDoc) {
      dataquery = query(dataquery, limitToLast(size), endBefore(firstDoc));
    }

    if (user_id) {
      dataquery = query(dataquery, where("user_id", "==", user_id));
    }


    const snapshot = await getDocs(dataquery);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const last = snapshot.docs[size - 1];
    const first = snapshot.docs[0];
    const qrCodesQuery = query(
      collection(db, 'qrcodes'),
      where("profile_id", "in", data.map(profile => profile.id)) // Adjust based on your data structure
    );

    const qrCodesSnapshot = await getDocs(qrCodesQuery);
    const qrCodes = qrCodesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { data, last, first, qrCodes }; // Return QR codes along with profiles
  } catch (error) {
    console.error("Error getting discover data:", error);
    return { data: [], last: null, first: null, qrCodes: [] }; // Return empty QR codes on error
  }
}
export const getPaginatedQRCodes = async (size = 10, direction = "next", lastDoc = null, firstDoc = null, profile_id = null) => {
  try {
    let dataquery = query(
      collection(db, 'qrcodes'),
      orderBy("updated_at", "desc"),
      limit(size)
    );
    if (direction == "next" && lastDoc) {
      dataquery = query(dataquery, startAfter(lastDoc));
    }
    if (direction == "previous" && firstDoc) {
      dataquery = query(dataquery, limitToLast(size), endBefore(firstDoc));
    }
    console.log(profile_id)
    if (profile_id) {
      dataquery = query(dataquery, where("profile_id", "==", profile_id));
    }


    const snapshot = await getDocs(dataquery);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const last = snapshot.docs[size - 1];
    const first = snapshot.docs[0];
    return { data, last, first };
  } catch (error) {
    console.error("Error getting discover data:", error);
    return { data: [], last: null, first: null };
  }
}
export const deleteProfileManager = async (id) => {
  try {
    const docRef = doc(db, 'users', id);
    const dataquery = query(
      collection(db, 'profiles'),
      where("user_id", "==", id)
    );
    const snapshot = await getDocs(dataquery);
    snapshot.docs.map(async (doc) => {
      await deleteMedallionProfile(doc.id);
    }
    );
    deleteAssociatedDataWithUser(id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting profile manager:", error);
    return false;
  }
}
export const deleteQrCode = async (id) => {
  try {
    const docRef = doc(db, 'qrcodes', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting qr code:", error);
    return false;
  }
}
export const updateQrCode = async (id, profile_id) => {
  try {
    const docRef = doc(db, 'qrcodes', id);
    const res = await updateDoc(docRef, {
      profile_id: profile_id,
    });
    return true;
  } catch (error) {
    console.error("Error updating qr code:", error);
    return false;
  }
}
export const getProfileWithId = async (id) => {
  try {
    const docRef = doc(db, "profiles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = { ...docSnap.data(), id: docSnap.id };
      return data;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}
export const deleteMedallionProfile = async (id) => {
  try {
    const docRef = doc(db, 'profiles', id);
    // all the posts where user_id = id

    deleteAssociatedDataWithProfile(id);

    console.log(docRef);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting profile manager:", error);
    return false;
  }
}
export const changeQRStatus = async (id, status) => {
  try {
    const docRef = doc(db, 'qrcodes', id);
    const res = await updateDoc(docRef, {
      active: status
    });
    return true;
  } catch (error) {
    console.error("Error changing qr status:", error);
    return false;
  }
}
const deleteAssociatedDataWithProfile = async (id) => {
  try {
    const dataquery = query(
      collection(db, 'posts'),
      where("profile_id", "==", id)
    );
    // delete all the posts
    const snapshot = await getDocs(dataquery);
    snapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
    // delte all events with profile_id id
    const eventquery = query(
      collection(db, 'events'),
      where("profile_id", "==", id)
    );
    const eventSnapshot = await getDocs(eventquery);
    eventSnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
    // delete all tributes with profile_id
    const tributequery = query(
      collection(db, 'tributes'),
      where("profile_id", "==", id)
    );
    const tributeSnapshot = await getDocs(tributequery);
    tributeSnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
    // qrcodes with profile_id
    const qrcodequery = query(
      collection(db, 'qrcodes'),
      where("profile_id", "==", id)
    );
    const qrcodeSnapshot = await getDocs(qrcodequery);
  } catch (error) {
    console.log(error)
  }
}
const deleteAssociatedDataWithUser = async (id) => {
  try {
    // tributes where user_id = id
    const tributequery = query(
      collection(db, 'tributes'),
      where("user_id", "==", id)
    );
    const tributeSnapshot = await getDocs(tributequery);
    tributeSnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.log();
  }
}

export const editProfileWithId = async (id, data) => {
  try {
    const docRef = doc(db, "profiles", id);
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

export const exportCSVData = async (qrids) => {
  try {
      // Create CSV content
      const csvRows = [];
      const headers = ['QR ID', 'Date Created']; // Adjust headers based on your data structure
      csvRows.push(headers.join(',')); // Add headers to CSV

      qrids.forEach(qr => {
          const row = [qr.id, qr.dateCreated || '']; // Adjust based on your QR ID structure
          csvRows.push(row.join(','));
      });

      const csvString = csvRows.join('\n');
      const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      return csvBlob;
  } catch (error) {
      console.error("Error generating CSV data:", error);
      throw new Error("Failed to generate CSV data");
  }
};
// Add this function to your admin.service.js
export const getQRCodeIDs = async () => {
  try {
      const dataquery = query(
          collection(db, 'qrcodes'),
          where("active", "==", true)  // Adjust the query based on your requirements
      );
      const snapshot = await getDocs(dataquery);
      const idsAvailable = snapshot.docs.map(doc => doc.id);
      return { idsAvailable };
  } catch (error) {
      console.error("Error fetching QR codes:", error);
      throw new Error("Failed to fetch QR codes");
  }
};


export const getProfiles = async () => {
  try {
    const dataquery = query(collection(db, 'profiles')); // Adjust the collection name if necessary
    const snapshot = await getDocs(dataquery);
    const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Get profile IDs and data
    return profiles; // Return the array of profiles
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return []; // Return an empty array on error
  }
}