import { useState, useEffect, useContext, createContext } from "react";
import { getFavoriteProfilesWithUserId, getPostsWithUserId, getProfilesWithUserId } from "../../services/profileManager.service"
import { getUserWithEmail } from "../../services/userProfile.service";
import { useNavigate } from "react-router-dom";
import Spinner from "../Common/Spinner";

const ProfileContext = createContext();

export const ProfileManagerProvider = ({ children }) => {
  const navigate = useNavigate();
  const [managerProfile, setManagerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteProfiles, setFavoriteProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  let user = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : null;

  const getManagerProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserWithEmail(user.email);
      if (!res) {
        navigate("/404");
        return;
      }
      console.log("From Profile Provider  manager profile : ", res);
      setManagerProfile(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getFavoriteProfiles = async () => {
    try {
      const res = await getFavoriteProfilesWithUserId(user.id);
      console.log("From Profile Provider Events : ", res);
      setFavoriteProfiles(res);
    } catch (error) {
      console.error(error);
    }
  }

  const getPosts = async () => {
    try {
      const res = await getPostsWithUserId(user.id);
      console.log("From Profile Provider Posts : ", res);
      if (profiles.length == 0) await getAllProfiles();
      setPosts(res);
    } catch (error) {
      console.error(error);
    }
  }

  const getAllProfiles = async () => {
    try {
      const res = await getProfilesWithUserId(user.id);
      console.log("From Profile Manager Provider Profiles : ", res);
      setProfiles(res);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getManagerProfile();
  }, [user.id]);

  return (
    <ProfileContext.Provider value={{ managerProfile, loading, setLoading, getManagerProfile, favoriteProfiles, posts, getFavoriteProfiles, getPosts, profiles, getAllProfiles }}>
      {loading ? <Spinner /> : children}
    </ProfileContext.Provider>
  )
}

export const useProfileManager = () => useContext(ProfileContext);