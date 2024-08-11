import { useState, useEffect } from "react"
import { getUserWithEmail, updateUserWithId } from "../../services/userProfile.service";
import { useAuth } from "../../utils/AuthContext"
import InputForEdit from "../Common/InputForEdit";
import Spinner from "../Common/Spinner";
import { useProfileManager } from "../Providers/ProfileManagerProvider";
import { notifyError , notifySuccess } from "../../utils/toastNotifications";


export default function EditProfile() {
  const [loading, setLoading] = useState(false)
  const [currentData, setCurrentData] = useState({});
  const [modifiedData, setModifiedData] = useState({});
  const { user } = useAuth();
  const { managerProfile, getManagerProfile } = useProfileManager();
  const handleChange = (name, value) => {
    setModifiedData((prev) => ({ ...prev, [name]: value }))
    // }
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    console.log(modifiedData || "Nothing to update")
    try {
      if (Object.keys(modifiedData).length === 0) {
        alert("Nothing to update")
        return;
      }
      setLoading(true)
      const update = await updateUserWithId(currentData.id, modifiedData);
      await fetchUser(true)
      notifySuccess("Profile updated successfully")
      setLoading(false)
    } catch (error) {
      console.log(error)
      notifyError("Something went wrong. Try again!")
    }
  }
  const fetchUser = async (updateSuccess = false) => {
    try {
      if (!managerProfile || updateSuccess) {
        setLoading(true)
        await getManagerProfile();
        setCurrentData(managerProfile);
        setLoading(false)
      }else{
        setCurrentData(managerProfile)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchUser()
  }, [])

  return (!loading) ? (
    <>
      <div className="mb-4 md:mb-8">
        <h1 className="tracking-widest font-medium text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl">Edit Your Profile</h1>
      </div>
      <form className='flex flex-col' onSubmit={onSubmit}>
        <h3 className="text-sm md:text-base tracking-wider mb-2">
          Edit Your Personal Information
        </h3>
        <hr />
        <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row my-3 md:w-2/3 md:space-x-4 ">
          <InputForEdit type="text" label="First Name" id="first_name" name="first_name" modifiedData={modifiedData} handleChange={handleChange} value={currentData?.first_name} />
          <InputForEdit type="text" label="Last Name" id="last_name" name="last_name" modifiedData={modifiedData} handleChange={handleChange} value={currentData?.last_name} />
        </div>
        <br />
        <h3 className="text-sm md:text-base tracking-wider mb-2">
          Location
        </h3>
        <hr />
        <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row my-4 md:w-2/3 md:space-x-4 ">
          <InputForEdit type="text" label="City" id="city" name="city" modifiedData={modifiedData} handleChange={handleChange} value={currentData?.city} />
          <InputForEdit type="text" label="Country" id="country" name="country" modifiedData={modifiedData} handleChange={handleChange} value={currentData?.country} />
        </div>
        <br />
        <button className="self-end mt-4 bg-[#346164] cursor-pointer outline-none font-bold text-sm md:text-base xl:text-lg text-white py-2 px-8 md:py-3  rounded-md">
          Save Changes
        </button>
      </form>
    </>
  )
    : <Spinner />
}
