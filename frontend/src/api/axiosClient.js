import axios from "axios";

let isRedirecting = false;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// Request Interceptor
// =============================
axiosClient.interceptors.request.use(
  (config) => {

    const auth = JSON.parse(
      localStorage.getItem("auth")
    );

    const isLoginRequest =
      config.url?.includes("/login");

    if (auth?.token && !isLoginRequest) {

      config.headers.Authorization = `Bearer ${auth.token}`;

    } else {

      delete config.headers.Authorization;

    }

    return config;

  },
  (error) => Promise.reject(error)
);

// =============================
// Response Interceptor
// =============================
axiosClient.interceptors.response.use(

  (response) => {

    isRedirecting = false;

    return response;

  },

  (error) => {

    const status = error?.response?.status;

    const currentPath = window.location.pathname;

    const loginPages = [
      "/login",
      "/admin/login",
      "/technician/login",
    ];

    if (

      (status === 401 || status === 403) &&

      !loginPages.includes(currentPath) &&

      !isRedirecting

    ) {

      isRedirecting = true;

      const auth = JSON.parse(
        localStorage.getItem("auth")
      );

      const role = auth?.role;

      localStorage.removeItem("auth");

      localStorage.setItem(
        "sessionExpired",
        "true"
      );

      window.dispatchEvent(
        new Event("authChanged")
      );

      let loginPage = "/login";

      switch (role) {

        case "ADMIN":
          loginPage = "/admin/login";
          break;

        case "TECHNICIAN":
          loginPage = "/technician/login";
          break;

        default:
          loginPage = "/login";

      }

      window.location.replace(loginPage);

    }

    return Promise.reject(error);

  }

);

export default axiosClient;