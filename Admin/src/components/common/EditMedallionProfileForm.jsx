import { useState, useEffect } from "react";
import { Label } from "./Label";
import ToggleSwitch from "./ToggleSwitch";
import ChooseFile from "./ChooseFile";
import { editProfileWithId } from "../../services/admin.service";
import { uploadImage } from "../../queries/imgUploader";
import InputForEdit from "./InputForEdit";

export default function EditProfileForm({ profile, setIsOpen }) {
    const [loading, setLoading] = useState(false);
    const [modifiedData, setModifiedData] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const [checker, setChecker] = useState(true);
    const [donationEnabled, setDonationEnabled] = useState(false);
    const [donationProfiles, setDonationProfiles] = useState([]);
    const [nextID, setNextID] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [donationProfilesLoading, setDonationProfilesLoading] =
        useState(false);
    const [donationProfileID, setDonationProfileID] = useState(null);
    const onSelectProfilePicture = (e) => {
        setProfilePicture(e);
    };
    const onSelectCoverPicture = (e) => {
        setCoverPicture(e);
    };
    const onSubmit = async (e) => {
        e.preventDefault();

        if (
            Object.keys(modifiedData).length === 0 &&
            profilePicture.name !== profile.profile_picture &&
            coverPicture.name !== profile.cover_picture
        ) {
            alert("Nothing to update");
            return;
        }
        try {
            setLoading(true);
            if (profilePicture.name !== profile.profile_picture) {
                console.log(profilePicture);
                modifiedData.profile_picture = await uploadImage(
                    profilePicture
                );
            }
            if (coverPicture.name !== profile.cover_picture) {
                console.log(coverPicture);
                modifiedData.cover_picture = await uploadImage(coverPicture);
            }

            //   check if donation profile is enabled
            if (donationEnabled && donationProfileID) {
                modifiedData.donation_profile_id = donationProfileID;
                let currentProfile = donationProfiles.find(
                    (profile) => profile.id == donationProfileID
                );
                modifiedData.donation_profile_title = currentProfile.title;
            }
            if (!donationEnabled) {
                modifiedData.donation_profile_id = null;
                modifiedData.donation_profile_title = null;
            }
            const update = await editProfileWithId(profile.id, modifiedData);
            console.log(update);

            // refresh page
            // window.location.reload()

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = (name, value) => {
        if (profile[name] === value) {
            const updatedData = { ...modifiedData };
            delete updatedData[name];
            setModifiedData(updatedData);
        } else {
            setModifiedData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const getProfiles = async (first) => {
        let url =
            "https://api.globalgiving.org/api/public/projectservice/all/projects/active/summary.json?api_key=effb307b-a845-4e62-8146-2300502217ac";
        try {
            if (donationEnabled) {
                if (!first && nextID) url += `&nextProjectId=${nextID}`;
                setDonationProfilesLoading(true);

                const response = await fetch(url, {
                    headers: {
                        Accept: "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setHasNext(data.projects.hasNext);
                setNextID(data.projects.nextProjectId);
                setDonationProfiles((prev) => [
                    ...prev,
                    ...data.projects.project,
                ]);
                setDonationProfilesLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onLoadMore = (e) => {
        if (e.target.value === "load_more") {
            e.preventDefault();
            getProfiles(false);
            e.target.value = "nextID"; // Reset the select value
        } else {
            setDonationProfileID(e.target.value);
        }
    };
    useEffect(() => {
        if (donationEnabled) {
            getProfiles(true);
        }
    }, [donationEnabled]);
    useEffect(() => {
        if (profile) {
            setProfilePicture({ name: profile.profile_picture });
            setCoverPicture({ name: profile.cover_picture });
            setChecker(profile.visibility);
            setDonationEnabled(profile.donation_profile_id ? true : false);
            setDonationProfileID(profile.donation_profile_id);
        }
    }, [profile]);
    useEffect(() => {
        console.log(modifiedData);
    }, [modifiedData]);

    return !loading ? (
        <div className="">
            <div className="relative mb-4 md:mb-12">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-2 top-2"
                >
                    <img
                        src="/images/close.png"
                        alt="Close"
                        className="h-5 w-5"
                    />
                </button>
                <h1 className="text-2xl font-semibold tracking-widest md:text-2xl xl:text-3xl 2xl:text-4xl">
                    Edit Profile
                </h1>
            </div>

            <form className="flex flex-col" onSubmit={onSubmit}>
                <h3 className="mb-2 text-sm tracking-wider md:text-base">
                    Edit Your Personal Information
                </h3>
                <hr />
                <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0">
                    <InputForEdit
                        value={profile?.first_name}
                        handleChange={handleChange}
                        modifiedData={modifiedData}
                        type="text"
                        name="first_name"
                        label="First Name"
                        id="first_name"
                        className="px-4 py-3 tracking-wider"
                    />
                    {profile.profile_type == "human" && (
                        <>
                            <InputForEdit
                                value={profile?.last_name}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                type="text"
                                name="last_name"
                                label="Last Name"
                                id="last_name"
                                className="px-4 py-3 tracking-wider"
                            />
                            <InputForEdit
                                value={profile?.title}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                type="text"
                                name="title"
                                label="Title"
                                id="title"
                                className="px-4 py-3 tracking-wider"
                            />
                            <InputForEdit
                                value={profile?.relation}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                type="text"
                                name="relation"
                                label="Relation"
                                id="relation"
                                className="px-4 py-3 tracking-wider"
                            />
                            <InputForEdit
                                value={profile?.nickname}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                name={"nickname"}
                                type="text"
                                label="Nickname"
                                id="nickname"
                            />
                            <InputForEdit
                                value={profile?.hobbies}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                name={"hobbies"}
                                type="text"
                                label="Hobbies"
                                id="hobbies"
                            />
                        </>
                    )}
                    {profile.profile_type == "pet" && (
                        <>
                            <InputForEdit
                                value={profile?.breed}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                name={"breed"}
                                type="text"
                                label={"Breed"}
                                id="breed"
                                className="px-4 py-3 tracking-wider"
                            />
                            <InputForEdit
                                value={profile?.favorite_treats}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                name={"favorite_treats"}
                                type="text"
                                label={"Favorite Tricks & Treats"}
                                id="favorite_treats"
                                placeholder={"Peanut Butter, Carrot"}
                                className="px-4 py-3 tracking-wider"
                            />
                            <InputForEdit
                                value={profile?.favorite_places}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                name={"favorite_places"}
                                type="text"
                                label={"Favorite Places"}
                                id="favorite_places"
                                placeholder={"Central Park, Zoo"}
                                className="px-4 py-3 tracking-wider"
                            />
                        </>
                    )}
                    <div className="md:col-span-2">
                        <ChooseFile
                            label="Choose Profile Picture"
                            id="profile_picture"
                            name="profile_picture"
                            accept="image/*"
                            onSelectValue={onSelectProfilePicture}
                            value={profilePicture}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <ChooseFile
                            label="Choose Cover Picture"
                            id="cover_picture"
                            name="cover_picture"
                            accept="image/*"
                            onSelectValue={onSelectCoverPicture}
                            value={coverPicture}
                        />
                    </div>
                    {/* Input for edit for bio */}
                    {
                        <InputForEdit
                            value={profile?.memorial_video}
                            handleChange={handleChange}
                            modifiedData={modifiedData}
                            type="text"
                            name="memorial_video"
                            label="Memorial Video URL"
                            id="memorial_video"
                            className="px-4 py-3 tracking-wider"
                        />
                    }

                    <InputForEdit
                        value={profile?.bio}
                        handleChange={handleChange}
                        modifiedData={modifiedData}
                        type="text"
                        name="bio"
                        label="Bio"
                        id="bio"
                        className="mb-6 rounded-md border p-2"
                    />
                </div>
                <br />
                <h3 className="mb-2 text-sm tracking-wider md:text-base">
                    Lifetime
                </h3>
                <hr />
                <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0">
                    {/* for birth_date and death_date  */}
                    <InputForEdit
                        value={profile?.birth_date}
                        handleChange={handleChange}
                        modifiedData={modifiedData}
                        type="date"
                        name="birth_date"
                        label="Birth Date"
                        id="birth_date"
                        className="px-4 py-3 tracking-wider"
                    />
                    <InputForEdit
                        value={profile?.death_date}
                        handleChange={handleChange}
                        modifiedData={modifiedData}
                        type="date"
                        name="death_date"
                        label="Death Date"
                        id="death_date"
                        className="px-4 py-3 tracking-wider"
                    />
                </div>
                {profile.profile_type == "human" && (
                    <>
                        <br />
                        <h3 className="mb-2 text-sm tracking-wider md:text-base">
                            Location
                        </h3>
                        <hr />
                        <div className="my-4 flex flex-col space-y-1 md:w-2/3 md:flex-row md:space-x-4 md:space-y-0">
                            {/* for City and State */}
                            <InputForEdit
                                value={profile?.city}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                type="text"
                                name="city"
                                label="City"
                                id="city"
                                className="px-4 py-3 tracking-wider"
                            />
                            <InputForEdit
                                value={profile?.state}
                                handleChange={handleChange}
                                modifiedData={modifiedData}
                                type="text"
                                name="state"
                                label="State"
                                id="state"
                                className="px-4 py-3 tracking-wider"
                            />
                        </div>
                        <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0">
                            <InputForEdit
                                name={"cemetery_location"}
                                type="text"
                                label="Cemetery Location"
                                id="cemetery_location"
                                modifiedData={modifiedData}
                                handleChange={handleChange}
                                value={profile?.cemetery_location || ""}
                            />
                            <InputForEdit
                                name={"funeral_date"}
                                type="date"
                                label="Funeral Date"
                                id="funeral_date"
                                modifiedData={modifiedData}
                                handleChange={handleChange}
                                value={profile?.funeral_date || ""}
                            />
                        </div>
                    </>
                )}
                <br />
                <h3 className="mb-2 text-sm tracking-wider md:text-base">
                    Donation Profile
                </h3>
                <hr />
                <div className="mb-4">
                    {profile.donation_profile_title && (
                        <p className="text-sm font-semibold">
                            Current Donation Profile:{" "}
                            {profile.donation_profile_title}
                        </p>
                    )}
                </div>
                <div className="mb-4 space-x-4">
                    <Label>
                        <input
                            type="radio"
                            value={true}
                            checked={donationEnabled}
                            onChange={() => setDonationEnabled(true)}
                            className="mr-2"
                        />
                        Enabled
                    </Label>
                    <Label>
                        <input
                            type="radio"
                            value={false}
                            checked={!donationEnabled}
                            onChange={() => setDonationEnabled(false)}
                            className="mr-2"
                        />
                        Disabled
                    </Label>
                </div>
                <div>
                    {donationEnabled && (
                        <select
                            className="w-full rounded-md border p-2"
                            placeholder="Select Donation Profile"
                            name="donation_profile_id"
                            onChange={(e) => onLoadMore(e)}
                        >
                            <option value="">Select Donation Profile</option>
                            {/* option to load more profiles */}
                            {donationProfilesLoading && (
                                <option value="loading">Loading...</option>
                            )}

                            {!donationProfilesLoading &&
                                donationProfiles.map((profile) => (
                                    <option value={profile.id} key={profile.id}>
                                        {profile.title}
                                    </option>
                                ))}
                            {hasNext && (
                                <option
                                    value="load_more"
                                    className="cursor-pointer"
                                >
                                    Load More...
                                </option>
                            )}
                        </select>
                    )}
                </div>
                <br />
                <h3 className="mb-2 text-sm tracking-wider md:text-base">
                    Profile Visibility
                </h3>
                <hr />
                <div className="my-4 flex flex-row justify-between space-x-4 md:w-2/3 md:justify-start">
                    <Label>Set Profile Public</Label>
                    <ToggleSwitch
                        checker={checker}
                        onClick={() => {
                            setChecker(!checker);
                            handleChange("visibility", !checker);
                        }}
                    />
                </div>
                <button className="mt-4 cursor-default self-end rounded-md bg-[#346164] px-8 py-2 text-sm font-bold text-white outline-none md:py-3 md:text-base xl:text-lg">
                    Save Changes
                </button>
            </form>
        </div>
    ) : (
        <div>Loading...</div>
    );
}
