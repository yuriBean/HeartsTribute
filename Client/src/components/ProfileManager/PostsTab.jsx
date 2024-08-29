import { useState } from "react";
import AddPost from "./AddPost";
import PostsOfUser from "./PostsOfUser";

export default function PostsTab() {
  const [toShowPost, setToShow] = useState(true);

  return (
    <div
      className={`${toShowPost ? "py-8 px-4" : "shadow-md mt-4  px-6 py-12 md:px-12 md:py-24"} rounded-md `}
    >
      <div
        className={`${toShowPost ? "" : "mb-12 md:mb-24"} flex justify-between items-center mb-4  md:mb-8 `}
      >
        <h1
          className={`${toShowPost ? "font-semibold tracking-wider" : "font-medium tracking-widest"}  text-xl md:text-2xl xl:text-3xl 2xl:text-4xl`}
        >
          {toShowPost ? <> Posts</> : <>Add New Post</>}
        </h1>
        <button
          onClick={() => setToShow(!toShowPost)}
          className="bg-[#346164] rounded-md outline-none font-bold text-xs md:text-sm xl:text-base text-white py-2 px-4 md:py-3 cursor-default font-sans "
        >
          {toShowPost ? <> ADD NEW POST </> : <>GO BACK TO POSTS</>}
        </button>
      </div>
      {toShowPost && <PostsOfUser />}
      {!toShowPost && <AddPost />}
    </div>
  );
}
