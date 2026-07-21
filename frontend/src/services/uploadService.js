import axiosClient from "../api/axiosClient";

const BASE_URL = "/api/upload";

const uploadProfilePhoto = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosClient.post(
        `${BASE_URL}/profile`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data.fileName;

};

export default {

    uploadProfilePhoto,

};