import { useState, useEffect, useCallback } from "react";
import { Label } from "./AddPostOnProfile";
import ToggleSwitch from "../Common/ToggleSwitch";
import ChooseFile from "../ProfileManager/ChooseFile";
import {
  editProfileWithId,
} from "../../services/profileManager.service";
import InputForEdit from "../Common/InputForEdit";
import { uploadImage } from "../../utils/imgUploader";
import Spinner from "../Common/Spinner";
import { useProfile } from "../Providers/EditProfileProvider";
import { notifySuccess } from "../../utils/toastNotifications";
import debounce from "lodash.debounce"; 
import { useNavigate } from "react-router-dom";

export default function EditProfileForm() {
  const { profile, loading, setLoading, getProfile } = useProfile();
  const [modifiedData, setModifiedData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [checker, setChecker] = useState(true);
  const [donationEnabled, setDonationEnabled] = useState(false);
  const [donationProfiles, setDonationProfiles] = useState([]);
  const [nextProjectId, setNextProjectId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [donationProfilesLoading, setDonationProfilesLoading] = useState(false);
  const [donationProfileID, setDonationProfileID] = useState(null);
  const user = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : null;
  const [searchTerm, setSearchTerm] = useState("");
  const [allProfiles, setAllProfiles] = useState([]);
  const navigate = useNavigate();
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
        modifiedData.profile_picture = await uploadImage(profilePicture, user.id, profile.id);
      }
      if (coverPicture.name !== profile.cover_picture) {
        console.log(coverPicture);
        modifiedData.cover_picture = await uploadImage(coverPicture, user.id, profile.id);
      }

      //   check if donation profile is enabled
      if (donationEnabled && donationProfileID) {
        modifiedData.donation_profile_id = donationProfileID;
        let currentProfile = donationProfiles.find(
          (profile) => profile.id == donationProfileID
        );
        modifiedData.donation_profile_title = currentProfile
          ? currentProfile.title
          : profile.donation_profile_title;
      }
      if (!donationEnabled) {
        modifiedData.donation_profile_id = null;
        modifiedData.donation_profile_title = null;
      }
      const update = await editProfileWithId(profile.id, modifiedData);
      console.log(update);

      // refresh page
      // window.location.reload()
      await getProfile();
      notifySuccess("Profile Updated Successfully");
      navigate(-1);
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

  const fetchProfilesInBatches = async (initialCall = true) => {
    let combinedProfiles = [];
    let nextId = initialCall ? null : nextProjectId;
    const maxCalls = 20;
    let calls = 0;

    setLoading(true);

    while (calls < maxCalls) {
      let url = `https://api.globalgiving.org/api/public/projectservice/all/projects/active/summary.json?api_key=effb307b-a845-4e62-8146-2300502217ac`;

      if (nextId) {
        url += `&nextProjectId=${nextId}`;
      }

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        combinedProfiles = [...combinedProfiles, ...data.projects.project];
        nextId = data.projects.nextProjectId;

        // Stop if there are no more profiles to fetch
        if (!data.projects.hasNext) {
          break;
        }
      } catch (error) {
        console.log(error);
        break;
      }

      calls++;
    }

    setAllProfiles((prevProfiles) => [...prevProfiles, ...combinedProfiles]);
    setNextProjectId(nextId);
    setLoading(false);
  };

  // Trigger filtering when the button is clicked
  useEffect(() => {
    const filtered = allProfiles.filter((profile) =>
      profile.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDonationProfiles(filtered);
  }, [searchTerm, allProfiles]);

  // Clear profiles and fetch anew
  const fetchNewProfiles = () => {
    setAllProfiles([]);
    setNextProjectId(null);
    fetchProfilesInBatches(true); // Initial call
  };

  useEffect(() => {
    fetchProfilesInBatches();
  }, []);
  
  useEffect(() => {
    if (profile) {
      setProfilePicture({ name: profile?.profile_picture });
      setCoverPicture({ name: profile?.cover_picture });
      setChecker(profile?.visibility);
      setDonationEnabled(profile?.donation_profile_id ? true : false);
      setDonationProfileID(profile?.donation_profile_id);
    }
  }, [profile]);

  useEffect(() => {
    console.log(modifiedData);
  }, [modifiedData]);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return !loading ? (
    <div className="mt-4 px-6 py-4 shadow-md md:px-12 md:py-8">
      <div className="mb-4 md:mb-12 text-center">
        <h1 className="text-2xl font-semibold tracking-widest md:text-2xl xl:text-3xl 2xl:text-4xl">
          Edit Profile
        </h1>
      </div>

      <div className="mb-4 space-x-4 flex "></div>
      <form className="flex flex-col" onSubmit={onSubmit}>
        {/* <h3 className="mb-2 text-sm tracking-wider md:text-base">
          Edit Your Personal Information
        </h3> */}
        <hr />
        <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
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
          {profile?.profile_type == "human" && (
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
          {profile?.profile_type == "pet" && (
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
          <div className="md:col-span-2">
            <InputForEdit
              value={profile?.memorial_video}
              handleChange={handleChange}
              modifiedData={modifiedData}
              type="text"
              name="memorial_video"
              placeholder= {"Enter the YouTube video link"}
              label={
                <>Memorial Video Link (Optional)
                  <br></br><small>Please provide a YouTube video link to share a memorial video. Only YouTube links are supported.</small>

                </>}
              id="memorial_video"
              className="px-4 py-3 tracking-wider"
            />

            <br />
            <Label>
              Bio<span className="text-red-500">*</span>
            </Label>
            <br />
            <textarea
              className="px-4 py-3 tracking-wider w-full border rounded-md"
              name="bio"
              // value={modifiedData.bio || profile?.bio}
              placeholder={"Provide a brief biography or share special memories,anecdotes, or significant life events. This will help others remember and celebrate their life."}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <br />
        <h3 className="mb-2 text-sm tracking-wider md:text-base">Lifetime</h3>
        <hr />
        <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
          {/* for birth_date and death_date  */}
          <InputForEdit
            value={profile?.birth_date}
            handleChange={handleChange}
            modifiedData={modifiedData}
            type="date"
            name="birth_date"
            label="Date Of Birth"
            id="birth_date"
            className="px-4 py-3 tracking-wider"
          />
          <InputForEdit
            value={profile?.death_date}
            handleChange={handleChange}
            modifiedData={modifiedData}
            type="date"
            name="death_date"
            label={
              <>
                Date Of Passing <small className="text-xs">(leave blank if not applicable)</small>
              </>           }
            id="death_date"
            className="px-4 py-3 tracking-wider"
          />
        </div>
        {profile?.profile_type == "human" && (
          <>
            <br />
            <h3 className="mb-2 text-sm tracking-wider md:text-base">
              Location
            </h3>
            <hr />
            <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
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
              <InputForEdit
                value={profile?.country}
                handleChange={handleChange}
                modifiedData={modifiedData}
                type="text"
                name="country"
                label="Country"
                id="country"
                className="px-4 py-3 tracking-wider"
              />
            </div>
            <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
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
          Donate in Their Memory
        </h3>
        <hr />
        <div className="mb-4 space-x-4 mx-auto">
          {profile?.donation_profile_title && (
            <p className="text-sm font-semibold">
              Current Selected Charity: {profile?.donation_profile_title}
            </p>
          )}
        </div>
        <div className="mb-4 space-x-4 mx-auto">
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
        <>
          <p className="text-sm md:text-lg my-2">
            Honor the memory of your loved one by supporting a cause close to their heart. Type the charity name in the search box and select a charity from the list.
          </p>
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700">Search Charity List</label>
            <small>List of charities may take a few seconds to load.</small>
            <div className="flex"></div>
            <input
                type="text"
                className="border p-2 mb-2 rounded-md w-full md:w-80"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
              type="button"
                className="bg-primary text-white p-2 rounded-md ml-2"
                onClick={fetchNewProfiles}
              >
                Search
              </button>
          </div>
          <div className="mt-4">
          {loading && <p>Loading profiles...</p>}
            <ul className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
              {donationProfiles.length > 0 ? (
                donationProfiles.map((profile) => (
                  <li
                    key={profile.id}
                    className={`p-2 cursor-pointer rounded-md ${
                      donationProfileID === profile.id ? "bg-blue-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setDonationProfileID(profile.id)}
                  >
                    <p>{profile.title}</p>
                  </li>
                ))
              ) : (
                <li>No profiles found.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
        <br />
        <h3 className="mb-2 text-sm tracking-wider md:text-base">
          Profile Visibility
        </h3>
        <hr />
        <div className="flex space-x-4 mx-auto">
          <Label>Make Profile Private</Label>
          <ToggleSwitch
            checker={!checker}
            onClick={() => {
              setChecker(!checker);
              handleChange("visibility", !checker);
            }}
          />
        </div>
        {!checker && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            You can manage access to this profile from the profile page.
          </p>
          )}
        <div className="flex justify-end gap-2">
        <button onClick={handleCancel} className="mt-4 cursor-default self-end rounded-md bg-red-500 px-8 py-2 text-sm font-bold text-white outline-none md:py-3 md:text-base xl:text-lg">
          Cancel
        </button>

        <button className="mt-4 cursor-default self-end rounded-md bg-[#346164] px-8 py-2 text-sm font-bold text-white outline-none md:py-3 md:text-base xl:text-lg">
          Save Changes
        </button>
        </div>
      </form>
    </div>
  ) : (
    <Spinner text="Updating profile..." />
  );
}