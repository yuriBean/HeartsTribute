import { useLocation, useNavigate } from 'react-router-dom'
import { useProfileManager } from "../Providers/ProfileManagerProvider";
import dateToNow from "../../utils/dateToNow";
import Spinner from '../Common/Spinner';
import ChangeProfilePictureModal from './ChangeProfilePictureModal';
import { useState, useEffect } from 'react';
import { deleteProfilePhoto } from "../../services/profileManager.service"; // Import the reset function
import DraggableImage from '../Common/DraggableImage'; // Ensure the path is correct

const dummyData = {
  "name": "Robert T. Hawke",
  "email": "robthehawke@email.com",
  "join_date": "2 years",
  "profile_picture": "/images/ProfilePicture.png",
}



export default function HeaderForProfileManager({ tab, setTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false)
  const { managerProfile, loading } = useProfileManager();
  const testData = localStorage.getItem("user");

  //   useEffect(() => {
  //     if (isOpen) {
  //         document.body.style.overflow = 'hidden';
  //     } else {
  //         document.body.style.overflow = '';
  //     }
  // }, [isOpen]);

  const handleResetProfilePicture = async () => {
    if (window.confirm("Are you sure you want to reset your profile picture?")) {
      try {
        await deleteProfilePhoto(managerProfile.id); // Call the reset function
        alert("Profile picture reset to placeholder.");
      } catch (error) {
        console.error("Failed to reset profile picture:", error);
      }
    }
  };
  

  return (!loading) ? (
    <header className="flex flex-col bg-gradient-to-r from-primary to-[#61D2B7] font-poppins rounded-lg">
      <div className="flex flex-col md:flex-row gap-y-2 items-center mx-auto my-6 md:mx-0 md:my-10 md:ml-10">
        <div className="relative w-[200px]   rounded-full aspect-square">
          <img src={managerProfile?.profile_picture || "/images/placeholder-profile.jpg"} className="w-[200px] aspect-square rounded-full object-cover" alt="profile pic" />
          <button onClick={() => setIsOpen(true)} className="absolute bottom-0 right-0 aspect-square m-0 w-[30%] bg-white rounded-full hover:scale-105">
            <img src="/images/pencil.svg" alt="edit" className="mx-auto" />
          </button>
        </div>
        <div className="text-white text-center md:text-left md:ml-4 md:leading-7">
          <h1 className="text-2xl md:text-3xl xl:text-4xl 3xl:text-6xl font-semibold">{managerProfile?.first_name ? `${managerProfile?.first_name + " " + managerProfile?.last_name}` : ""}</h1>
          <h3 className="text-black  text-sm md:text-base xl:text-lg 3xl:text-xl md:mb-6 font-sans font-medium tracking-widest">{managerProfile?.email}</h3>
          {/* <span className="px-2 lg:px-4 py-1 text-base bg-[#97adae] w-fit font-sans flex justify-center items-center"><img src="/images/calendar.svg" className="inline mr-3" />{""}<span>Joined: {dummyData.join_date} ago</span></span> */}
          <button className='bg-[#97adae] rounded mx-auto md:mx-0 text-xs md:text-sm xl:text-base  flex items-center gap-3 py-2 px-4 md:py-3 mt-3 cursor-default font-sans font-medium'>
            <img className='w-4' src="/images/calendar.svg" alt="" />
            <span>Joined: {dateToNow(managerProfile?.created_at.seconds)}</span>
          </button>
          <button onClick={handleResetProfilePicture} className="bg-transparent text-red-800 border-red-800 border-solid border-2 rounded mt-2 px-3 py-2 text-sm">
            Reset Profile Picture
          </button>

        </div>
      </div>
      <div className="flex gap-2 justify-around p-2 lg:p-3">
        <button className={`${location.pathname == '/profile-manager' ? 'bg-black text-white font-semibold' : 'text-black bg-white'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} onClick={() => { navigate("/profile-manager") }}>MY FAVOURITE</button>
        <button className={`${location.pathname == '/profile-manager/posts' ? 'bg-black text-white font-semibold' : 'text-black bg-white'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} onClick={() => { navigate("posts") }}>POSTS</button>
        <button className={`${location.pathname == '/profile-manager/tribute-tags' ? 'bg-black text-white font-semibold' : 'text-black bg-white'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} onClick={() => { navigate("tribute-tags") }}>TRIBUTE TAGS</button>
        <button className={`${location.pathname == '/profile-manager/my-account' ? 'bg-black text-white font-semibold' : 'text-black bg-white'} rounded text-[0.6rem] md:text-base lg:text-lg 2xl:text-xl tracking-widest py-2 lg:py-4 w-1/4`} onClick={() => { navigate("my-account") }}>MY ACCOUNT</button>
      </div>
      <ChangeProfilePictureModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  ) : <Spinner />
}
