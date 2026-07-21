import axiosClient from "../api/axiosClient";

const API = {
  LOGIN: "/api/admin/login",

  DASHBOARD: "/api/admin/dashboard",

  USERS: "/api/admin/users",

  TECHNICIANS: "/api/admin/technicians",

  REGISTER_TECHNICIAN: "/api/admin/technician/register",

  UPDATE_TECHNICIAN: "/api/admin/technician",

  DELETE_TECHNICIAN: "/api/admin/technician",

  REQUESTS: "/api/admin/requests",

  ASSIGN_TECHNICIAN: "/api/admin/assign-technician",

  UPDATE_PROFILE: "/api/admin/profile",
};

const adminService = {
  async login(loginData) {
    const response = await axiosClient.post(API.LOGIN, loginData);
    return response.data.data;
  },

  async getDashboard() {
    const response = await axiosClient.get(API.DASHBOARD);
    return response.data.data;
  },

  async getUsers() {
    const response = await axiosClient.get(API.USERS);
    return response.data.data;
  },

  async getTechnicians() {
    const response = await axiosClient.get(API.TECHNICIANS);
    return response.data.data;
  },

  async addTechnician(technicianData) {
    const response = await axiosClient.post(
      API.REGISTER_TECHNICIAN,
      technicianData
    );

    return response.data.data;
  },

  async updateTechnician(technicianData) {
    const response = await axiosClient.put(
      API.UPDATE_TECHNICIAN,
      technicianData
    );

    return response.data.data;
  },

  async deleteTechnician(id) {
    const response = await axiosClient.delete(
      `${API.DELETE_TECHNICIAN}/${id}`
    );

    return response.data.data;
  },

  async getAllRequests() {
    const response = await axiosClient.get(API.REQUESTS);

    return response.data.data;
  },

  async assignTechnician(assignData) {
    const response = await axiosClient.post(
      API.ASSIGN_TECHNICIAN,
      assignData
    );

    return response.data.data;
  },

  async updateProfile(profileData) {
    const response = await axiosClient.put(
      API.UPDATE_PROFILE,
      profileData
    );

    return response.data.data;
  },
};

export default adminService;