import axiosClient from "../api/axiosClient";

const BASE_URL = "/api/review";

const reviewService = {

    saveReview: async (review) => {

        const response = await axiosClient.post(
            BASE_URL,
            review
        );

        return response.data.data;

    },

    getAllReviews: async () => {

        const response = await axiosClient.get(
            `${BASE_URL}/all`
        );

        return response.data.data;

    },

    getUserReviews: async (userId) => {

        const response = await axiosClient.get(
            `${BASE_URL}/user/${userId}`
        );

        return response.data.data;

    },

    getTechnicianReviews: async (technicianId) => {

        const response = await axiosClient.get(
            `${BASE_URL}/technician/${technicianId}`
        );

        return response.data.data;

    }

};

export default reviewService;