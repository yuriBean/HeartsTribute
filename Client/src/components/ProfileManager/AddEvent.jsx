import ChooseFile from "./ChooseFile";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../Common/Input";
import { addEvent } from "../../services/profileManager.service";
import { uploadImage } from "../../utils/imgUploader";
import Spinner from "../Common/Spinner";
import { notifyError, notifySuccess } from "../../utils/toastNotifications";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../Providers/EditProfileProvider";
import { Label } from "./AddPost";

export default function AddEvent() {
  const { profile_id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getEvents } = useProfile();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSelectImage = (e) => {
    setImage(e);
  };

  const getImgURL = async () => {
    if (image) {
      try {
        const res = await uploadImage(image, user.id, profile_id);
        return res;
      } catch (error) {
        console.log("Failed to get Image URL");
        notifyError("Failed to upload Image. Please try again.");
        return null;
      }
    }
    return null;
  };

  const onSubmit = async ( data) => {
    if (image === null || errors.length > 0) {
      notifyError("All Fields are required. Please fill all the fields.");
      return;
    }

    const isImage = (file) => file && file.type.startsWith('image/');
  
    if (image && !isImage(image)) {
      notifyError("Uploaded media must be an image");
      return;
    }

    setLoading(true);
    data.profile_id = profile_id;
    [data.image] = await Promise.all([getImgURL()]);
    try {
      await addEvent(data);
      reset();
      setImage(null);
      notifySuccess("Milestone Added Successfully");
      getEvents();
      navigate(-1);
    } catch (error) {
      console.log(error.message);
      notifyError("Failed to Add Milestone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return !loading ? (
    <>
      <div className={`mb-4 flex items-center justify-between md:mb-8`}>
        <div>
          <h1
            className={`mb-3 text-xl font-medium tracking-widest md:text-2xl xl:text-3xl 2xl:text-4xl`}
          >
            Add New Milestone
          </h1>
          <p>Celebrate important moments and achievements by adding milestones to the timeline. Capture significant events and create a visual journey of memorable occasions.</p>
        </div>
      </div>
      <form
        className="flex flex-col space-y-4 md:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          register={register}
          errors={errors}
          name="event_name"
          type="text"
          label="Milestone Name"
          id="event_name"
          placeholder={"Add Milestone Name"}
          className="px-4 py-3 tracking-wider"
        />
                <Label>Description</Label>
        <textarea
          {...register("description")}
          className="rounded-md border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Add Milestone Description"
        />

        <Input
          register={register}
          errors={errors}
          type={"date"}
          label="Milestone Date"
          id="event_date"
          name="event_date"
          className="w-2/3 md:w-1/6 px-4 py-3 tracking-wider"
        />

      <div className="md:col-span-2 flex gap-3 items-center">
            <div className=" sm:w-full">
        <ChooseFile
          value={image}
          label="Choose Milestone Image"
          id="event_image"
          name="event_image"
          accept="image/*"
          onSelectValue={onSelectImage}
        />
        </div>
        <div>
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
        <button className="button-primary rounded-md" type="submit">
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
            <>Add Milestone</>
          )}
        </button>
        </div>
      </form>
    </>
  ) : (
    <Spinner text="Creating Milestone..." />
  );
}
