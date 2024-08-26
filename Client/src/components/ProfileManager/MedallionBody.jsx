import React, { useEffect, useState } from "react";
import MyFavoriteCard from "./MyFavoriteCard";
import Spinner from "../Common/Spinner";
import { Link } from "react-router-dom";
import { useProfileManager } from "../Providers/ProfileManagerProvider";
import ScrollAnimation from "react-animate-on-scroll";

export default function MedallionBody() {
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const { profiles, getAllProfiles } = useProfileManager();
    useEffect(() => {
        const fetchProfiles = async () => {
            if (profiles.length == 0) {
                setLoading(true);
                await getAllProfiles();
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);


    return !loading ? (
        profiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {profiles.map((profile) => (
                        <ScrollAnimation className="w-full" animateIn="bounceInRight">

                    <div key={profile.id} className="relative">
                        <MyFavoriteCard profile={profile} />
                        {/* <Link to={`/edit-profile/` + profile.id}>
                            <button className="absolute -bottom-1 -right-1 m-0 aspect-square w-8 rounded-full bg-[#61D2B7] hover:scale-105">
                                <img
                                    src="/images/pencil.svg"
                                    alt="edit"
                                    className="mx-auto"
                                />
                            </button>
                        </Link> */}

                    </div>
                    </ScrollAnimation>
                ))}
            </div>
        ) : (
            <div className="flex h-96 items-center justify-center">
                <h1 className="text-2xl font-semibold">No Profiles Found</h1>
            </div>
        )
    ) : (
        <Spinner text="Fetching your Profiles..." />
    );
}
