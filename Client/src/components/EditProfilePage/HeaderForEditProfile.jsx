import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../Providers/EditProfileProvider";
import Spinner from "../Common/Spinner";
import { useParams } from "react-router-dom";
import ChangeMedallionProfilePictureModal from "./ChangeMedallionProfilePictureModal";
import { useState } from "react";
import { formatDate } from "../../utils/dateToNow";

export default function HeaderForEditProfile() {
  const { profile_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { profile, events, posts } = useProfile();

  const isActiveTab = (path) => location.pathname == (path);

  return profile ? (
    <header
      className="relative overflow-hidden rounded-lg flex flex-col items-center justify-between bg-opacity-90 bg-cover bg-center bg-no-repeat py-12 font-poppins md:flex-row"
      style={{ backgroundImage: `url(${profile?.cover_picture})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative mx-auto mb-6 flex flex-col items-center gap-y-2 md:mx-0 md:my-10 md:mb-0 md:ml-10 md:flex-row">
        <div className="relative w-[200px] rounded-full">
          <img
            src={
              profile?.profile_picture ||
              ".images/placeholder-profile.jpg"
            }
            className="h-[200px] w-[200px] rounded-full object-cover"
            alt="profile pic"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-0 right-0 m-0 aspect-square w-[30%] rounded-full bg-white hover:scale-105"
          >
            <img
              src="/images/pencil.svg"
              alt="edit"
              className="mx-auto"
            />
          </button>
        </div>
        <div className="text-center text-white md:ml-4 md:text-left md:leading-7">
          <h1 className="text-2xl font-semibold md:text-3xl xl:text-4xl 3xl:text-6xl">
            {profile?.first_name + " " + profile?.last_name}
          </h1>
          {/* <h3 className="font-sans text-sm font-medium tracking-widest md:mb-6 md:text-base xl:text-lg 3xl:text-xl">
            {profile?.title || profile?.breed}
          </h3> */}
          <button className="mx-auto mt-3 flex cursor-default items-center gap-3 rounded bg-[#346164] px-4 py-2 font-sans text-xs font-medium md:mx-0 md:py-3 md:text-sm xl:text-base">
            <img
              className="w-4"
              src="/images/calendar.svg"
              alt=""
            />
            <span>
              {formatDate(profile?.birth_date)} - {formatDate(profile?.death_date)}
            </span>
          </button>
        </div>
        <ChangeMedallionProfilePictureModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>

      {/* buttons round full 4 , 1 to show total posts , 1 for total events and 1 each for add event and add post */}
      <div className="relative flex flex-wrap justify-center gap-4 md:mr-10">
        <button
          className={`edit-profile-round-button ${
            isActiveTab(`/edit-profile/${profile_id}`) ? "bg-primary text-white" : ""
          }`}
          onClick={() => navigate(`/edit-profile/${profile_id}`)}
        >
          <span className="text-xs font-bold md:text-sm">
            Edit Profile
          </span>
        </button>
        <button
          className={`edit-profile-round-button ${
            isActiveTab(`/edit-profile/${profile_id}/manage-access`) ? "bg-primary text-white" : ""
          }`}
          onClick={() => navigate("manage-access")}
        >
          <span className="text-xs font-bold md:text-sm">
            Manage Access
          </span>
        </button>
        <button
          className={`edit-profile-round-button ${
            isActiveTab(`/edit-profile/${profile_id}/events`) ? "bg-primary text-white" : ""
          }`}
          onClick={() => navigate("events")}
        >
          <span className="block text-base text-[#909090] md:text-lg">
            {events.length}
          </span>
          <span className="text-xs font-bold md:text-sm">
            Event{events.length > 1 ? "s" : ""}
          </span>
        </button>
        <button
          className={`edit-profile-round-button ${
            isActiveTab(`/edit-profile/${profile_id}/add-event`) ? "bg-primary text-white" : ""
          }`}
          onClick={() => navigate("add-event")}
        >
          <span className="block text-base text-[#909090] md:text-lg">
            +
          </span>
          <span className="text-xs font-bold md:text-sm">
            Add Event
          </span>
        </button>
        <button
          className={`edit-profile-round-button ${
            isActiveTab(`/edit-profile/${profile_id}/posts`) ? "bg-primary text-white" : ""
          }`}
          onClick={() => navigate("posts")}
        >
          <span className="block text-base text-[#909090] md:text-lg">
            {posts.length}
          </span>
          <span className="text-xs font-bold md:text-sm">
            Post{posts.length > 1 ? "s" : ""}
          </span>
        </button>
        <button
          className={`edit-profile-round-button ${
            isActiveTab(`/edit-profile/${profile_id}/add-post`) ? "bg-primary text-white" : ""
          }`}
          onClick={() => navigate("add-post")}
        >
          <span className="block text-base text-[#909090] md:text-lg">
            +
          </span>
          <span className="text-xs font-bold md:text-sm">
            Add Post
          </span>
        </button>
      </div>
    </header>
  ) : (
    <Spinner />
  );
}
