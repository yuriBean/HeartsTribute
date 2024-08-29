import { useState } from "react";
import MedallionBody from "./MedallionBody";
import CreateProfile from "./CreateProfile";
import { useProfileManager } from "../Providers/ProfileManagerProvider";

export default function MedallionTab() {
    const [showCreateProfile, setToShowCreateProfile] = useState(false);
    const { profiles } = useProfileManager();

    return (
        <div className={`rounded-md px-4 py-8`}>
            <div
                className={`${showCreateProfile ? "hidden" : "flex"} mb-4 items-center justify-between md:mb-8`}
            >
                <div className="flex flex-col justify-end items-end">
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
            <h1
                        className={`text-xl mb-2 font-semibold tracking-widest md:text-2xl xl:text-3xl 2xl:text-4xl`}
                    >
                        Profiles
                    </h1>

                {profiles.length > 0 && (            
                    <p className="mb-8">
                    Select a profile to view or edit. You have 30 days to link your profile to a Tribute Tag. Profiles not linked within this period will be deleted.
                    </p>
                    )}
            {!showCreateProfile && <MedallionBody />}

            {showCreateProfile && <CreateProfile setToShowCreateProfile={setToShowCreateProfile} />}
        </div>
    );
}
