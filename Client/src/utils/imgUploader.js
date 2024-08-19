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
            console.log('Uploaded a file!   ', response.data.url);
            return response.data.url;
        } else {
            console.error('Error uploading image: ', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error uploading image: ', error);
        return null;
    }
};

export { uploadImage };
