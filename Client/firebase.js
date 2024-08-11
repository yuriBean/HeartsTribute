import { initializeApp } from "firebase/app";
import {getAuth , connectAuthEmulator} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDk08baYEyamSSEvcX4a-f68kBnCcbsX5s",
  authDomain: "heartstribute-da3ff.firebaseapp.com",
  projectId: "heartstribute-da3ff",
  storageBucket: "heartstribute-da3ff.appspot.com",
  messagingSenderId: "363617177332",
  appId: "1:363617177332:web:ae52b463ec9247f7b158a1",
  measurementId: "G-YSRDWP7QY6",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth , db, storage};