import { useEffect, useState } from "react";
import MedallionBody from "./MedallionBody";
import CreateProfile from "./CreateProfile";
import { useProfileManager } from "../Providers/ProfileManagerProvider";

export default function MedallionTab() {
    const [showCreateProfile, setToShowCreateProfile] = useState(false);
    const { profiles, getAllProfiles } = useProfileManager();
    // const [loading , setLoading] = useState(false);
    useEffect(() => {
        console.log(
            "Profiles from heading of meddallion tab: ",
            profiles.length,
        );
    }, []);
    return (
        <div className={`rounded-md px-4 py-8`}>
            <div
                className={`${showCreateProfile ? "hidden" : "flex"} mb-4 items-center justify-between md:mb-8`}
            >
                <div>
                    <h1
                        className={`mb-1 text-xl font-semibold tracking-widest md:text-2xl xl:text-3xl 2xl:text-4xl`}
                    >
                        Profiles
                    </h1>
                    <p>
                        You have {profiles.length} Profile
                        {profiles.length == 1 ? "" : "s"}
                    </p>
                </div>
                <button
                    onClick={() => setToShowCreateProfile(!showCreateProfile)}
                    className="flex rounded-md cursor-default items-center bg-[#346164] px-4 py-3 font-sans text-xs font-bold text-white outline-none md:py-4 md:text-sm xl:text-base 2xl:py-5"
                >
                    <span className="mr-3 text-sm md:text-base xl:text-lg">
                        +
                    </span>{" "}
                    CREATE NEW PROFILE
                </button>
            </div>
            {!showCreateProfile && <MedallionBody />}

            {showCreateProfile && <CreateProfile />}
        </div>
    );
}
