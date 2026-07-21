import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaSave } from "react-icons/fa";

import Loader from "../../components/Loader";
import { useToast } from "../../components/ToastProvider";

import authService from "../../services/authService";

import "../../assets/css/pages/resetPassword.css";

export default function ResetPassword() {

    const navigate = useNavigate();

    const location = useLocation();

    const { showSuccess, showError, showWarning } =
        useToast();

    const email = location.state?.email || "";

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        newPassword: "",

        confirmPassword: "",

    });

    const handleChange = (e) => {

        setFormData((prev) => ({

            ...prev,

            [e.target.name]: e.target.value,

        }));

    };

    const validate = () => {

        if (
            !formData.newPassword.trim() ||
            !formData.confirmPassword.trim()
        ) {

            showWarning(
                "Please fill all fields."
            );

            return false;

        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            showError(
                "Passwords do not match."
            );

            return false;

        }

        if (
            formData.newPassword.length < 6
        ) {

            showWarning(
                "Password should be at least 6 characters."
            );

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

            await authService.resetPassword(

                email,

                formData.newPassword

            );

            showSuccess(
                "Password updated successfully. Please log in again."
            );

            setTimeout(() => {
                navigate("/", {
                    replace: true,
                });
            }, 2000);

        } catch (error) {

            console.error(error);

            showError(

                error?.response?.data?.msg ||

                "Unable to reset password."

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="reset-page">

            {loading && (

                <Loader
                    fullScreen
                    text="Updating Password..."
                />

            )}

            <div className="reset-card">

                <h2>

                    Reset Password

                </h2>

                <p>

                    Create a new password for

                    <br />

                    <strong>{email}</strong>

                </p>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <FaLock />

                        <input

                            type="password"

                            name="newPassword"

                            placeholder="New Password"

                            value={
                                formData.newPassword
                            }

                            onChange={handleChange}

                        />

                    </div>

                    <div className="input-group">

                        <FaLock />

                        <input

                            type="password"

                            name="confirmPassword"

                            placeholder="Confirm Password"

                            value={
                                formData.confirmPassword
                            }

                            onChange={handleChange}

                        />

                    </div>

                    <button
                        type="submit"
                        className="reset-btn"
                    >

                        <FaSave />

                        Update Password

                    </button>

                </form>

            </div>

        </div>

    );

}