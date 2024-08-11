import React, { useEffect, useState } from "react";
import {
  AddCommentToPost,
  getCommentsWithPostId,
  deletePost, 
} from "../../services/profileManager.service";
import Comment from "./Comment";
import Picker from "emoji-picker-react";

export default function PostModal({ setIsOpen, post, profile }) {
  const [isReadMore, setIsReadMore] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const sendComment = async () => {
    try {
      setLoading(true);
      const data = {
        text: text,
        user_id: user.id,
        display_name: user?.first_name
          ? user?.first_name + " " + user?.last_name
          : user?.email,
        user_profile_picture: user?.profile_picture || "",
      };
      console.log("Data to send ", data);
      setText("");
      const res = await AddCommentToPost(data, post.id);
      setLoading(false);
      await fetchComments();
      console.log(res);
    } catch (error) {}
  };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getCommentsWithPostId(post?.id);
      setComments(res);
      setLoading(false);
    } catch (error) {
      console.log("Error getting comments: ", error);
    }
  };
  const onEmojiClick = (emojiObject) => {
    console.log(emojiObject);
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    sendComment();
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        try {
            await deletePost(post.id); // Call the deletePost function
            notifySuccess("Post deleted successfully");
            setIsOpen(false); // Close the modal after deletion
        } catch (error) {
            notifyError("Failed to delete post: " + error.message);
          } finally {
            setIsOpen(false); // Close the modal after deletion or error
        }
    }
};
  useEffect(() => {
    fetchComments();
  }, []);

  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };  

  return (
    <>
      <div className="fixed left-[10%] top-[13%] z-50 m-auto my-auto flex h-[80%] w-[80%] flex-col overflow-y-auto border border-black bg-white lg:left-[5%] lg:top-[12.5%] lg:h-[75%] lg:w-[90%] lg:flex-row lg:overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-2"
        >
          <img src="/images/close.svg" alt="Close" className="h-5 w-5" />
        </button>
        <div className="aspect-square min-h-[50%] w-full lg:w-[45%]">
          {post?.image ? (
            <img
              className="h-full w-full object-cover"
              src={post?.image || post?.media}
              alt=""
            />
          ) : // if the url has youtube use iframe else use video
          post?.video?.includes("youtube") ? (
            <iframe
              className="h-full w-full"
              src={getEmbedUrl(post?.video)}
              title="Video Player"
              allow="accelerometer;  gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
            className="h-full w-full object-cover rounded-md"
            src="/cover-placeholder.jpeg" // Updated to use the public folder
            alt="Placeholder"
          />
            )}
        </div>
        <div className="scrollbar flex w-full flex-grow flex-col justify-between px-5 py-2 text-center md:flex-grow-0 md:overflow-hidden lg:w-[60%] 2xl:px-10 2xl:py-5">
          <div>
            <div className="mb-2 flex items-center justify-start space-x-6">
              <img
                className="h-10 w-10 rounded-full 2xl:h-20 2xl:w-20"
                src={
                  profile?.profile_picture || "/images/placeholder-profile.jpg"
                }
                alt=""
              />
              <div className="font-poppins font-bold">
                <h2 className="my-1 text-xl font-medium tracking-widest 2xl:text-3xl">
                  {profile?.first_name + ". " + profile?.last_name}
                </h2>
                {/* <p className="text-left text-sm tracking-wider 2xl:text-base">
                  {profile?.title}
                </p> */}
                          {user && user.id === post.user_id && (
            <button
              onClick={handleDeletePost}
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
            >
              Delete Post
            </button>
          )}

              </div>
            </div>
            <div className="text-left">
              <p className="text-base font-semibold tracking-widest 2xl:text-xl">
                {post?.title}
              </p>
              <p
                className={`text-sm tracking-wider text-gray-600 2xl:my-4 2xl:text-base ${isReadMore ? "" : "line-clamp-3"} transition-all delay-300`}
              >
                {post?.description}{" "}
              </p>
              {post?.description.length > 100 && (
                <button
                  onClick={toggleReadMore}
                  className="text-sm tracking-wider text-primary 2xl:text-base"
                >
                  {isReadMore ? "Read Less" : "Read More"}
                </button>
              )}
              <hr className="w-full" />
            </div>
          </div>

          <div className="scrollbar flex-grow overflow-y-scroll">
            {!loading &&
              (comments.length > 0 ? (
                <div className="no-scrollbar flex flex-grow border-collapse flex-col overflow-y-scroll">
                  {comments.map((comment, index) => (
                    <Comment
                      key={index}
                      comment={comment}
                      fetchComments={fetchComments}
                      post_id={post.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col justify-center text-gray-600">
                  <img
                    className="mx-auto mb-10 w-10 2xl:w-16"
                    src="/images/chat-dots.svg"
                    alt=""
                  />
                  <p className="my-2 text-base tracking-widest 2xl:text-2xl">
                    This post has no comments yet!
                  </p>
                  <p className="text-sm tracking-wide 2xl:text-base">
                    Be the fist to share your opinion and leave a comment below.
                  </p>
                </div>
              ))}
            {loading && (
              <div className="flex h-full flex-col items-center justify-center py-8">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#346164]"></div>
              </div>
            )}
          </div>
          {user && user.emailVerified && (
            <div className="relative">
              <form
                onSubmit={onSubmit}
                className="flex w-full items-center rounded-md border border-gray-300 px-4 2xl:border-2"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                >
                  <img src="/images/emoji-smile.svg" alt="" />
                </button>
                <input
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-2 py-1 placeholder:text-sm focus-visible:outline-0"
                  type="text"
                  name="message"
                  id="message"
                  placeholder="Add a Comment"
                  value={text}
                  disabled={loading}
                />
                <button type="submit">
                  <img src="/images/send.svg" alt="" />
                </button>
              </form>
              <div className=" absolute block bottom-8 z-10">
                <Picker width={'100%'} open={showEmojiPicker} onEmojiClick={onEmojiClick} />
              </div>
            </div>
          )}
          {!user && (
            <p className="my-2 text-base tracking-widest text-gray-600 2xl:text-2xl">
              Please login to leave a comment
            </p>
          )}
        </div>
      </div>
    </>
  );
}