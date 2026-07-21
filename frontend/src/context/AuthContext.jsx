// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// // IMPORTANT: this must stay in sync with the "auth" key used everywhere
// // else in the app (ProtectedRoute, Navbar, Sidebar, login pages, and all
// // dashboards read/write localStorage.getItem/setItem("auth") directly).
// // Using a different key here would create a second, out-of-sync session
// // store the rest of the app never sees.
// const AUTH_STORAGE_KEY = "auth";

// function readStoredAuth() {
//   const stored = localStorage.getItem(AUTH_STORAGE_KEY);

//   if (!stored) {
//     return null;
//   }

//   try {
//     const parsed = JSON.parse(stored);
//     return parsed && typeof parsed === "object" ? parsed : null;
//   } catch (error) {
//     console.error("Corrupted auth data in localStorage, clearing it:", error);
//     localStorage.removeItem(AUTH_STORAGE_KEY);
//     return null;
//   }
// }

// // Stores whichever of user/technician/admin is currently logged in,
// // tagged with a "role" so the UI and route guards know how to treat it.
// export function AuthProvider({ children }) {
//   const [auth, setAuth] = useState(() => readStoredAuth());

//   useEffect(() => {
//     if (auth) {
//       localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
//     } else {
//       localStorage.removeItem(AUTH_STORAGE_KEY);
//     }
//   }, [auth]);

//   const login = (role, data) => setAuth({ role, ...data });
//   const logout = () => setAuth(null);

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const AUTH_KEY = "auth";

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Invalid auth data:", error);
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth());

  useEffect(() => {
    if (auth) {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify(auth)
      );
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [auth]);

  const login = (user) => {
    setAuth(user);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        isLoggedIn: !!auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}