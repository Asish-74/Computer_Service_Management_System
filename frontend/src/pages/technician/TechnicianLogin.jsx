import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTools } from "react-icons/fa";

import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";
import technicianService from "../../services/technicianService";
import { saveAuth } from "../../utils/auth";

import "../../assets/css/pages/technicianLogin.css";

export default function TechnicianLogin() {

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

  const handleChange = (event) => {

    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

  };

  const validate = () => {

    if (
      !formData.email.trim() ||
      !formData.password.trim()
    ) {

      showWarning("Please enter email and password.");

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

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {

      setLoading(true);

      const technician =
        await technicianService.login(formData);

      const authData = {
        token: technician.token,
        id: technician.user.id,
        name: technician.user.name,
        email: technician.user.email,
        phnumber: technician.user.phnumber,
        profilePhoto: technician.user.profilePhoto,
        role: String(technician.user.role).toUpperCase(),
      };

      saveAuth(authData);

      showSuccess("Login Successful.");

      navigate("/technician/dashboard", {
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

    <div className="technician-login-page">

      {loading && (
        <Loader
          fullScreen
          text="Signing In..."
        />
      )}

      <div className="technician-login-card">

        <div className="technician-login-header">

          <FaTools />

          <h2>Technician Login</h2>

          <p>
            Login to manage your assigned
            service requests.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
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
              placeholder="Enter Password"
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
            className="technician-login-btn"
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </form>

        <div className="technician-login-footer">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>

  );

}