import { useState, useEffect, useCallback } from "react";
import ChooseFile from "./ChooseFile";
import { Label } from "./AddPost";
import { CreateNewProfile, linkProfileToQR, getUserProfiles, createQRCode } from "../../services/profileManager.service";
import { uploadImage } from "../../utils/imgUploader";
import { useForm } from "react-hook-form";
import Input from "../Common/Input";
import Spinner from "../Common/Spinner";
import ToggleSwitch from "../Common/ToggleSwitch";
import { notifySuccess, notifyError } from "../../utils/toastNotifications";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";

export default function CreateProfile() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [profileType, setProfileType] = useState("human");
  const [donationEnabled, setDonationEnabled] = useState(false);
  const [donationProfiles, setDonationProfiles] = useState([]);
  const [donationProfilesLoading, setDonationProfilesLoading] = useState(false);
  const [donationProfileID, setDonationProfileID] = useState(null);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileSelection, setShowProfileSelection] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qrid = searchParams.get("qrid");
  const { profile_id } = useParams();
  const [nextProjectId, setNextProjectId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);

  const handleProfileTypeChange = (e) => {
    setProfileType(e.target.value);
    reset();
    setCoverPicture(null);
    setProfilePicture(null);
  };
  const onSelectProfilePicture = async (e) => {
    setProfilePicture(e);
  };
  const onSelectCoverPicture = (e) => {
    setCoverPicture(e);
  };
  const getProfileURL = async () => {
    if (profilePicture) {
      try {
        const res = await uploadImage(profilePicture, user.id, profile_id);
        return res;
      } catch (error) {
        console.log("Failed to get Profile URL");
        return null;
      }
    }
    return null;
  };
  const getCoverURL = async () => {
    if (coverPicture) {
      try {
        const res = await uploadImage(coverPicture, user.id, profile_id);
        return res;
      } catch (error) {
        console.log("Failed to get Cover URL", error);
        return null;
      }
    }
    return null; 
  };
  const onSubmit = async (data) => {
    if (profileType === "human") data.profile_type = "human";
    if (profileType === "pet") data.profile_type = "pet";
    data.visibility = profileVisibility;

    if (profilePicture === null || coverPicture === null || Object.keys(errors).length > 0) {
      alert("Fill all the required fields");
      return;
    }

    setLoading(true);

    data.profile_picture = await getProfileURL();
    data.cover_picture = await getCoverURL();
    data.created_at = new Date().toISOString();
    data.user_id = user.id;

    if (donationEnabled) {
      data.donation_profile_id = donationProfileID;
      let currentProfile = donationProfiles.find(
        (profile) => profile.id === donationProfileID
      );
      data.donation_profile_title = currentProfile.title;
    }

    const creationDate = new Date(data.created_at);
    const expiryDate = new Date(creationDate.getTime() + 45 * 24 * 60 * 60 * 1000); 
    data.expiry_date = expiryDate.toISOString(); 

    try {
      const newProfile = await CreateNewProfile(data);
      notifySuccess("Profile Created Successfully");

      if (qrid) {
        await linkProfileToQR(newProfile.id, qrid); 
      }

      reset();
      setCoverPicture(null);
      setProfilePicture(null);
      navigate(`/profile/${newProfile.id}`);
    } catch (err) {
      notifyError("Failed to activate your Tribute Tag. Please try scanning it again. If the issue persists, contact support.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfiles = async () => {
    try {
      const profiles = await getUserProfiles(user.id);
      setExistingProfiles(profiles);
      setShowProfileSelection(profiles.length > 0);
    } catch (error) {
      console.log("Failed to fetch user profiles", error);
    }
  };

  useEffect(() => {
    if (qrid) {
      fetchUserProfiles();
    }
  }, [qrid]);

  const handleProfileLinking = async (profileId) => {
    setLoading(true);
    try {
      await linkProfileToQR(profileId, qrid);
      notifySuccess("Your Tribute Tag has now been activated successfully!");
      navigate(`/profile/${profileId}`);
    } catch (error) {
      notifyError("Failed to link profile");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // const [interval, setInterval] = useState(2000);
  // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchProfilesInBatches = async (initialCall = true) => {
    let combinedProfiles = [];
    let nextId = initialCall ? null : nextProjectId;
    const maxCalls = 20;
    let calls = 0;

    // setLoading(true);

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
        // setAllProfiles((prevProfiles) => [...prevProfiles, ...combinedProfiles]);
        // Stop if there are no more profiles to fetch
        if (!data.projects.hasNext) {
          break;
        }
        
        // await delay(interval);
      } catch (error) {
        console.log(error);
        break;
      }

      calls++;
    }

    setAllProfiles((prevProfiles) => [...prevProfiles, ...combinedProfiles]);
    setNextProjectId(nextId);
    // setLoading(false);
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

 return !loading ? (
    <div className="mt-4 px-6 py-4 shadow-md md:px-12 md:py-8">
      <div className="mb-4 md:mb-12 text-center">
        <h1 className="text-2xl font-semibold tracking-widest md:text-2xl xl:text-3xl 2xl:text-4xl">
          Create new Profile
        </h1>
      </div>

      <div className="mb-4 space-x-4 flex justify-center">
        <Label>
          <input
            type="radio"
            value="human"
            checked={profileType === "human"}
            onChange={handleProfileTypeChange}
            className="mr-2"
          />
          Human
        </Label>
        <Label>
          <input
            type="radio"
            value="pet"
            checked={profileType === "pet"}
            onChange={handleProfileTypeChange}
            className="mr-2"
          />
          Pet
        </Label>
      </div>

      {showProfileSelection && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Link Existing Profile</h3>
          <select
            className="w-full p-2 border rounded-md"
            onChange={(e) => handleProfileLinking(e.target.value)}
          >
            <option value="">Select a profile to link</option>
            {existingProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.first_name} {profile.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-2 text-sm tracking-wider md:text-base">
          {profileType == "human" ? (
            <>Add Person's Information</>
          ) : (
            <>Add your pet's Information</>
          )}
        </h3>
        <hr />
        <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
          <Input
            register={register}
            name={"first_name"}
            type="text"
            label={profileType === "human" ? "First Name" : "Name"}
            id="first_name"
            placeholder={profileType === "human" ? "Robert" : "Bear"}
            className="px-4 py-3 tracking-wider"
          />

          {profileType === "human" && (
            <>
              <Input
                register={register}
                name={"last_name"}
                type="text"
                label="Last Name"
                id="last_name"
                placeholder={"Hawke"}
                className="px-4 py-3 tracking-wider"
              />
              <Input
                register={register}
                name={"nickname"}
                type="text"
                label="Nickname"
                id="nickname"
                placeholder={"Bobby"}
                required={false}
              />
              <Input
                register={register}
                name={"hobbies"}
                type="text"
                label="Hobbies"
                id="hobbies"
                placeholder={"Playing Guitar"}
                required={false}
              />
            </>
          )}
          {profileType == "pet" && (
            <>
              <Input
                register={register}
                name={"breed"}
                type="text"
                label={"Breed"}
                id="breed"
                placeholder={"Labrador"}
                className="px-4 py-3 tracking-wider"
              />
              <Input
                register={register}
                name={"favorite_treats"}
                type="text"
                label={"Favorite Tricks & Treats"}
                id="favorite_treats"
                placeholder={"Peanut Butter, Carrot"}
                className="px-4 py-3 tracking-wider"
                required={false}
              />
              <Input
                register={register}
                name={"favorite_places"}
                type="text"
                label={"Favorite Places"}
                id="favorite_places"
                placeholder={"Central Park"}
                className="px-4 py-3 tracking-wider"
                required={false}
              />
            </>
          )}
          <div className="md:col-span-2">
            {/* Show image when selected */}
            {profilePicture && (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile Picture"
                className="w-[200px] h-[200px] mx-auto rounded-full object-cover"
              />
            )}
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
            {/* Show image when selected */}
            {coverPicture && (
              <img
                src={URL.createObjectURL(coverPicture)}
                alt="Profile Picture"
                className="aspect-ratio mx-auto"
              />
            )}
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
            <Input
              register={register}
              name="memorial_video"
              type="text"
              label="YouTube Video Link(Optional)"
              id="memorial_video"
              placeholder={"Memorial Video URL"}
              className="px-4 py-3 tracking-wider"
              required={false}
            />
          </div>
          <div className="md:col-span-2">
            <Label>
              Bio<span className="text-red-500">*</span>
            </Label>
            <br />
            <textarea
              className="border p-2 mb-6 rounded-md w-full"
              {...register("bio", {
                required: `bio is required`,
              })}
              rows={6}
            />
          </div>
        </div>
        <br />
        <h3 className="mb-2 text-sm tracking-wider md:text-base">Lifetime</h3>
        <hr />
        <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
          <Input
            register={register}
            type={"date"}
            label="Date Of Birth"
            id="birth_date"
            name="birth_date"
          />
          <Input
            register={register}
            type={"date"}
            label="Date Of Passing"
            id="death_date"
            name="death_date"
          />
        </div>
        <br />
        {profileType == "human" && (
          <>
            <h3 className="mb-2 text-sm tracking-wider md:text-base">
              Location
            </h3>
            <hr />
            <div className="my-4 flex flex-col space-y-1 md:col-span-2 md:w-2/3 md:flex-row md:space-x-4 md:space-y-0 mx-auto">
              <Input
                register={register}
                name={"city"}
                type="text"
                label="City"
                id="city"
                Pm
              />
              <Input
                register={register}
                name={"state"}
                type="text"
                label="State"
                id="state"
              />
              <Input
                register={register}
                name={"country"}
                type="text"
                label="Country"
                id="country"
              />
              {/* for cemetery_location , funeral_date, nickname, hobbies */}
            </div>
            <div className="my-3 grid grid-cols-1 gap-y-2 md:w-2/3 md:grid-cols-2 md:gap-x-4 md:gap-y-4 md:space-y-0 mx-auto">
              <Input
                register={register}
                name={"cemetery_location"}
                type="text"
                label="Cemetery Location"
                id="cemetery_location"
                required={false}
              />
              <Input
                register={register}
                name={"funeral_date"}
                type="date"
                label="Funeral Date"
                id="funeral_date"
                required={false}
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
          <Label>
            <input
              type="radio"
              value={true}
              checked={donationEnabled}
              onChange={() => {setDonationEnabled(true); fetchProfilesInBatches(true)}}
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
                <li>Loading...</li>
              )}
            </ul>
          </div>
        </>
      )}
              <br />
        <h3 className="mb-2 text-sm tracking-wider md:text-base">
          Profile Visibility
        </h3>
        <hr />
        <br />
        <div className="flex space-x-4 mx-auto">
          <Label>Make profile private</Label>
          <ToggleSwitch
            checker={!profileVisibility}
            onClick={() => setProfileVisibility(!profileVisibility)}
          />
        </div>

    </div>
        <button className="mt-20 cursor-pointer self-end rounded-md bg-[#346164] px-8 py-2 text-sm font-bold text-white outline-none md:py-3 md:text-base xl:text-lg">
          {loading ? (
            <svg
              aria-hidden="true"
              class="h-8 w-8 animate-spin fill-black text-gray-200 dark:text-primary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </form>
    </div>
  ) : (
    <Spinner />
  );
}
