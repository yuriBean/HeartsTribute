import { collection, addDoc, doc, getDoc, arrayUnion, arrayRemove, updateDoc, query, getDocs, where, serverTimestamp, orderBy, limit, deleteDoc, startAfter } from "firebase/firestore";
import { db, storage } from "../../firebase";
import removeUserId from "../utils/removeUserId";
import { ref, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { deleteField } from "firebase/firestore";

const CreateNewProfile = async (data) => {
    try {
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days from now
        data.expiry_date = expiryDate.toISOString();
        data.created_at = serverTimestamp();
        data.updated_at = serverTimestamp();
        const dbref = await addDoc(collection(db, "profiles"), data);
        console.log("Document written with ID: ", dbref.id);
        return dbref;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}
const getProfilesWithUserId = async (user_id) => {
    try {
        // get all fields except user_id
        const q = query(collection(db, "profiles"), where("user_id", "==", user_id), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map(doc => removeUserId({ ...doc.data(), id: doc.id }));
        return profiles;
    } catch (error) {
        console.error("Error getting document:", error);
    }
}
const getProfileWithId = async (id) => {
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
const getProfileWithIdAndUserId = async (id, user_id) => {
    try {
        const docRef = doc(db, "profiles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = { ...docSnap.data(), id: docSnap.id };
            if (data.user_id === user_id) {
                return removeUserId(data);
            } else {
                return null;
            }
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}
const editProfileWithId = async (id, data) => {
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
const createPost = async (data) => {
    try {
        console.log("Data from CreatePost form", data)
        data.created_at = serverTimestamp();
        data.updated_at = serverTimestamp();
        data.likes = 0;
        const dbref = await addDoc(collection(db, "posts"), data);
        console.log("Document written with ID: ", dbref.id);
        return dbref;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}
const getPostsWithProfileId = async (profile_id) => {
    try {
        // profile_id is a specific field in the posts collection
        const q = query(collection(db, "posts"), where("profile_id", "==", profile_id), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return posts;
    } catch (error) {
        console.error("Error getting document:", error);
    }
}
const getPostsWithUserId = async (user_id) => {
    try {
        // profile_id is a specific field in the posts collection
        const q = query(collection(db, "posts"), where("user_id", "==", user_id), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return posts;
    } catch (error) {
        console.error("Error getting document:", error);
    }
}
const addEvent = async (data) => {
    try {
        data.created_at = serverTimestamp();
        data.updated_at = serverTimestamp();
        const dbref = await addDoc(collection(db, "events"),
            data
        );
        console.log("Event Document written with ID: ", dbref.id);

        return dbref;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}
const getEventsByProfileId = async (id) => {
    const eventsRef = collection(db, "events");
    try {
        const q = query(eventsRef, where("profile_id", "==", id), orderBy("event_date", "asc"));
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log(events); 
        return events;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return []
    }
}
const AddNewTribute = async (data) => {
    try {
        data.created_at = serverTimestamp();
        data.updated_at = serverTimestamp();
        data.created_by = data.created_by;
        const dbref = await addDoc(collection(db, "tributes"),
            data
        );
        console.log("Tribute Document written with ID: ", dbref.id);

        return dbref;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}
const GetTributesById = async (id) => {
    const tributesRef = collection(db, "tributes");
    try {
        const q = query(tributesRef, where("profile_id", "==", id), orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);
        const tributes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log(events); 
        return tributes;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return []
    }
}
const addFavoriteWithUserId = async (user_id, profile_id) => {
    try {
        console.log("User ID: from add favorite ", user_id)
        console.log("Profile ID: from add favorite ", profile_id)
        const userRef = doc(db, "users", user_id);
        // get user document
        const userDoc = await getDoc(userRef);
        // if favorite_profiles field exists
        if (userDoc.data().favorite_profiles) {
            // add profile_id to favorite_profiles with arrayUnion
            const res = await updateDoc(userRef, {
                favorite_profiles: arrayUnion(profile_id),
                updated_at: serverTimestamp()

            });
            console.log("Result from favorite : ", res);
        } else {
            // create favorite_profiles field
            await updateDoc(userRef, {
                favorite_profiles: [profile_id]
            });
        }

    } catch (error) {
        console.log("Error adding favorite: ", error)
    }
};
const removeFavoriteWithUserId = async (user_id, profile_id) => {
    try {
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
        await updateDoc(userRef, {
            favorite_profiles: arrayRemove(profile_id)
        });
    } catch (error) {
        console.log(error)
    }
}
const getFavoriteProfilesWithUserId = async (user_id) => {
    try {
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const favoriteProfileIds = userData.favorite_profiles || [];
            const favoriteProfiles = await Promise.all(
                favoriteProfileIds.map(async (profileId) => {
                    const profileRef = doc(db, "profiles", profileId);
                    const profileDoc = await getDoc(profileRef);
                    return profileDoc.exists() ? { ...profileDoc.data(), id: profileDoc.id } : null;
                })
            );

            return favoriteProfiles.filter(profile => profile !== null);
        } else {
            console.log("User document does not exist.");
            return [];
        }
    } catch (error) {
        console.log("Error fetching favorite profiles: ", error);
        return [];
    }
};
const addLikeWithUserId = async (user_id, post_id) => {
    try {
        console.log("User ID: from add favorite ", user_id)
        console.log("Profile ID: from add favorite ", post_id)
        // increment likes in post doc
        const userRef = doc(db, "users", user_id);
        // get user document
        const userDoc = await getDoc(userRef);
        // if favorite_profiles field exists
        if (userDoc.data().liked_posts) {
            // add post_id to favorite_profiles with arrayUnion
            const res = await updateDoc(userRef, {
                liked_posts: arrayUnion(post_id),
                updated_at: serverTimestamp()
            });
            console.log("Result from favorite : ", res);
        } else {
            // create liked_posts field
            await updateDoc(userRef, {
                liked_posts: [post_id],
                updated_at: serverTimestamp()
            });
        }
        const postRef = doc(db, "posts", post_id);
        const postDoc = await getDoc(postRef);
        // check if likes not present than add likes field
        if (!postDoc.data().likes) {
            await updateDoc(postRef, {
                likes: 1
            });
        }
        else {
            const postLikes = postDoc.data().likes;
            await updateDoc(postRef, {
                likes: postLikes + 1
            });
        }

    } catch (error) {
        console.log("Error adding favorite: ", error)
    }
};
const removeLikeWithUserId = async (user_id, post_id) => {
    try {
        const userRef = doc(db, "users", user_id);
        const userDoc = await getDoc(userRef);
        const postRef = doc(db, "posts", post_id);
        const postDoc = await getDoc(postRef);
        const postLikes = postDoc.data().likes;
        if (postLikes === 0) {
            return;
        }
        await updateDoc(userRef, {
            liked_posts: arrayRemove(post_id),
            updated_at: serverTimestamp()
        });
        await updateDoc(postRef, {
            likes: postLikes - 1
        });
    } catch (error) {
        console.log(error)
    }
}
const AddCommentToPost = async (data, post_id) => {
    try {
        data.created_at = serverTimestamp();
        const postRef = doc(db, 'posts', post_id);
        const commentRef = await addDoc(collection(postRef, 'comments'), data);
        console.log('Comment added with ID: ', commentRef.id);
        return commentRef;
    } catch (error) {
        console.error('Error adding comment: ', error);
    }
};
const deleteComment = async (post_id, comment_id, user_id) => {
    try {
        console.log(post_id)
        const postRef = doc(db, 'posts', post_id);
        const commentRef = doc(postRef, 'comments', comment_id);
        const commentDoc = await getDoc(commentRef);
        // console.log(commentDoc.data());
        if (commentDoc.data().user_id === user_id) {
            await deleteDoc(commentRef);
        } else {
            console.log("You are not authorized to delete this comment");
        }
    } catch (error) {
        console.log(error)
    }
}
const getCommentsWithPostId = async (post_id) => {
    try {
        const postRef = doc(db, 'posts', post_id);
        const q = query(collection(postRef, 'comments'));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return comments;
    } catch (error) {
        console.error('Error getting comments:', error);
    }
};
const getDiscoverProfiles = async (startAfterDoc) => {
    try {
        console.log("Getting discover profiles:", startAfterDoc);

        // Define the base query
        let profilesQuery = query(
            collection(db, 'profiles'),
            where("visibility", "==", true),
            orderBy("updated_at", "desc"),
            limit(3)
        );
        if (startAfterDoc) {
            profilesQuery = query(
                collection(db, 'profiles'),
                where("visibility", "==", true),
                orderBy("updated_at", "desc"),
                limit(3),
                startAfter(startAfterDoc)
            );
        }
        const profilesSnapshot = await getDocs(profilesQuery);
        const profiles = profilesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        // Return profiles and the last document
        return { profiles, lastDoc: profilesSnapshot.docs[profilesSnapshot.docs.length - 1] };
    } catch (error) {
        console.error('Error getting discover profiles:', error);
        return { profiles: [], lastDoc: null }; // Return an empty array or handle the error as needed
    }
};
// function that adds a email to field called requestedUsers in a profile document, if the requestedUsers field does not exist it creates it
const addRequestedUserToProfile = async (profile_id, email) => {
    try {
        const profileRef = doc(db, "profiles", profile_id);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
            if (profileDoc.data().requestedUsers) {
                await updateDoc(profileRef, {
                    requestedUsers: arrayUnion(email)
                });
            } else {
                await updateDoc(profileRef, {
                    requestedUsers: [email]
                });
            }
        }
    } catch (error) {
        console.error("Error adding requested user to profile:", error);
    }
}
const removeAllowedUserFromProfile = async (profile_id, email) => {
    try {
        const profileRef = doc(db, "profiles", profile_id);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
            if (profileDoc.data().allowedUsers) {
                await updateDoc(profileRef, {
                    allowedUsers: arrayRemove(email)
                });
            }
        }
    } catch (error) {
        console.error("Error removing requested user from profile:", error);
    }
}
// function that removes a email to field called requestedUsers in a profile document
const removeRequestedUserFromProfile = async (profile_id, email) => {
    try {
        const profileRef = doc(db, "profiles", profile_id);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
            if (profileDoc.data().requestedUsers) {
                await updateDoc(profileRef, {
                    requestedUsers: arrayRemove(email)
                });
            }
        }
    } catch (error) {
        console.error("Error removing requested user from profile:", error);
    }
}

// function that adds a email to field called allowedUsers in a profile document, if the allowedUsers field does not exist it creates it, remove user from requestedUsers
const addAllowedUserToProfile = async (profile_id, email) => {
    try {
        const profileRef = doc(db, "profiles", profile_id);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
            if (profileDoc.data().allowedUsers) {
                await updateDoc(profileRef, {
                    allowedUsers: arrayUnion(email)
                });
            } else {
                await updateDoc(profileRef, {
                    allowedUsers: [email]
                });
            }
            if (profileDoc.data().requestedUsers) {
                await updateDoc(profileRef, {
                    requestedUsers: arrayRemove(email)
                });
            }
        }

    } catch (error) {
        console.error("Error adding allowed user to profile:", error);
    }
}

const deleteProfile = async (profile_id) => {
    try {
        const profileRef = doc(db, "profiles", profile_id);
        await deleteDoc(profileRef);
        console.log("Profile deleted with ID: ", profile_id);
    } catch (error) {
        console.error("Error deleting profile: ", error);
    }
};

// Delete a single post
const deletePost = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            // Delete associated comments
            await deleteCommentsByPostId(postId);
            await deleteDoc(postRef);
            console.log("Post deleted with ID: ", postId);
        }
    } catch (error) {
        console.error("Error deleting post:", error);
    }
};

const deleteCommentsByPostId = async (postId) => {
    try {
        const commentsRef = collection(db, "posts", postId, "comments");
        const querySnapshot = await getDocs(commentsRef);
        const deletePromises = querySnapshot.docs.map(doc => deleteComment(postId, doc.id));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error deleting comments:", error);
    }
};


// Delete all posts associated with a profile
const deletePostsByProfileId = async (profileId) => {
    try {
        const postsQuery = query(collection(db, "posts"), where("profile_id", "==", profileId));
        const querySnapshot = await getDocs(postsQuery);
        
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises); // Wait for all deletions to complete
    } catch (error) {
        console.error("Error deleting posts:", error);
        throw new Error("Failed to delete posts");
    }
};

const deleteTribute = async (tributeId) => {
    try {
        const tributeRef = doc(db, "tributes", tributeId);
        const tributeDoc = await getDoc(tributeRef);
        if (tributeDoc.exists()) {
            const tributeData = tributeDoc.data();
            const imagePath = tributeData.imagePath; // Assuming imagePath is the field storing the image path

            // Delete the image from Firebase Storage
            if (imagePath) {
                const imageRef = ref(storage, imagePath);
                await deleteObject(imageRef);
                console.log(`Image deleted successfully: ${imagePath}`);
            }

            // Delete the tribute document
            await deleteDoc(tributeRef);
            console.log("Tribute deleted with ID: ", tributeId);
        } else {
            console.log("No such tribute document!");
        }
    } catch (error) {
        console.error("Error deleting tribute:", error);
    }
};

// Function to delete an event and its associated photos
const deleteEvent = async (eventId) => {
    try {
        const eventRef = doc(db, "events", eventId);
        const eventDoc = await getDoc(eventRef);
        if (eventDoc.exists()) {
            // Delete associated photos
            const photoPath = eventDoc.data().photoPath; // Assuming you store the photo path
            if (photoPath) {
                const photoRef = ref(storage, photoPath);
                await deleteObject(photoRef);
            }
            await deleteDoc(eventRef);
            console.log("Event deleted with ID: ", eventId);
        }
    } catch (error) {
        console.error("Error deleting event:", error);
    }
};

const resetProfilePhoto = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    try {
        await updateDoc(userDocRef, {
            profilePhotoPath: "./cover-placeholder.jpeg", // Reset to placeholder
            profilePhotoURL: "./cover-placeholder.jpeg" // Set to placeholder URL
        });
        console.log("Profile photo reset to placeholder for user:", userId);
    } catch (error) {
        console.error("Error resetting profile photo:", error);
    }
};

// Function to reset cover photo
const resetCoverPhoto = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    try {
        await updateDoc(userDocRef, {
            coverPhotoPath: "", // Reset to placeholder
            coverPhotoURL: "placeholder_url" // Set to placeholder URL
        });
        console.log("Cover photo reset to placeholder for user:", userId);
    } catch (error) {
        console.error("Error resetting cover photo:", error);
    }
};

const deleteFirestoreDocument = async (collection, docID) => {
    try {
      await deleteDoc(doc(db, collection, docID));
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  };
  
  // Function to delete a file from iDrive
  const deleteFileFromStorage = async (filePath) => {
    const fileRef = ref(storage, filePath);
    try {
      await deleteObject(fileRef);
      console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  };
  
  // Function to delete profile photo or cover photo
  const deleteProfilePhoto = async (userID, type) => {
    const userDocRef = doc(db, "users", userID);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const filePath = type === "profile" ? userData.profilePhotoPath : userData.coverPhotoPath;
        const idriveKey = `ProfileManager/${userID}/${type === "profile" ? "profile" : "cover"}`;
        await deleteFileFromStorage(filePath);

        const response = await fetch(`https://api.heartstribute.com/api/deleteProfile/${userID}/${type}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: idriveKey })
          });
    
          if (!response.ok) {
            throw new Error(`Failed to delete ${type} photo from IDrive Cloud`);
          }
    
        const updateData = type === "profile" ? 
        { profilePhotoPath: "", profilePhotoURL: "placeholder_url" } : { coverPhotoPath: "", coverPhotoURL: "placeholder_url" };
        await updateDoc(userDocRef, updateData);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
        console.log(`Failed to delete ${type} photo: ${error.message}`);
      throw new Error(`Failed to delete ${type} photo: ${error.message}`);
    }
  };  

  const deleteProfileQR = async (profileId) => {
    try {
        const qrcodesCollectionRef = collection(db, "qrcodes");
        const q = query(qrcodesCollectionRef, where("profile_id", "==", profileId));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    profile_id: null,
                });
                console.log(`Profile ID ${profileId} has been unlinked from QR code.`);
            });
        } else {
            console.log("QR code document not found.");
        }
    } catch (error) {
        throw new Error(`Failed to delete id from qrcodes: ${error.message}`);
    }
};

const deleteProfileFromIDrive = async (userId, profileId) => {
    try {
      const response = await fetch(`https://api.heartstribute.com/api/deleteProfile/${userId}/${profileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error(`Failed to delete profile from IDrive Cloud: ${error.message}`);
    }
  };
  

const requestAccess = async (profileId) => {
    const userEmail = JSON.parse(localStorage.getItem("user")).email; 
    if (!userEmail) {
        console.error("User email not found in local storage.");
        throw new Error("User email not found.");
    }

    const profileRef = doc(db, "profiles", profileId);

    try {
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
            await updateDoc(profileRef, {
                requestedUsers: arrayUnion(userEmail) // Add the user's email to the requestedUsers array
            });
            console.log("Access request sent successfully for profile:", profileId);
        } else {
            console.error("Profile does not exist:", profileId);
            throw new Error("Profile does not exist");
        }
    } catch (error) {
        console.error("Error requesting access:", error);
        throw new Error("Failed to request access");
    }
};

const getUserProfiles = async (userId) => {
    try {
        const q = query(collection(db, "profiles"), where("user_id", "==", userId));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return profiles;
    } catch (error) {
        console.error("Error fetching user profiles:", error);
        throw new Error("Failed to fetch user profiles");
    }
};

const linkProfileToQR = async (profileId, qrid) => {
    try {
        console.log(`Attempting to link profile ${profileId} to QR code ${qrid}`);

        const qrCodesRef = collection(db, "qrcodes");
        const q = query(qrCodesRef, where("qr_id", "==", qrid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error(`No QR code found with ID ${qrid}`);
        }

        const qrCodeDoc = querySnapshot.docs[0];
        if (!qrCodeDoc) {
            throw new Error(`No QR code document found for ID ${qrid}`);
        }

        const qrCodeData = qrCodeDoc.data();
        if (!qrCodeData) {
            throw new Error(`No data found for QR code document with ID ${qrid}`);
        }

        if (qrCodeData.profile_id) {
            throw new Error(`QR code ${qrid} is already linked to profile ID ${qrCodeData.profile_id}`);
        }

        const profileQuery = query(qrCodesRef, where("profile_id", "==", profileId));
        const profileQuerySnapshot = await getDocs(profileQuery);
        if (!profileQuerySnapshot.empty) {
            throw new Error(`Profile ID ${profileId} is already linked to another QR code.`);
        }

        const profileRef = doc(db, "profiles", profileId);
        const profileDoc = await getDoc(profileRef);
        if (!profileDoc.exists()) {
            throw new Error(`Profile with ID ${profileId} does not exist.`);
        }
        const profileData = profileDoc.data();
        const profileVisibility = profileData.visibility;

        const qrCodeRef = doc(db, "qrcodes", qrCodeDoc.id);
        await updateDoc(qrCodeRef, {
            profile_id: profileId,
            profile_visibility: profileVisibility,
            updated_at: serverTimestamp(),
            active: true,
        });

        await updateDoc(profileRef, { expiry_date: null });

        console.log(`Profile ${profileId} linked to QR code ${qrid}`);
    } catch (error) {
        console.error("Error linking profile to QR code:", error);
        throw new Error("Failed to link profile to QR code");
    }
};

const createQRCode = async (profileId, qrid) => {
    try {
      const qrCodesRef = collection(db, "qrcodes");
  
      // Check if the profileId or qrid already exists in the collection
      const profileIdQuery = query(qrCodesRef, where("profile_id", "==", profileId));
      const qridQuery = query(qrCodesRef, where("qr_id", "==", qrid));
  
      const [profileIdSnapshot, qridSnapshot] = await Promise.all([
        getDocs(profileIdQuery),
        getDocs(qridQuery),
      ]);
  
      if (!profileIdSnapshot.empty) {
        throw new Error(`Profile ID ${profileId} already exists.`);
      }
  
      if (!qridSnapshot.empty) {
        throw new Error(`QR ID ${qrid} already exists.`);
      }
  
      const data = {
        profile_id: profileId,
        qr_id: qrid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
  
      const docRef = await addDoc(qrCodesRef, data);

      const profileRef = doc(db, "profiles", profileId); // Adjust the path according to your collection structure
      await updateDoc(profileRef, { expiry_date: null });

      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  };
    

const checkUserProfiles = async (userId) => {
    try {
        const profilesRef = collection(db, "profiles");
        const q = query(profilesRef, where("user_id", "==", userId));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return profiles; // Return the profiles found
    } catch (error) {
        console.error("Error checking user profiles:", error);
        throw new Error("Failed to check user profiles");
    }
};

const getLoggedInUser = () => {
    const auth = getAuth();
    return auth.currentUser; // Returns the currently logged-in user
};

const getQRIdsForProfiles = async (profileIds) => {
    try {
        const qrCodesRef = collection(db, "qrcodes");
        const q = query(qrCodesRef, where("profile_id", "in", profileIds));
        const querySnapshot = await getDocs(q);
        const qrIds = querySnapshot.docs.map(doc => doc.data().profile_id);
        return qrIds;
    } catch (error) {
        console.error("Error fetching QR IDs for profiles:", error);
        return [];
    }
};

const deleteSignUpQR = async (userId) => {
    try {
        const qrCodesRef = collection(db, "users");
        console.log("Deleting QR for user:", userId);
        const q = query(qrCodesRef, where("uid", "==", userId));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
            await updateDoc(doc.ref, {
              qrid: deleteField(), // Correctly delete the `qrid` field
            });
            console.log(`QR ID has been removed from document ID ${doc.id}`);
          }
        } else {
          console.log("No documents found for the given userId.");
        }
      } catch (error) {
        console.error("Error deleting QR IDs for profiles:", error);
      }
    }

//export { CreateNewProfile, createPost, getProfileWithId, editProfileWithId, getPostsWithProfileId, addEvent, getEventsByProfileId, AddNewTribute, GetTributesById, getPostsWithUserId, getProfilesWithUserId, getProfileWithIdAndUserId, AddCommentToPost, getCommentsWithPostId, getDiscoverProfiles}
export { deleteProfileFromIDrive, deleteSignUpQR, deleteProfileQR, getQRIdsForProfiles,  createQRCode, deletePost, getLoggedInUser, checkUserProfiles, getUserProfiles, linkProfileToQR, CreateNewProfile, createPost, getProfileWithId, editProfileWithId, getPostsWithProfileId, addEvent, getEventsByProfileId, AddNewTribute, GetTributesById, getPostsWithUserId, getProfilesWithUserId, getProfileWithIdAndUserId, addFavoriteWithUserId, removeFavoriteWithUserId, getFavoriteProfilesWithUserId, addLikeWithUserId, removeLikeWithUserId, AddCommentToPost, getCommentsWithPostId, getDiscoverProfiles, deleteComment, addRequestedUserToProfile, addAllowedUserToProfile, removeAllowedUserFromProfile, removeRequestedUserFromProfile, deleteProfile, deletePostsByProfileId, deleteProfilePhoto, deleteFirestoreDocument, requestAccess, deleteTribute, deleteEvent, resetProfilePhoto, resetCoverPhoto, deleteFileFromStorage }

