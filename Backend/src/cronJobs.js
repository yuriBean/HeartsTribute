import cron from 'node-cron';
import nodemailer from 'nodemailer';
import firebaseAdmin from 'firebase-admin';
import AWS from 'aws-sdk';

const { firestore } = firebaseAdmin;

// Configure Firebase Admin SDK
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: "https://heartstribute-da3ff.firebaseio.com"
  });
}
const db = firestore();

// Set up Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'eddienorhart53@gmail.com',
    pass: 'a99leb33'
  }
});

// Set up AWS S3 client
const s3 = new AWS.S3({
  endpoint: 's6k7.ph.idrivee2-37.com',
  signatureVersion: 'v4',
  region: 'us-west-2',
  accessKeyId: "LmBXwcDiyu87Qs2P2kZt",
  secretAccessKey: "iYm0qJZYdp1eJ0EKPyQ9r9aW23CUfb1D7msgfvAA"
});

// Function to send email reminders
const sendEmailReminder = async (userEmail, profileId) => {
  const mailOptions = {
    from: 'info@heartstribute.com',
    to: userEmail,
    subject: 'Profile Expiry Reminder',
    text: `Your profile with ID ${profileId} is about to expire. Please activate your tribute tag within 7 days to prevent deletion.`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${userEmail} for profile ${profileId}`);
  } catch (err) {
    console.error(`Error sending email to ${userEmail}:`, err.message);
  }
};

// Scheduled task to check for expired profiles
const scheduleCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    const reminderDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now

    try {
      // Delete expired profiles
      const now = new Date();
      const profilesSnapshot = await db.collection('profiles')
          .where('expiry_date', '<=', now.toISOString())
          .get();
  
      profilesSnapshot.forEach(async (doc) => {
          const profile = doc.data();
          // Delete associated files from iDrive and Firebase
          await deleteProfile(doc.id);
          console.log(`Profile ${doc.id} deleted`);
          // Delete associated files if necessary
        const profilePictureKey = profile.profile_picture.split('/test/')[1];
        const coverPictureKey = profile.cover_picture.split('/test/')[1];

        try {
          await s3.deleteObject({ Bucket: 'test', Key: profilePictureKey }).promise();
          await s3.deleteObject({ Bucket: 'test', Key: coverPictureKey }).promise();
          console.log(`Files deleted: ${profilePictureKey}, ${coverPictureKey}`);
        } catch (err) {
          console.error(`Error deleting files for profile ${doc.id}:`, err.message);
        }

        await db.collection('profiles').doc(doc.id).delete();
        console.log(`Profile ${doc.id} deleted`);
      });

      // Send reminders for profiles expiring in 7 days
      const reminderProfilesSnapshot = await db.collection('profiles')
      .where('expiry_date', '==', reminderDate.toISOString())
      .get();

  reminderProfilesSnapshot.forEach(async (doc) => {
      const profile = doc.data();
      await sendEmailReminder(profile.userEmail, doc.id);
  });

    } catch (err) {
      console.error('Error processing profiles:', err.message);
    }
  });
};

export default scheduleCronJobs;
