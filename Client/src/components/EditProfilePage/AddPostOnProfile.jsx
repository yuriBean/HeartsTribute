import { useEffect, useState } from "react"
import ChooseFile from "../ProfileManager/ChooseFile"
import Input from "../Common/Input"
import { set, useForm } from "react-hook-form"
import { uploadImage } from "../../utils/imgUploader"
import { createPost } from "../../services/profileManager.service"
import Spinner from "../Common/Spinner"
import { useParams } from "react-router-dom"
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
  const onSubmit = async (data) => {
    // e.preventDefault()
    // console.log(data)
    if (!image && !video && !videoUrl) {
      alert('Please select an image or a video or a video url')
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
        console.log("video", videoUrl)
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
      console.log(res)
    } catch (error) {
      notifyError("Failed to create post")
      console.log(error);
    } finally {
      setLoading(false)
    }

  }

  return (!loading) ? (

    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 md:mb-8 flex flex-row justify-between items-center">
        <h1 className="tracking-widest font-medium text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl">Create Post</h1>
        <button type="submit" className='button-primary py-3 px-6'>
          {
            loading ? <span className="animate-spinner border"></span> : "Post"
          }
        </button>
      </div>

      <Input register={register} title="title" label={"Title"} className={"mb-8 md:w-2/5"} type={"text"} id={"title"} name={"title"} />

      <Label htmlFor="description">Description<span className="text-red-500">*</span> </Label>
      <textarea {...register("description", { required: "required" })} className='border p-2 mb-6 rounded-md' name="description" id="description" cols="30" rows="10"></textarea>
      {
        image && <img src={URL.createObjectURL(image)} alt="post" className="w-1/2" />
      }
      <ChooseFile value={image} onSelectValue={onSelectImage} label="Add Image" id="image" name="image" accept="image/*" />
      <small className='text-gray-600 py-6 xl:text-sm'>
        OR
      </small>
      {
        video && <video src={URL.createObjectURL(video)} controls className="w-1/2" />
      }
      <ChooseFile value={video} onSelectValue={onSelectVideo} label="Add Video" id="video" name="video" accept="video/*" />
      <small className='text-gray-600 py-6 xl:text-sm'>
        OR
      </small>
      {/* Input for videoUrl */}
      <div className="relative flex flex-col w-full">
        {
          videoUrl && <video src={videoUrl} controls className="w-1/2" />
        }
        <Label htmlFor="video">YouTube Video Link</Label>
        <input
          className='border p-2 mb-6 rounded-md'
          type="text"
          id="video"
          name="video"
          value={videoUrl}
          onChange={onVideoUrlChange}
        />
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