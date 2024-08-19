import axios from "axios";

const uploadImage = async (file, userId, qr = false) => { // Added userId parameter
    try {
        // Create a new FormData object and append the file to it
        const formData = new FormData();
        formData.append('file', file);
        formData.append('qr', qr);

        // Make the POST request to the /upload endpoint
        const response = await axios.post(`https://api.heartstribute.com/api/upload/QRCodes/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Handle the response and extract the file URL
        if (response.status === 200) {
            console.log('Uploaded a file!');
            const fileUrl = response.data.url;
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


export { uploadImage }
