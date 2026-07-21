import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

import userService from "../../services/userService";
import { useToast } from "../../components/ToastProvider";
import Loader from "../../components/Loader";

import "../../assets/css/pages/register.css";

export default function Register() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
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

    if (formData.phone.length !== 10) {
      showWarning("Phone number must contain 10 digits.");
      return false;
    }

    if (formData.password.length < 6) {
      showWarning("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await userService.register(formData);

      showSuccess("Registration Successful.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      showError(
        error?.response?.data?.msg ||
          "Registration Failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {loading && (
        <Loader
          fullScreen
          text="Creating your account..."
        />
      )}

      <div className="register-card">

        <div className="register-header">
          <FaUserPlus />

          <h2>Create Account</h2>

          <p>
            Register to submit and track your
            service requests.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

        </form>

        <div className="register-footer">
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}