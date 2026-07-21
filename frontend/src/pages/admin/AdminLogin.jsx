import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";
import adminService from "../../services/adminService";
import { saveAuth } from "../../utils/auth";

import "../../assets/css/pages/adminLogin.css";

export default function AdminLogin() {

  const navigate = useNavigate();

  const {
    showSuccess,
    showError,
    showWarning,
  } = useToast();

  useEffect(() => {

    if (localStorage.getItem("sessionExpired")) {

      showWarning("Your session has expired. Please login again.");

      localStorage.removeItem("sessionExpired");

    }

  }, [showWarning]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

  };

  const validate = () => {

    if (
      !formData.email.trim() ||
      !formData.password.trim()
    ) {

      showWarning("Please fill in all fields.");

      return false;

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

      showWarning("Please enter a valid email address.");

      return false;

    }

    return true;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);

      const admin =
        await adminService.login(formData);

      const authData = {
        token: admin.token,
        id: admin.user.id,
        name: admin.user.name,
        email: admin.user.email,
        phnumber: admin.user.phnumber,
        profilePhoto: admin.user.profilePhoto,
        role: String(admin.user.role).toUpperCase(),
      };

      saveAuth(authData);

      showSuccess("Admin Login Successful.");

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (error) {

      console.error(error);

      showError(
        error?.response?.data?.msg ||
        "Invalid Email or Password."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="admin-login-page">

      {loading && (

        <Loader
          fullScreen
          text="Signing in..."
        />

      )}

      <div className="admin-login-card">

        <div className="admin-login-header">

          <FaUserShield />

          <h2>Administrator Login</h2>

          <p>
            Sign in to manage users,
            technicians and service requests.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >

            <Link
              to="/forgot-password"
              className="forgot-link"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </form>

        <div className="admin-login-footer">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>

  );

}