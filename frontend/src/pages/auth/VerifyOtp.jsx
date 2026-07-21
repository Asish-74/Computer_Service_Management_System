import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaKey, FaCheckCircle } from "react-icons/fa";

import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";

import authService from "../../services/authService";

import "../../assets/css/pages/verifyOtp.css";

export default function VerifyOtp() {

  const navigate = useNavigate();

  const location = useLocation();

  const { showSuccess, showError, showWarning } =
    useToast();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const validate = () => {

    if (!otp.trim()) {

      showWarning("Please enter OTP.");

      return false;

    }

    if (otp.length !== 6) {

      showWarning("OTP must be 6 digits.");

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

      const response =
        await authService.verifyOtp(
          email,
          otp
        );

      if (!response.data) {

        showError(
          "Invalid or Expired OTP."
        );

        return;

      }

      showSuccess(
        "OTP Verified Successfully."
      );

      navigate("/reset-password", {

        state: {
          email,
        },

      });

    } catch (error) {

      console.error(error);

      showError(
        error?.response?.data?.msg ||
        "OTP Verification Failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="verify-page">

      {loading && (

        <Loader
          fullScreen
          text="Verifying OTP..."
        />

      )}

      <div className="verify-card">

        <h2>

          Verify OTP

        </h2>

        <p>

          Enter the OTP sent to

          <br />

          <strong>{email}</strong>

        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <FaKey />

            <input

              type="text"

              maxLength={6}

              placeholder="Enter 6-digit OTP"

              value={otp}

              onChange={(e) =>
                setOtp(e.target.value)
              }

            />

          </div>

          <button
            type="submit"
            className="verify-btn"
          >

            <FaCheckCircle />

            Verify OTP

          </button>

        </form>

      </div>

    </div>

  );
  

}