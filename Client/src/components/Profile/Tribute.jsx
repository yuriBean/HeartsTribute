import React from "react";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import { deleteTribute } from "../../services/profileManager.service"; // Import deleteTribute

export default function Tribute({ tribute, onDelete }) {
  const { profile } = usePublicProfile();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleDeleteTribute = async () => {
    try {
      await deleteTribute(tribute.id);
      onDelete(); // Call the onDelete prop to refresh the tributes list
    } catch (error) {
      console.error("Error deleting tribute:", error);
    }
  };

  const canDelete = user.email === tribute.email || user.id === profile.user_id;

  return (
    <div
      id="tribute"
      className="pb-1 pt-4 px-2 border-1 space-y-2 flex flex-col justify-between rounded-md bg-white drop-shadow-xl h-[25rem] w-full "
    >
      <h2 className="font-semibold tracking-widest">{tribute.title}</h2>
      <div className="h-full w-full overflow-hidden flex items-center justify-center flex-grow">
        {/* if tribute.image is null the show profile.profile_picture */}
        {tribute.image ? (
          <img
            src={tribute.image}
            className="aspect-square w-full h-full rounded-md object-cover"
          />
        ) : (
          <img
            src={profile.profile_picture}
            className="aspect-square w-full h-full rounded-md object-cover"
          />
        )}
      </div>
      <p className="text-lime-700 text-xs font-medium tracking-wider italic ">
        ~Tribute By {tribute.display_name}
      </p>
      {canDelete && (
        <button
          onClick={handleDeleteTribute}
          className="text-sm tracking-wider text-red-500 2xl:text-base mt-2"
        >
          Delete Tribute
        </button>
      )}
    </div>
  );
}