import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// ===================== Public Pages =====================
import Home from "./pages/Home";

// ===================== User Pages =====================
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";
import ServiceRequest from "./pages/user/ServiceRequest";
import MyRequests from "./pages/user/MyRequests";

// ===================== Admin Pages =====================
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import ManageTechnician from "./pages/admin/ManageTechnician";
import AddTechnician from "./pages/admin/AddTechnician";
import EditTechnician from "./pages/admin/EditTechnician";
import ServiceRequests from "./pages/admin/ServiceRequests";
import AdminProfile from "./pages/admin/Profile";
import ReviewManagement from "./pages/admin/ReviewManagement";
import ServiceCatalog from "./pages/admin/ServiceCatalog";

// ===================== Technician Pages =====================
import TechnicianLogin from "./pages/technician/TechnicianLogin";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import AssignedRequests from "./pages/technician/AssignedRequests";
import TechnicianProfile from "./pages/technician/Profile";

// ===================== Auth Pages =====================
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import { getAuth, startSessionTimer } from "./utils/auth";
import ActivityLogs from "./pages/admin/ActivityLogs";

function App() {
  useEffect(() => {

    const auth = getAuth();

    if (auth) {
      startSessionTimer(auth);
    }

  }, []);
  return (
    <Routes>

      {/* ===================== Public Routes ===================== */}

      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/technician/login"
        element={<TechnicianLogin />}
      />

      {/* ===================== Forgot Password Routes ===================== */}

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* ===================== User Routes ===================== */}

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/request"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <ServiceRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/requests"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <MyRequests />
          </ProtectedRoute>
        }
      />

      {/* ===================== Admin Routes ===================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/technicians"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageTechnician />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/technician/add"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AddTechnician />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/technician/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <EditTechnician />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ServiceRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/activity-logs"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ReviewManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/services"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ServiceCatalog />
          </ProtectedRoute>
        }
      />

      {/* ===================== Technician Routes ===================== */}

      <Route
        path="/technician/dashboard"
        element={
          <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/technician/requests"
        element={
          <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <AssignedRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/technician/profile"
        element={
          <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianProfile />
          </ProtectedRoute>
        }
      />


      {/* ===================== 404 ===================== */}

      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              fontSize: "2rem",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            404 | Page Not Found
          </div>
        }
      />

    </Routes>
  );
}

export default App;