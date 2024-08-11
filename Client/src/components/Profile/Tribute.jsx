import React from "react";
import { usePublicProfile } from "../Providers/PublicProfileProvider";

export default function Tribute({ tribute }) {
  const { profile } = usePublicProfile();
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
    </div>
  );
}
