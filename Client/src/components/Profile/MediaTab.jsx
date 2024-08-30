import { useEffect, useState } from "react";
import Post from "../Common/Post";
import Spinner from "../Common/Spinner";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import CheckProfileOwner from "../CheckProfileOwner";
import { useNavigate } from "react-router-dom";

export default function MediaTab() {
  const { posts, profile, getPosts } = usePublicProfile();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (posts.length === 0) {
        setLoading(true);
        await getPosts();
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return !loading ? (
    <div>
      <CheckProfileOwner>
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/edit-profile/${profile.id}/add-post`)}
            className="bg-primary my-2 text-white px-4 py-2 rounded-lg"
          >
            Add Media
          </button>
        </div>
      </CheckProfileOwner>

      {posts.length === 0 ? (
        <h1 className="text-2xl text-center">No media uploaded yet, add photos or videos on this page.</h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 rounded-lg place-items-center">
          {posts.map((post) => (
            <Post key={post.id} post={post} profile={profile} />
          ))}
        </div>
      )}
    </div>
  ) : (
    <Spinner />
  );
}
