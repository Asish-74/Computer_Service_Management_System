import axiosClient from "../api/axiosClient";

const API = {

  FORGOT_PASSWORD:
    "/api/auth/forgot-password",

  VERIFY_OTP:
    "/api/auth/verify-otp",

  RESET_PASSWORD:
    "/api/auth/reset-password",

};

const authService = {

  async forgotPassword(email) {

    const response =
      await axiosClient.post(

        API.FORGOT_PASSWORD,

        { email }

      );

    return response.data;

  },

  async verifyOtp(email, otp) {

    const response =
      await axiosClient.post(

        API.VERIFY_OTP,

        {
          email,
          otp,
        }

      );

    return response.data;

  },

  async resetPassword(
    email,
    newPassword
  ) {

    const response =
      await axiosClient.post(

        API.RESET_PASSWORD,

        {
          email,
          newPassword,
        }

      );

    return response.data;

  },

};

export default authService;