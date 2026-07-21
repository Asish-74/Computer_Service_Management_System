import axiosClient from "../api/axiosClient";

const API = {
  LOGIN: "/api/technician/login",

  DASHBOARD: "/api/technician/dashboard",

  REQUESTS: "/api/technician/requests",

  UPDATE_STATUS: "/api/technician/update-status",

  UPDATE_PROFILE: "/api/technician/profile",
};

const technicianService = {
  // ==========================
  // Login
  // ==========================

  async login(loginData) {
    const response = await axiosClient.post(
      API.LOGIN,
      loginData
    );

    return response.data.data;
  },

  // ==========================
  // Dashboard
  // ==========================

  async getDashboard() {
    const response = await axiosClient.get(
      API.DASHBOARD
    );

    return response.data.data;
  },

  // ==========================
  // Assigned Requests
  // ==========================

  async getAssignedRequests() {
    const response = await axiosClient.get(
      API.REQUESTS
    );

    return response.data.data;
  },

  // ==========================
  // Update Request Status
  // ==========================

  async updateStatus(statusData) {
    const response = await axiosClient.put(
      API.UPDATE_STATUS,
      statusData
    );

    return response.data.data;
  },

  // ==========================
  // Update Technician Profile
  // ==========================

  async updateProfile(profileData) {
    const response = await axiosClient.put(
      API.UPDATE_PROFILE,
      profileData
    );

    return response.data.data;
  },
};

export default technicianService;