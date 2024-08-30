import { useEffect, useState } from "react";
import ChooseFile from "../ProfileManager/ChooseFile";
import Input from "../Common/Input";
import { useForm } from "react-hook-form";
import { uploadImage } from "../../utils/imgUploader";
import { createPost } from "../../services/profileManager.service";
import Spinner from "../Common/Spinner";
import { notifyError, notifySuccess } from "../../utils/toastNotifications";
import { useProfileManager } from "../Providers/ProfileManagerProvider";
import { useParams } from "react-router-dom";

export default function AddPost() {
  const { managerProfile, getPosts, getAllProfiles, profiles } =
    useProfileManager();
  const { register, handleSubmit, reset } = useForm();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const { profile_id } = useParams();

  const [videoUrl, setVideoUrl] = useState(null);
  const onSelectImage = (e) => {
    setImage(e);
    setVideo(null);
    setVideoUrl("");
  };
  const onSelectVideo = (e) => {
    setVideo(e);
    setImage(null);
    setVideoUrl("");
  };
  const onVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
    setImage(null);
    setVideo("");
  };

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

  const onSubmit = async ( data) => {
    if (!image && !video && !videoUrl) {
      alert("Please select an image or a video or a video url");
      return;
    }
    
    if (!validateMedia()) {
      return; 
    }

    try {
      setLoading(true);
      if (image) {
        data.image = await uploadImage(image, user.id, profile_id);
      }
      if (video) {
        data.video = await uploadImage(video, user.id, profile_id);
      }
      if (videoUrl != "") {
        data.video = videoUrl;
      }
      data.user_id = managerProfile.id;
      const res = await createPost(data);
      reset();
      setVideoUrl("");
      setImage(null);
      setVideo(null);
      notifySuccess("Post Created Successfully");
      await getPosts();
    } catch (error) {
      notifyError("Failed to create post");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchProfiles = async () => {
      if (profiles.length == 0) {
        setLoading(true);
        await getAllProfiles();
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const getEmbedUrl = (url) => {
    try {
      let embedUrl = '';
      
      // YouTube URL parsing
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      // Vimeo URL parsing
      else if (url.includes('vimeo.com/')) {
        const videoId = url.split('/').pop();
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      // Other platforms can be added here
      else {
        throw new Error('Unsupported video platform');
      }
  
      return embedUrl;
    } catch (error) {
      console.error('Error generating embed URL:', error);
      return '';
    }
  }
  
  return !loading ? (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col w-fit">
        <Label htmlFor="profile">
          Profile<span className="text-red-500">*</span>
        </Label>
        <select
          {...register("profile_id", { required: "required" })}
          className="border p-2 mb-6 rounded-md bg-white tracking-wider"
          name="profile_id"
          id="profile_id"
        >
          <option value="">Select Profile</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.first_name + " " + profile.last_name}
            </option>
          ))}
        </select>
      </div>

      <Input
        register={register}
        title="title"
        label={"Title"}
        className={"mb-8 md:w-2/5"}
        type={"text"}
        id={"title"}
        name={"title"}
      />

      <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
      <textarea
        {...register("description", { required: "required" })}
        className="border p-2 mb-6 rounded-md"
        name="description"
        id="description"
        cols="30"
        rows="10"
      ></textarea>
      {image && (
        <img src={URL.createObjectURL(image)} alt="post" className="mb-6 hidden sm:block" />
      )}
      <ChooseFile
        value={image}
        onSelectValue={onSelectImage}
        label="Add Image"
        id="image"
        name="image"
        accept="image/*"
      />
      <small className="text-gray-600 py-6 xl:text-sm">OR</small>
      {video && (
        <video
          src={URL.createObjectURL(video)}
          controls
          className="mb-6 hidden sm:block"
        ></video>
      )}
      <ChooseFile
        value={video}
        onSelectValue={onSelectVideo}
        label="Add Video"
        id="video"
        name="video"
        accept="video/*"
      />
      <small className="text-gray-600 py-6 xl:text-sm">OR</small>
      {/* Input for videoUrl */}
      {videoUrl && <video src={getEmbedUrl(videoUrl)} controls className="mb-6 hidden sm:block"></video>}
      <div className="relative flex flex-col w-full">
        <Label htmlFor="video">Video Url</Label>
        <input
          className="border p-2 mb-6 rounded-md"
          type="text"
          id="video"
          name="video"
          value={videoUrl}
          onChange={onVideoUrlChange}
        />
      </div>

      <button
        type="submit"
        className="bg-[#346164] text-white py-2 px-4 rounded-md font-semibold tracking-wider"
      >
        {loading ? "Creating Post..." : "Create Post"}
      </button>
    </form>
  ) : (
    <Spinner />
  );
}

export const Label = ({ children, htmlFor }) => {
  return (
    <label
      className="inline text-lg font-light tracking-wider mb-1"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};
