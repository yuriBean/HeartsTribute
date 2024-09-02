import React from "react";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import { deleteTribute } from "../../services/profileManager.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Tribute({ tribute, onDelete }) {
  const { profile } = usePublicProfile();
  const user = JSON.parse(localStorage.getItem("user"));

  const profileUserId = profile ? profile.user_id : null;
  const userId = user ? user.id : null;

  const handleDeleteTribute = async () => {
    if (window.confirm("Are you sure you want to delete this tribute? This action cannot be undone.")) {
      try {
        await deleteTribute(tribute.id);
        onDelete(); 
      } catch (error) {
        console.error("Error deleting tribute:", error);
      }
    }
  };

  const canDelete = userId === tribute.created_by || userId === profileUserId;


  return (
    <div
      id="tribute"
      className="pb-1 pt-4 px-2 border-1 space-y-2 flex flex-col justify-between rounded-md bg-white drop-shadow-xl h-[25rem] w-full "
    >
      <h2 className="font-semibold tracking-widest overflow-auto">{tribute.title}</h2>
      <div className="h-full w-full overflow-hidden flex items-center justify-center flex-grow">
        {tribute.image ? (
          <img
            src={tribute.image}
            className="aspect-square w-full h-full rounded-md object-cover"
          />
        ) : (
          <p></p>
        )}
      </div>
      <div className="flex items-center justify-between ">
      <p className="text-lime-700 text-xs font-medium tracking-wider italic ">
        ~Tribute By {tribute.display_name}
      </p>
      {canDelete && (
        <button
          onClick={handleDeleteTribute}
          className="text-md tracking-wider text-red-500 2xl:text-base mt-2"
        >
           <FontAwesomeIcon icon={faTrash} />
        </button>
      )}</div>
    </div>
  );
}