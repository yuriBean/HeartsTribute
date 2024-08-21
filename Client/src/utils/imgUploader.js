import axios from "axios";

const uploadImage = async (file, userId, profileId) => { // Added userId parameter
    if (!file || !file.type.startsWith('image/')) {
        console.error('Invalid file type. Please upload an image.');
        return null;
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`https://api.heartstribute.com/api/upload/${userId}/${profileId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            let fileUrl = response.data.url;
            console.log('Uploaded a file!   ', fileUrl);
            if (fileUrl.includes('heartstribute.bucketProfileManager')) {
                fileUrl = fileUrl.replace('heartstribute.bucketProfileManager', 'heartstribute.bucket/ProfileManager');
            }
            console.log('Uploaded a file!   ', fileUrl);
            return fileUrl;
        } else {
            console.error('Error uploading image: ', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error uploading image: ', error);
        return null;
    }
};

const deleteFolder = async (userId, profileId) => {
    try {
      const response = await axios.delete(`https://b6e5.c19.e2-5.dev/heartstribute.bucket/ProfileManager/${userId}/${profileId}/`);
      console.log('Profile deleted successfully:', response.data);
    } catch (error) {
      console.error('Error deleting profile:', error.response ? error.response.data : error.message);
    }
  };
  

export { uploadImage, deleteFolder };
