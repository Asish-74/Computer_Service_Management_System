import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";
import userService from "../../services/userService";
import { saveAuth } from "../../utils/auth";

import "../../assets/css/pages/login.css";

export default function Login() {

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

    setFormData((prev) => ({
      ...prev,
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

      const user = await userService.login(formData);

      const authData = {
        token: user.token,
        id: user.user.id,
        name: user.user.name,
        email: user.user.email,
        phnumber: user.user.phnumber,
        addr: user.user.addr,
        profilePhoto: user.user.profilePhoto,
        role: String(user.user.role).toUpperCase(),
      };

      saveAuth(authData);

      showSuccess("Login Successful.");

      navigate("/user/dashboard", {
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

    <div className="login-page">

      {loading && (

        <Loader
          fullScreen
          text="Signing you in..."
        />

      )}

      <div className="login-card">

        <div className="login-header">

          <FaSignInAlt />

          <h2>Welcome Back</h2>

          <p>
            Login to manage and track your
            service requests.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
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
            className="login-btn"
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </form>

        <div className="login-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>

  );

}