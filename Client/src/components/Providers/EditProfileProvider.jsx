import { useState, useEffect, useContext, createContext } from "react";
import { getEventsByProfileId, getPostsWithProfileId, getProfileWithIdAndUserId } from "../../services/profileManager.service"
import { useNavigate } from "react-router-dom";

const ProfileContext = createContext();

export const EditProfileProvider = ({ profile_id, children }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileWithIdAndUserId(profile_id , user.id);
      if (!res) {
        navigate("/404");
        return;
      }
      await fetchPostsAndEvents();
      setProfile(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchPostsAndEvents = async () => {
    await Promise.all([getPosts(), getEvents()]);
  };

  const getEvents = async () => {
    try {
      setLoading(true);
      const res = await getEventsByProfileId(profile_id);
      setEvents(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getPosts = async () => {
    try {
      setLoading(true);
      const res = await getPostsWithProfileId(profile_id);
      setPosts(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [profile_id]);

  return (
    <ProfileContext.Provider value={{ profile, loading, setLoading, getProfile, events, posts, getEvents, getPosts }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext);