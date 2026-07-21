import axiosClient from "../api/axiosClient";

const API = {

  GET_ALL_ACTIVITY_LOGS:
    "/api/admin/activity-logs",

};

const activityLogService = {

  async getAllActivities() {

    const response =
      await axiosClient.get(
        API.GET_ALL_ACTIVITY_LOGS
      );

    return response.data.data;

  },

};

export default activityLogService;