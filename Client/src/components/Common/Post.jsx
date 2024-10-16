import { useState, useEffect } from "react";
import dateToNow from "../../utils/dateToNow";
import PostModal from "./PostModal";
import Modal from "react-modal";
import { updateCurrentUser } from "firebase/auth";
import {
  addLikeWithUserId,
  removeLikeWithUserId,
} from "../../services/profileManager.service";
import { useAuth } from "../../utils/AuthContext";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "../../utils/toastNotifications";

export default function Post({ post, profile }) {
  let userFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [likes, setLikes] = useState(0);
  const [liked_posts, setLikedPosts] = useState([]);
  const { updateLocalStorage } = useAuth();
  const [loading, setLoading] = useState(false);

  const removeLike = async () => {
    try {
      if (likes === 0) return;
      setLikes(likes - 1);
      setLikedPosts(liked_posts.filter((liked_post) => liked_post !== post.id));
      await removeLikeWithUserId(userFromLocalStorage.id, post.id);
      await updateLocalStorage(userFromLocalStorage.email);
      notifyInfo("Post Unliked");
      userFromLocalStorage = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    } catch (error) {
      console.log("Error removing favorite: ", error);
      notifyError("Error Removing Like");
    }
  };

  const addLike = async () => {
    try {
      setLikedPosts([...liked_posts, post.id]);
      setLikes(likes + 1);
      await addLikeWithUserId(userFromLocalStorage.id, post.id);
      await updateLocalStorage(userFromLocalStorage.email);
      userFromLocalStorage = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      notifySuccess("Post Liked");
    } catch (error) {
      notifyError("Error Adding Like");
    }
  };

  const likePostButton = async (e) => {
    e.stopPropagation();
    if (!userFromLocalStorage) {
      notifyError("Please Login to Like Post");
      return;
    }
    if (liked_posts.includes(post.id)) {
      removeLike();
    } else {
      addLike();
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);
  useEffect(() => {
    if (!userFromLocalStorage) {
      return;
    }
    setLikedPosts(userFromLocalStorage.liked_posts || []);
    setLikes(post.likes);
  }, []);
  useEffect(() => {
    setLikes(post.likes);
  }, [post.likes]);


  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handlePostDelete = () => {
    window.location.reload();
  }
  
  return (
    <div
      onClick={() => {
        setIsOpen(!isOpen);
      }}
      className="border-1 flex h-[25rem] w-full cursor-pointer flex-col justify-between px-2 py-2 shadow-lg hover:scale-105"
    >
      <div className="flex h-full w-full flex-grow items-center justify-center overflow-hidden">
        {post?.image ? (
          <img
            className="h-full w-full object-cover rounded-md"
            src={post?.image || post?.media}
            alt=""
          />
        ) : post?.video?.includes("youtube") ? (
          <iframe
            className="h-full w-full rounded-md"
            src={getEmbedUrl(post?.video)}
            title="Video Player"
            allow="accelerometer;  gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : post?.video ? (
          <video
            className="h-full w-full object-cover rounded-md"
            src={post?.video}
            controls
            onError={() => {
              console.error("Error loading video:", post?.video);
            }}
          ></video>
        ) : (
          <img
            className="h-full w-full object-cover rounded-md"
            src="/cover-placeholder.jpeg"
            alt="Placeholder"
          />
        )}

      </div>
      <div className="flex h-[11rem] flex-col justify-between">
        <div>
          <div className="my-2 flex justify-between px-4">
            <span className="flex space-x-3">
              <span className="text-sm font-semibold md:text-base xl:text-lg 2xl:text-xl">
                {likes}
              </span>
              <img
                onClick={likePostButton}
                className="max-w-6 xl:w-4"
                src={
                  liked_posts.includes(post.id)
                    ? "/images/heart-fill.svg"
                    : "/images/suit-heart.svg"
                }
                alt=""
              />
              <img
                className="max-w-6 hover:scale-110 xl:w-4"
                src="/images/chat.svg"
                alt=""
              />
            </span>
          </div>
          <p className="fon t-light truncate-custom px-4 text-xs md:text-sm 2xl:text-base">
            {post?.description}
          </p>
        </div>
        <div>
          <small className="px-4 text-xs font-semibold">
            {dateToNow(post?.created_at.seconds)}
          </small>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={false}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="relative w-full rounded-md bg-white p-4 lg:w-2/3"
          onClick={(e) => e.stopPropagation()}
        >
          <PostModal profile={profile} setIsOpen={setIsOpen} post={post} onPostDeleted={handlePostDelete} />
        </div>
      </Modal>
    </div>
  );
}
