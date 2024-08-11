import { useState, useEffect, useContext, createContext } from "react";
import {
  getProfileWithId,
  getEventsByProfileId,
  getPostsWithProfileId,
  addFavoriteWithUserId,
  removeFavoriteWithUserId,
  GetTributesById,
} from "../../services/profileManager.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { notifySuccess, notifyError } from "../../utils/toastNotifications";
import Spinner from "../Common/Spinner";

const ProfileContext = createContext();

export const PublicProfileProvider = ({ profile_id, children }) => {
  const { user, updateLocalStorage } = useAuth();
  let userFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tributes, setTributes] = useState([]);
  const [tab, setTab] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileWithId(profile_id);
      console.log("From Profile Provider Profile : ", res);
      if (!res) {
        navigate("/404");
        return;
      }
      if (!res.visibility) {
        if (
          user &&
          ((res.allowedUsers && res.allowedUsers.includes(user.email)) ||
            res.user_id === user.id)
        ) {
        } else {
          navigate(`/request-access/${profile_id}`);
          return;
        }
      }
      setProfile(res);
      await getEvents();
      if (!userFromLocalStorage) return;
      await fetchFavorites();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const addFavorite = async () => {
    try {
      if (!userFromLocalStorage) return;
      setFavorites([...favorites, profile.id]);
      await addFavoriteWithUserId(userFromLocalStorage.id, profile.id);
      await updateLocalStorage(userFromLocalStorage.email);
      notifySuccess("Profile added to favorites");
      fetchFavorites();
      console.log("Updated Favorites : ", favorites);
    } catch (error) {
      console.error(error);
      notifyError("Error adding profile to favorites");
    }
  };
  const removeFavorite = async () => {
    try {
      if (!userFromLocalStorage) return;
      setFavorites(favorites.filter((fav) => fav !== profile.id));
      await removeFavoriteWithUserId(userFromLocalStorage.id, profile.id);
      await updateLocalStorage(userFromLocalStorage.email);
      notifySuccess("Profile removed from favorites");
      fetchFavorites();
    } catch (error) {
      console.error(error);
      notifyError("Error removing profile from favorites");
    }
  };
  const fetchFavorites = async () => {
    try {
      if (!userFromLocalStorage) return;
      await updateLocalStorage(userFromLocalStorage.email);
      userFromLocalStorage = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      setFavorites(userFromLocalStorage.favorite_profiles || []);
      console.log("Favorites : ", favorites);
    } catch (error) {
      console.error(error);
    }
  };
  const getEvents = async () => {
    try {
      const res = await getEventsByProfileId(profile_id);
      console.log("From Profile Provider Events : ", res);
      setEvents(res);
    } catch (error) {
      console.error(error);
    }
  };
  const getPosts = async () => {
    try {
      const res = await getPostsWithProfileId(profile_id);
      console.log("From Profile Provider Posts : ", res);
      setPosts(res);
    } catch (error) {
      console.error(error);
    }
  };
  const getTributes = async () => {
    try {
      const res = await GetTributesById(profile_id);
      console.log("From Profile Provider Tributes : ", res);
      setTributes(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, [profile_id]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        setLoading,
        getProfile,
        events,
        posts,
        tributes,
        getEvents,
        getPosts,
        getTributes,
        tab,
        setTab,
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {loading && <Spinner />}
      {!loading && children}
    </ProfileContext.Provider>
  );
};

export const usePublicProfile = () => useContext(ProfileContext);
