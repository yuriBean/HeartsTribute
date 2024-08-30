import { useEffect, useState } from "react"
import ChooseFile from "../ProfileManager/ChooseFile"
import Input from "../Common/Input"
import { set, useForm } from "react-hook-form"
import { uploadImage } from "../../utils/imgUploader"
import { createPost } from "../../services/profileManager.service"
import Spinner from "../Common/Spinner"
import { useParams, useNavigate } from "react-router-dom"
import { notifyError, notifySuccess } from "../../utils/toastNotifications"
import { useProfile } from "../Providers/EditProfileProvider"

export default function AddPostOnProfile() {
  const { profile_id } = useParams();
  const { getPosts } = useProfile();
  const { reset, register, handleSubmit } = useForm();
  const user = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : null
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState("image");

  const onSelectImage = (e) => {
    setImage(e)
    setVideo(null)
    setVideoUrl("")
  }
  const onSelectVideo = (e) => {
    setVideo(e)
    setImage(null)
    setVideoUrl("")
  }
  const onVideoUrlChange = (e) => {
    setVideoUrl(e.target.value)
    setImage(null)
    setVideo("")
  }

  const validateMedia = () => {
    const isImage = (file) => file && file.type.startsWith('image/');
    const isVideo = (file) => file && file.type.startsWith('video/');

    if (image && !isImage(image)) {
      notifyError("Selected image file is not a valid image.");
      return false;
    }

    if (video && !isVideo(video)) {
      notifyError("Selected video file is not a valid video.");
      return false;
    }

    return true;
  };

  const onSubmit = async (data) => {
    if (!image && !video && !videoUrl) {
      notifyError('Please select an image or a video or a video url')
      return;
    }

    if (!validateMedia()) {
      return; 
    }

    try {
      setLoading(true)
      if (image) {
        data.image = await uploadImage(image, user.id, profile_id); // Pass user.id
      }
      if (video) {
        data.video = await uploadImage(video, user.id, profile_id); // Pass user.id
      }
      if (videoUrl != "") {
        data.video = videoUrl
      }
      data.profile_id = profile_id;
      data.user_id = user.id
      const res = await createPost(data)
      notifySuccess("Post Created Successfully")
      reset()
      setVideoUrl("")
      setImage(null)
      setVideo(null)
      await getPosts();
      navigate(-1);
    } catch (error) {
      notifyError("Failed to create post")
      console.log(error);
    } finally {
      setLoading(false)
    }

  }

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return (!loading) ? (

    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 gap-2 md:mb-8 flex flex-col justify-between">
        <h1 className="tracking-widest font-medium text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl">Add Media</h1>
        <p>You can choose to add a photo or video or a link to a Youtube video. Please only choose one option at a time.</p>
      </div>

      <Input register={register} title="title" label={"Title"} className={"mb-8 md:w-2/5"} type={"text"} id={"title"} name={"title"} {...register("title", { required: "required" })} />

      <Label htmlFor="description">Description<span className="text-red-500">*</span> </Label>
      <textarea {...register("description", { required: "required" })} className='border p-2 mb-6 rounded-md' name="description" id="description" cols="30" rows="10"></textarea>
      
      {/* Radio buttons for media type */}
      <Label>
        <p className="my-5">Select one of the options below.
           {<span className="text-red-500">*</span>}</p> 
      </Label>
      
      <div className="flex gap-4 mb-5">
        <label>
          <input
            type="radio"
            name="mediaType"
            value="image"
            checked={mediaType === "image"}
            onChange={() => setMediaType("image")}
          />{" "}
          Image
        </label>
        <label>
          <input
            type="radio"
            name="mediaType"
            value="video"
            checked={mediaType === "video"}
            onChange={() => setMediaType("video")}
          />{" "}
          Video
        </label>
        <label>
          <input
            type="radio"
            name="mediaType"
            value="videoUrl"
            checked={mediaType === "videoUrl"}
            onChange={() => setMediaType("videoUrl")}
          />{" "}
          Video URL
        </label>
      </div>

      {/* Conditional Rendering based on selected media type */}
      {mediaType === "image" && (
        <div className="flex gap-3 items-center">
        <div className=" sm:w-full">
        
          <ChooseFile
            value={image}
            onSelectValue={onSelectImage}
            label="Add Image"
            id="image"
            name="image"
            className=""
            accept="image/*"
          />
        </div>
        <div className="">
           {image && (
            <img src={URL.createObjectURL(image)} alt="post" className="w-40 h-40 object-cover mb-4 hidden sm:block" />
          )}
        </div></div>
      )}

      {mediaType === "video" && (
        <>
          {video && (
            <video src={URL.createObjectURL(video)} controls className="w-1/2 mb-4" />
          )}
          <ChooseFile
            value={video}
            onSelectValue={onSelectVideo}
            label="Add Video"
            id="video"
            name="video"
            accept="video/*"
          />
        </>
      )}

      {mediaType === "videoUrl" && (
        <div className="relative flex flex-col w-full">
          {videoUrl && <video src={videoUrl} controls className="w-1/2 mb-4" />}
          <Label htmlFor="videoUrl">YouTube Video Link</Label>
          <input
            className="border p-2 mb-6 rounded-md"
            type="text"
            id="videoUrl"
            name="videoUrl"
            value={videoUrl}
            onChange={onVideoUrlChange}
          />
        </div>
      )}

        <div className="flex justify-end gap-2">
        <button type="button" className='button-primary bg-red-500 py-3 px-6'
        onClick={handleCancel}>
          {
            loading ? <span className="animate-spinner border"></span> : "Cancel"
          }
        </button>

      <button type="submit" className='button-primary py-3 px-6'>
          {
            loading ? <span className="animate-spinner border"></span> : "Save"
          }
        </button>
        </div>

    </form>
  ) : (
    <Spinner />
  )
}

export const Label = ({ children, htmlFor }) => {
  return (
    <label className='text-lg font-light tracking-wider mb-1' htmlFor={htmlFor}>
      {children}
    </label>
  )
} 