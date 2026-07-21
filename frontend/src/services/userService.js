import axiosClient from "../api/axiosClient";

const userService = {
  async register(userData) {
    const { data } = await axiosClient.post(
      "/api/user/register",
      userData
    );
    return data.data;
  },

  async login(loginData) {
    const { data } = await axiosClient.post(
      "/api/user/login",
      loginData
    );
    return data.data;
  },

  async getDashboard() {
    const { data } = await axiosClient.get(
      "/api/user/dashboard"
    );
    return data.data;
  },

  async createServiceRequest(requestData) {
    const { data } = await axiosClient.post(
      "/api/request/create",
      requestData
    );
    return data.data;
  },

  async getMyRequests() {
    const { data } = await axiosClient.get(
      "/api/user/requests"
    );
    return data.data;
  },

  async deleteRequest(requestId) {
    const { data } = await axiosClient.delete(
      `/api/request/${requestId}`
    );
    return data.data;
  },

  async updateProfile(userData) {
    const { data } = await axiosClient.put(
      "/api/user/update",
      userData
    );
    return data.data;
  },
};

export default userService;