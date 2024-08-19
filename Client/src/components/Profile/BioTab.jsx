import React from "react";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import Spinner from "../Common/Spinner";
import { notifySuccess, notifyError } from "../../utils/toastNotifications";
import { formatDate } from "../../utils/dateToNow";
import CheckProfileOwner from "../CheckProfileOwner";
import { useNavigate } from "react-router-dom";
import { deleteProfileQR, deletePostsByProfileId, deleteFirestoreDocument, deleteFileFromStorage } from "../../services/profileManager.service";

export default function BioTab() {
  const { profile, loading } = usePublicProfile();
  const navigate = useNavigate();
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile?.name}'s Profile`,
          text: profile?.bio,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // copy the link to clipboard
      navigator.clipboard.writeText(window.location.href);
      notifySuccess("Link copied to clipboard");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      try {
        // Delete associated posts
        await deletePostsByProfileId(profile.id);

        // Delete profile picture and cover picture from storage
        if (profile?.profile_picture) {
          console.log("Deleting profile picture:", profile.profile_picture); // Log the path
          await deleteFileFromStorage(profile.profile_picture);
        }
        if (profile?.cover_picture) {
          console.log("Deleting cover picture:", profile.cover_picture); // Log the path
          await deleteFileFromStorage(profile.cover_picture);
        }

        // Delete the profile document from Firestore
        await deleteFirestoreDocument("profiles", profile.id);
        console.log(profile.id);
        await deleteProfileQR(profile.id);
        notifySuccess("Profile deleted successfully");
        // Optionally, redirect or update the UI after deletion
        navigate("/"); // Redirect to home or another page
      } catch (error) {
        notifyError(`Failed to delete profile: ${error.message}`);
      }
    }
  };

  const daysLeft = profile ? Math.ceil((new Date(profile.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;


  return !loading ? (
    <div>
      
        <div className="flex justify-end">
        {profile?.memorial_video && (
            <a
              href={profile?.memorial_video}
              target="_blank"
              rel="noreferrer"
              className="bg-primary my-2 text-white px-4 py-2 rounded-lg flex gap-2 mx-"
            >
              <span>Memorial Video</span>
            </a>
        )}
        <button
          onClick={handleShare}
          className="bg-primary my-2 text-white px-4 py-2 rounded-lg flex gap-2 mx-2"
          style={{ justifyContent: 'center', alignItems: 'center'}}
        >
          <img className="w-2 md:w-4" src="/images/share.svg" alt="" />
          <span>Share</span>
        </button>
        <CheckProfileOwner>
          <button
            onClick={() => navigate(`/edit-profile/${profile.id}`)}
            className="bg-primary my-2 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
          <button
          onClick={handleDelete}
          className="bg-red-600 my-2 text-white px-4 py-2 rounded-lg mx-2"
        >
          Delete Profile
          </button>
          </CheckProfileOwner>
        </div>
      
      {/* <h2 className="my-8 text-sm font-medium tracking-wider ">
        <small className="text-xl md:text-2xl">In Loving Memory of:</small>
        <span className="uppercase text-lg">
          {" "}
          {profile?.first_name + " " + profile?.last_name}{" "}
        </span>
      </h2> */}

      {/* section to show city, state, funeral_date, cemetery_location add check that if values undefined show None */}

        {/* link to memorial_video if it exists */}
        {/* <div className="flex flex-col gap-2">
          {profile.profile_type == "human" && (
            <>
              {profile?.hobbies &&
              (<div className="flex items-center gap-4 mt-5">
                <p className="text-lg ">
                  <small className="text-xl font-bold md:text-xl ">Hobbies: </small>
                  {profile?.hobbies || "N/A"}
                </p>
              </div>)}
              {profile?.nickname && (
              <div className="flex items-center gap-4">
                <p className="text-lg ">
                  <small className="text-xl font-bold md:text-xl">Nicknames: </small>
                  {profile?.nickname || "N/A"}
                </p>
              </div>)}
              {profile?.city && (
              <div className="flex items-center gap-4">
                <small className="text-xl font-bold md:text-xl">Location: </small>
                <p className="text-lg">
                  {profile?.city}, {profile?.state}
                </p>
              </div>)}
              {profile?.funeral_date && (
              <div className="flex items-center gap-4">
                <p className="text-lg ">
                  <small className="text-xl font-bold md:text-xl">Funeral Date: </small>
                  {formatDate(profile?.funeral_date) || "N/A"}
                </p>
              </div>)}
              {profile?.cemetery_location && (
              <div className="flex items-center gap-4">
                <p className="text-lg">
                  <small className="text-xl font-bold md:text-xl">
                    Cemetery Location:{" "}
                  </small>
                  {profile?.cemetery_location || "N/A"}
                </p>
              </div>)}
            </>
          )} 
           {profile.profile_type == "pet" && (
            <>
            {profile?.favorite_treats && (
              <div className="flex items-center gap-4 mt-5">
                <p className="text-lg">
                  <small className="text-xl font-bold md:text-xl">
                    Favorite Tricks & treats:{" "}
                  </small>
                  {profile?.favorite_treats || "N/A"}
                </p>
              </div>)}
              {profile?.favorite_places && (
              <div className="flex items-center gap-4">
                <p className="text-lg">
                  <small className="text-xl font-bold md:text-xl">
                    Favorite Places:{" "}
                  </small>
                  {profile?.favorite_places || "N/A"}
                </p>
              </div>)}
            </>
          )}
        </div> */}

<CheckProfileOwner>
      {profile.expiry_date && (
      <div className="self-end bg-[#FAFAFA] py-5 my-10 rounded-md text-gray-700">
      <p className="self-end bg-[#FAFAFA] text-xs sm:text-sm py-1 rounded-md align-end">
              Days left until deletion: {daysLeft}
            </p>
            <p className="self-end bg-[#FAFAFA] text-xs sm:text-sm py-1 rounded-md align-end">
              Expiry Date: 
              <span className="text-red-600 font-bold">{new Date(profile.expiry_date).toLocaleDateString()}</span>
            </p>
      </div>
      )}
    </CheckProfileOwner>


      <div className="flex justify-between items-center ">
        <p className="self-end bg-[#FAFAFA] py-4 text-lg rounded-md">
          Lifetime: {formatDate(profile?.birth_date)} -{" "}
          <strong className="text-red-600">
            {formatDate(profile?.death_date)}
          </strong>
        </p>
      
      </div>

      <div className="self-end bg-[#FAFAFA] py-3 mt-5 text-md rounded-md text-gray-700">
        {profile?.bio}
      </div>
    </div>
  ) : (
    <Spinner />
  );
}
