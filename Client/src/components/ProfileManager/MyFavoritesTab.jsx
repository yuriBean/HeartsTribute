import MyFavoriteCard from "./MyFavoriteCard";
import { useEffect, useState } from "react";
import { useProfileManager } from "../Providers/ProfileManagerProvider";
import Spinner from "../Common/Spinner";
import ScrollAnimation from "react-animate-on-scroll";

export default function MyFavoritesTab() {
    const { favoriteProfiles, getFavoriteProfiles } = useProfileManager();
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchFavoriteProfiles = async () => {
            if (favoriteProfiles.length === 0) {
                setLoading(true);
                await getFavoriteProfiles(user.id);
                setLoading(false);
            }
        };
        fetchFavoriteProfiles();
    }, []);
    return (
        <div className="px-4 py-8">
            <div className="mb-4 flex items-center space-x-2 md:mb-8">
                <h1 className="text-xl font-bold tracking-wider md:text-2xl xl:text-3xl 2xl:text-4xl">
                    Favourites
                </h1>
                <img
                    src="/images/heart-fill.svg"
                    className="mb-1 self-end bg-green-50 xl:w-6"
                    alt="heart emoji"
                />
            </div>

            {loading && <Spinner />}

            <div className="grid grid-cols-1 gap-6 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {!loading &&
                    favoriteProfiles.map((profile) => (
                        <ScrollAnimation className="w-full" animateIn="bounceInRight">
                            <MyFavoriteCard
                                key={profile.id}
                                profile={profile}
                            />
                        </ScrollAnimation>
                    ))}
            </div>

            {favoriteProfiles.length == 0 && !loading && (
                <p className="text-xl tracking-wider text-secondaryDarkGray xl:text-2xl 2xl:text-3xl">
                    You have no Favourites
                </p>
            )}
        </div>
    );
}
