import Modal from "react-modal";
import { useState, useEffect } from "react";
import { uploadImage } from "../../utils/imgUploader";
import { notifyError, notifySuccess } from "../../utils/toastNotifications";
import { useProfile } from "..//Providers/EditProfileProvider";
import { editProfileWithId } from "../../services/profileManager.service";
import { Label } from "../ProfileManager/AddPost";
import { FileUploader } from "react-drag-drop-files";
import ChooseFile from "../ProfileManager/ChooseFile";

export default function ChangeMedallionProfilePictureModal({
  isOpen,
  setIsOpen,
}) {
  const { getProfile, profile } = useProfile();
  const [file, setFile] = useState({ name: "" });
  const [currentImage, setCurrentImage] = useState(
    profile?.profile_picture || "/images/placeholder-profile.jpg"
  );
  const [loading, setLoading] = useState(false);
  const onSelectValue = (e) => {
    setFile(e);
    setCurrentImage(URL.createObjectURL(e));
  };

  const user = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : null;

  const updateProfilePicture = async (url) => {
    try {
      await editProfileWithId(profile.id, { profile_picture: url });
      setIsOpen(false);
      notifySuccess("Profile Picture Updated Successfully");
      getProfile();
    } catch (error) {
      console.error(error);
      notifyError("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file.name == currentImage || file.name == "") {
      notifyError("Please select a new image to upload");
      return;
    }
    console.log("Uploading image");
    setLoading(true);
    const url = await uploadImage(file, user.id, profile.id);
    await updateProfilePicture(url);
  };

  useEffect(() => {
    setCurrentImage(
      profile?.profile_picture || "/images/placeholder-profile.jpg"
    );
    setFile({ name: profile?.profile_picture || "" });
  }, [profile]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      shouldCloseOnOverlayClick={false}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      <form
        className="relative flex flex-col justify-center items-center space-y-4 bg-white rounded-md p-2 w-[80%] md:w-2/4 lg:w-[40%] border"
        onSubmit={onSubmit}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-2"
        >
          <img src="/images/close.svg" alt="Close" className="h-5 w-5" />
        </button>
        {!loading ? (
          <>
            <h1 className="text-lg md:text-2xl font-bold text-center tracking-widest">
              Change Profile Picture
            </h1>
            <div className="w-[200px] aspect-square rounded-full">
              <img
                src={currentImage}
                className="w-[200px] h-[200px] mx-auto rounded-full object-cover"
                alt="profile pic"
              />
            </div>
            <div className="w-4/5">
              <ChooseFile
                value={file}
                onSelectValue={onSelectValue}
                label={"Select New Picture"}
                id="new_profile_picture"
                name="new_profile_picture"
                accept={"image/*"}
              />
            </div>
            <button
              className="button-primary w-fit mx-auto py-2 "
              type="submit"
            >
              Save
            </button>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#346164]"></div>
            <br />
            <h1 className="text-2xl font-semibold ">Uploading Image...</h1>
          </div>
        )}
      </form>
    </Modal>
  );
}

