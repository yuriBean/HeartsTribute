import { useEffect, useState } from "react";
import Post from "../Common/Post";
import Spinner from "../Common/Spinner";
import { useProfileManager } from "../Providers/ProfileManagerProvider";
import ScrollAnimation from "react-animate-on-scroll";

export default function PostsOfUser() {
    const { posts, getPosts, profiles } = useProfileManager();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            if (posts.length == 0 || profiles.length == 0) {
                setLoading(true);
                await getPosts();
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return !loading ? (
        posts.length === 0 ? (
            <h1 className="text-center text-2xl">No Posts Yet!</h1>
        ) : (
            <div className="grid grid-cols-1 place-items-center gap-6 rounded-lg md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {posts.map((post) => (
                    <ScrollAnimation className="w-full" animateIn="bounceInRight" >
                        <Post
                            key={post.id}
                            post={post}
                            profile={profiles.find(
                                (profile) => profile?.id == post?.profile_id,
                            )}
                        />
                    </ScrollAnimation>
                ))}
            </div>
        )
    ) : (
        <Spinner />
    );
}
