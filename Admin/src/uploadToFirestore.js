// const { doc, setDoc, Timestamp } = require('firebase/firestore');
// const { db } = require('./firebase'); // Import the Firestore instance from your firebase.js
// const fs = require('fs');

// // Load the JSON data
// const data = JSON.parse(fs.readFileSync('entries.json', 'utf8'));

// // Function to convert date strings to Firestore Timestamps
// function convertToTimestamp(dateString) {
//   return Timestamp.fromDate(new Date(dateString));
// }

// // Function to upload data to a single document
// async function uploadToFirestore() {
//   // Specify the document ID
//   const documentId = '1';
//   const documentRef = doc(db, 'qrids', documentId); // Replace 'qrcodes' with your collection name

//   // Convert date fields to Timestamps (if necessary, based on your data structure)
//   const convertedData = data.map(entry => ({
//     ...entry  // Assuming `dateCreated` is present
//   }));

//   // Define the new document data
//   const documentData = {
//     currentIndex: 0,
//     idsAvailable: convertedData // This will be an array of entries
//   };

//   try {
//     await setDoc(documentRef, documentData, { merge: true });
//     console.log(`Data has been uploaded under document: ${documentId}`);
//   } catch (error) {
//     console.error(`Error uploading data:`, error);
//   }
// }

// // Execute the upload function
// uploadToFirestore();










const { collection, addDoc } = require('firebase/firestore');
const { db } = require('./firebase'); // Import the Firestore instance from your firebase.js
const fs = require('fs');
const { Timestamp } = require('firebase/firestore'); // Import Timestamp

// Load the JSON data
const data = JSON.parse(fs.readFileSync('entries.json', 'utf8'));

// Function to convert date strings to Firestore Timestamps
function convertToTimestamp(dateString) {
  return Timestamp.fromDate(new Date(dateString));
}

// Function to upload data to Firestore
async function uploadToFirestore() {
  const collectionRef = collection(db, 'qrcodes'); // Replace 'qrcodes' with your collection name
  
  for (const entry of data) {
    // Convert `created_at` and `updated_at` fields to Timestamp
    entry.created_at = convertToTimestamp(entry.created_at);
    entry.updated_at = convertToTimestamp(entry.updated_at);

    try {
      await addDoc(collectionRef, entry);
      console.log(`Uploaded: ${entry.id}`);
    } catch (error) {
      console.error(`Error uploading ${entry.id}:`, error);
    }
  }

  console.log('All entries have been uploaded.');
}

// Execute the upload function
uploadToFirestore();
