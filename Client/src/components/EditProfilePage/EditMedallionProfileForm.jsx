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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const getProfiles = useCallback(
    debounce(async (searchTerm, loadMore = true) => {
      let url =
        "https://api.globalgiving.org/api/public/projectservice/all/projects/active/summary.json?api_key=effb307b-a845-4e62-8146-2300502217ac";
      if (searchTerm) {
        url += `&q=${searchTerm}`;
      }
      if (nextProjectId && loadMore) {
        url += `&nextProjectId=${nextProjectId}`;
      }

      try {
        if (donationEnabled) {
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
          
          setDonationProfiles((prevProfiles) => {
            const newProfiles = data.projects.project.filter(
              (newProfile) => !prevProfiles.some((prev) => prev.id === newProfile.id)
            );
            return [...prevProfiles, ...newProfiles];
          });
          setNextProjectId(data.projects.nextProjectId);
          setHasNext(data.projects.hasNext);
          setDonationProfilesLoading(false);
        }
      } catch (error) {
        console.log(error);
        setDonationProfilesLoading(false);
      }
    }, 5000),
    [donationEnabled, nextProjectId]
  );

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        donationProfilesLoading ||
        !hasNext
      ) {
        return;
      }
      getProfiles(null, true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getProfiles, donationProfilesLoading, hasNext]);

  // Initial fetch
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const filteredProfiles = donationProfiles.filter((profile) =>
    profile.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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

  return !loading ? (
    <div className="">
      <div className="mb-4 md:mb-12">
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
              label="Memorial Video URL"
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
              value={modifiedData.bio || profile?.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <br />
        <h3 className="mb-2 text-sm tracking-wider md:text-base">Lifetime</h3>
        <hr />
        <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0">
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
            label="Date Of Passing"
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
          Donate in Their Memory
        </h3>
        <hr />
        <div className="mb-4">
          {profile?.donation_profile_title && (
            <p className="text-sm font-semibold">
              Current Donation Profile: {profile?.donation_profile_title}
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
            <>
            <p className="text-sm md:text-lg my-2">
            Honor the memory of your loved one by supporting a cause close to their heart. Type the charity name in the search box, select a preferred charity from the dropdown list, and encourage others to donate in their name.
            </p>
            <div className="md:col-span-2 relative">
              <Label>Search Charity List</Label>
              <input
                type="text"
                className="border p-2 mb-2 rounded-md w-full"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
              />
              {isDropdownOpen && (
                <div className="absolute z-10 bg-white border rounded-md w-full">
                  <select
                    className="rounded-md border p-2 w-full"
                    placeholder="Select Donation Profile"
                    name="donation_profile_id"
                    onChange={(e) => {
                      setDonationProfileID(e.target.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <option value="">Select Charity</option>
                    {donationProfilesLoading && (
                      <option value="loading">Loading...</option>
                    )}
                    {!donationProfilesLoading &&
                      filteredProfiles.map((profile) => (
                        <option value={profile.id} key={profile.id}>
                          {profile.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              </div>
            </>
          )}
        </div>
        <br />
        <h3 className="mt-20 mb-2 text-sm tracking-wider md:text-base">
          Profile Visibility
        </h3>
        <hr />
        <div className="my-4 flex flex-row justify-between space-x-4 md:w-2/3 md:justify-start">
          <Label>Make Profile Private</Label>
          <ToggleSwitch
            checker={!checker}
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
    <Spinner text="Updating profile..." />
  );
}
