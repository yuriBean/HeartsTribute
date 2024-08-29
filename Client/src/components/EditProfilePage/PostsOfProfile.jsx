import Post from "../Common/Post";
import ScrollAnimation from "react-animate-on-scroll";
import { useProfile } from "../Providers/EditProfileProvider";

export default function PostsOfProfile() {
    const { posts, profile } = useProfile();

    return posts.length === 0 ? (
        <h1 className="text-center text-2xl">No Posts Yet! </h1>
    ) : (
        <div className="grid grid-cols-1 place-items-center gap-6 rounded-lg md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {posts.map((post) => (
                <ScrollAnimation className="w-full" animateIn="bounceInRight">
                    <Post key={post.id} post={post} profile={profile} />
                </ScrollAnimation>
            ))}
        </div>
    );
}
