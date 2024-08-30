import { useState } from "react";
import dateToNow from "../../utils/dateToNow";
import { deleteComment } from "../../services/profileManager.service";

export default function Comment({ comment, post_id, fetchComments }) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [readMore, setReadMore] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    const handleDelete = async () => {
        const prompt = window.confirm(
            "Are you sure you want to delete this comment?",
        );
        if (!prompt) return;
        try {
            console.log("Comment deleted");
            await deleteComment(post_id, comment.id, user.id);
            await fetchComments();
            setDropdownVisible(false);
        } catch (error) {
            console.log("Error deleting comment: ", error);
        }
    };
    const toggleReadMore = () => {
        setReadMore(!readMore);
    };

    return (
        <>
            <hr />
            <div className="py-2">
                <div className="relative flex w-full justify-between">
                    <div className="flex flex-grow flex-row space-x-2">
                        <img
                            className="aspect-square w-[10%] object-cover rounded-full md:w-[7%]"
                            src={
                                comment.user_profile_picture ||
                                "/images/placeholder-profile.jpg"
                            }
                            alt="Commenter"
                        />
                        <div className="text-left leading-[0.6rem]">
                            <p className="text-base font-bold leading-3 md:text-lg">
                                {" " + comment.display_name}
                            </p>
                            <span className="text-[0.65rem] font-normal">
                                {dateToNow(comment.created_at.seconds)}
                            </span>
                        </div>
                    </div>
                    <div className="relative mr-2">
                        {user?.id == comment.user_id && (
                            <button
                                className="text-2xl leading-[0] text-gray-500"
                                onClick={toggleDropdown}
                            >
                                ...
                            </button>
                        )}
                        {dropdownVisible && (
                            <div className="absolute right-0 mt-1 w-[17ch] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div
                                    className=""
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="options-menu"
                                >
                                    <button
                                        className="w-full whitespace-nowrap rounded-md px-4 py-2 text-left text-sm tracking-widest text-[#F00D0D] hover:bg-gray-100"
                                        onClick={handleDelete}
                                    >
                                        Delete Comment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <p
                        className={`${readMore ? "" : "line-clamp-2"} ml-[10%] max-w-[90%] break-words rounded-md px-2 py-1 text-left text-sm font-extralight tracking-widest md:ml-[7%]`}
                    >
                        {comment.text}
                        <br />
                    </p>
                    {comment.text.length > 100 && (
                        <button
                            className="text-xs tracking-wider text-primary 2xl:text-base"
                            onClick={toggleReadMore}
                        >
                            {readMore ? "Read Less" : "Read More"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
