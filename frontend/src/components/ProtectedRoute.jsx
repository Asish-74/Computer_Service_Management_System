// import { Navigate } from "react-router-dom";

// // Safely reads and parses the "auth" object from localStorage.
// // Never throws: if the value is missing, empty, or corrupted JSON,
// // this returns null instead of crashing the whole app with a
// // white screen (which is what JSON.parse(null-ish/bad value) would do).
// function getStoredAuth() {
//   const raw = localStorage.getItem("auth");

//   if (!raw) {
//     return null;
//   }

//   try {
//     const parsed = JSON.parse(raw);
//     return parsed && typeof parsed === "object" ? parsed : null;
//   } catch (error) {
//     console.error("Corrupted auth data in localStorage, clearing it:", error);
//     localStorage.removeItem("auth");
//     return null;
//   }
// }

// export default function ProtectedRoute({
//   children,
//   allowedRoles = [],
// }) {
//   const auth = getStoredAuth();

//   // User not logged in (or auth data was corrupted)
//   if (!auth) {
//     return <Navigate to="/" replace />;
//   }

//   // Role not allowed
//   if (
//     allowedRoles.length > 0 &&
//     !allowedRoles.includes(auth.role)
//   ) {
//     switch (auth.role) {
//       case "ADMIN":
//         return <Navigate to="/admin/dashboard" replace />;

//       case "TECHNICIAN":
//         return (
//           <Navigate
//             to="/technician/dashboard"
//             replace
//           />
//         );

//       default:
//         return (
//           <Navigate
//             to="/user/dashboard"
//             replace
//           />
//         );
//     }
//   }

//   return children;
// }

import { Navigate } from "react-router-dom";

function getAuth() {
  try {
    const stored = localStorage.getItem("auth");

    if (!stored) return null;

    return JSON.parse(stored);
  } catch (error) {
    console.error("Invalid auth data in localStorage:", error);
    localStorage.removeItem("auth");
    return null;
  }
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const auth = getAuth();

  // User not logged in
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  // Role not allowed
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(auth.role)
  ) {
    switch (auth.role) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;

      case "TECHNICIAN":
        return (
          <Navigate
            to="/technician/dashboard"
            replace
          />
        );

      case "USER":
        return (
          <Navigate
            to="/user/dashboard"
            replace
          />
        );

      default:
        localStorage.removeItem("auth");
        return <Navigate to="/" replace />;
    }
  }

  return children;
}