import React from "react";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import Spinner from "../Common/Spinner";
import { notifyError } from "../../utils/toastNotifications";
import { useAuth } from "../../utils/AuthContext";

export default function HeaderForPublicProfile() {
  const { profile, loading, favorites, addFavorite, removeFavorite } =
    usePublicProfile();
  const userFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { user } = useAuth();
  const favoriteButtonClick = () => {
    if (!userFromLocalStorage) {
      notifyError("Please Login to Add to Favorites");
      return;
    }
    if (favorites.includes(profile.id)) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };
  return !loading ? (
    <div>
      <div className={`relative`}>
        {/* Profile and Headline */}
        <div className="bg-[#346164] pb-4 rounded-lg">
          <div className="flex w-full justify-center">
            <img
              className="mx-auto aspect-video h-[50vh] md:h-[50vh] w-[93%] rounded-bl-full rounded-br-full border-8 border-t-0 border-white object-center object-cover"
              src={profile?.cover_picture || "/cover-placeholder.jpeg"}
              loading="lazy"
            />
          </div>
          <div className="relative -mt-[8rem] flex w-full justify-center">
            <img
              className="aspect-square w-[200px] rounded-full border-4 border-white object-cover"
              loading="lazy"
              src={
                profile?.profile_picture || "/images/placeholder-profile.jpg"
              }
              alt=""
            />
            <button
              onClick={favoriteButtonClick}
              className="absolute top-40 ml-36 cursor-pointer rounded-full border-2 border-white bg-white p-1 outline-none hover:scale-105"
            >
              <img
                className="w-[25px]"
                src={
                  favorites
                    ? favorites.includes(profile.id)
                      ? "/images/heart-fill.svg"
                      : "/images/suit-heart.svg"
                    : "/images/suit-heart.svg"
                }
                alt=""
              />
            </button>
          </div>
          <div className="text-center">
          <small className="text-xl md:text-xl text-white">In Loving Memory of</small>
            <h2 className="my-2 text-3xl font-medium text-white">
              {profile?.first_name + " " + profile?.last_name}
            </h2>
            {/* <p className="text-sm font-semibold">
              {profile?.title || profile?.breed}
            </p> */}
          </div>
          {profile?.donation_profile_id && (
            <div className="md:hidden mt-2 flex items-center justify-center ">
              <a
                href={`https://www.globalgiving.org/projects/${profile?.donation_profile_id}`}
                className="rounded border px-4 py-2 text-base text-white hover:bg-black lg:px-8"
                target="_blank"
              >
                <span>Donate in Their Honor</span>
              </a>
            </div>
          )}
        </div>
        {profile?.donation_profile_id && (
          <div className="md:flex mb-2 hidden md:absolute bottom-0 left-2">
            <a
              href={`https://www.globalgiving.org/projects/${profile?.donation_profile_id}`}
              className="rounded border px-4 py-2 text-base text-white hover:bg-black lg:px-8"
              target="_blank"
            >
              <span>Donate in Their Honor</span>
            </a>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Spinner />
  );
}
