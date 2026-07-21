let sessionTimer = null;

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth")) || {};
  } catch {
    return {};
  }
};

export const saveAuth = (auth) => {
  localStorage.setItem("auth", JSON.stringify(auth));

  window.dispatchEvent(new Event("authChanged"));

  startSessionTimer(auth);
};

export const getProfileImage = (photo) => {
  if (!photo) return "";

  return `${import.meta.env.VITE_API_BASE_URL}/profile/${photo}`;
};

export const logout = (role, navigate) => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }

  localStorage.removeItem("auth");

  window.dispatchEvent(new Event("authChanged"));

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

  if (navigate) {
    navigate(loginPage, { replace: true });
  } else {
    window.location.href = loginPage;
  }
};

export const startSessionTimer = (auth) => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }

  if (!auth?.token) {
    return;
  }

  try {
    const payload = JSON.parse(atob(auth.token.split(".")[1]));

    const expiryTime = payload.exp * 1000;

    const remainingTime = expiryTime - Date.now();

    if (remainingTime <= 0) {
      logout(auth.role);
      return;
    }

    sessionTimer = setTimeout(() => {

      localStorage.setItem(
        "sessionExpired",
        "true"
      );
      logout(auth.role);
    }, remainingTime);
  } catch (error) {
    console.error(error);
  }
};