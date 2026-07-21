import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

import authService from "../../services/authService";

import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";

import "../../assets/css/pages/forgotPassword.css";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const { showSuccess, showError, showWarning } =
    useToast();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const validate = () => {

    if (!email.trim()) {

      showWarning("Please enter your email.");

      return false;

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      showWarning("Enter a valid email.");

      return false;

    }

    return true;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {

      setLoading(true);

      await authService.forgotPassword(email);

      showSuccess(
        "OTP sent successfully."
      );

      navigate("/verify-otp", {

        state: {
          email,
        },

      });

    } catch (error) {

      console.error(error);

      showError(

        error?.response?.data?.msg ||

        "Unable to send OTP."

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="forgot-page">

      {loading && (
        <Loader
          fullScreen
          text="Sending OTP..."
        />
      )}

      <div className="forgot-card">

        <h2>

          Forgot Password

        </h2>

        <p>

          Enter your registered email
          address to receive a One-Time
          Password (OTP).

        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <FaEnvelope />

            <input

              type="email"

              placeholder="Enter Email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

            />

          </div>

          <button
            type="submit"
            className="forgot-btn"
          >

            <FaPaperPlane />

            Send OTP

          </button>

        </form>

      </div>

    </div>

  );

}