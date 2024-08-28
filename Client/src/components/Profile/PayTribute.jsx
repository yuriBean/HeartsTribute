import { useState } from "react";
import ChooseFile from "../ProfileManager/ChooseFile";
import { useForm } from "react-hook-form";
import Input from "../Common/Input";
import { AddNewTribute } from "../../services/profileManager.service";
import { uploadImage } from "../../utils/imgUploader";
import Spinner from "../Common/Spinner";
import { notifySuccess, notifyError } from "../../utils/toastNotifications";
import { usePublicProfile } from "../Providers/PublicProfileProvider";
import { useNavigate } from "react-router-dom";
import { Label } from "../ProfileManager/AddPost";

export default function PayTribute({ setShow }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { profile, getTributes } = usePublicProfile();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSelectImage = (e) => {
    setImage(e);
  };

  const getImgURL = async () => {
    if (image) {
      try {
        const res = await uploadImage(image, user.id, profile.id);
        console.log("Tribute Image available at ", res);
        return res;
      } catch (error) {
        console.log("Failed to get Image URL");
        return null;
      }
    }
    return null;
  };

  const onSubmit = async (data) => {
    if (errors.length > 0) {
      alert("Fill all the fields");
      return;
    }
    setLoading(true);
    data.image = await getImgURL();
    data.display_name =
      user.first_name || user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email;
    data.profile_id = profile.id;
    data.created_by = user.id;
    try {
      await AddNewTribute(data);
      reset();
      setImage(null);
      notifySuccess("Tribute Added");
      getTributes();
      setShow(false);
      console.log("Tribute Added");
    } catch (error) {
      console.log(error.message);
      notifyError("Failed to Add Tribute");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShow(false);    
  }
  
  return !loading ? (
    <div className="px-8 py-10">
      {!user ? (
        <div className="text-center text-lg font-semibold text-gray-500">
          Please login to pay tribute
        </div>
      ) : (
        <form
          className="flex flex-col space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-lg mb-3">Honor loved ones by adding personal messages and memories. Create and share a heartfelt tribute easily.</p>
          <Label>Add Tribute</Label>
          <textarea {...register("title", { required: "required" })}
            errors={errors}
            name="title"
            type="text"
            label="Tribute Text"
            id="title"
            placeholder={"Add Tribute Text"}
            className="px-4 py-3 tracking-wider"
          ></textarea>
        <div className="flex gap-3 items-center">
        <div className=" sm:w-full">
        
          <ChooseFile
            value={image}
            label="Upload Tribute Image (Optional)"
            id="tribute_image"
            name="tribute_image"
            accept="image/*"
            onSelectValue={onSelectImage}
            
          /></div>
          <div className="">
            {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Profile Picture"
              className="w-40 h-40 mx-auto object-cover hidden sm:block"
            />
          )}</div>

          </div>
          <div className="flex justify-end gap-2">
          <button onClick={handleCancel} className="button-primary bg-red-500">
          Cancel
        </button>

          <button className="button-primary">
            {loading ? (
              <svg
                aria-hidden="true"
                className="h-8 w-8 animate-spin fill-black text-gray-200 dark:text-primary"
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
              <>Add Tribute</>
            )}
          </button>
        </div>
        </form>
      )}
    </div>
  ) : (
    <Spinner text="Paying Tribute..." />
  );
}
