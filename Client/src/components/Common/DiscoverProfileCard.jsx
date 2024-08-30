import dateToNow from "../../utils/dateToNow";
import { useNavigate } from "react-router-dom"; 

export default function DiscoverProfileCard({ profile }) {
  const navigate = useNavigate(); 

  const handleViewProfile = () => {
   
      navigate(`/profile/${profile.id}`); 
    }

  return (
    <div
      key={profile.id}
      className="mx-auto w-3/4 p-4 text-lg shadow-lg xl:w-1/2 rounded-lg"
    >
      <img
        className="w-full rounded-xl"
        loading="lazy"
        src={profile.profile_picture}
        alt=""
      />
      <div className="flex flex-col items-center space-y-2 md:space-y-6 pb-2 pt-4 px-8">
        <p className="text-center text-lg font-semibold tracking-wider lg:text-3xl">
          {profile.first_name} {` `} {profile.last_name}
        </p>
        <p className="line-clamp-2 text-sm">{profile.bio}</p>
        <a
          onClick={handleViewProfile}
          className="mx-auto mb-2  w-fit bg-primary px-3   py-1 rounded-md  text-white hover:bg-opacity-85"
        >
          View Profile
        </a>  
        <p className="text-xs pt-2">
          Last Updated: {dateToNow(profile.updated_at.seconds)}
        </p>
      </div>
    </div>
  );
}
