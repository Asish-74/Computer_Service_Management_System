import { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

import Layout from "../../components/Layout";
import ImageUpload from "../../components/ImageUpload";
import adminService from "../../services/adminService";
import uploadService from "../../services/uploadService";
import { useToast } from "../../components/ToastProvider";

import "../../assets/css/pages/profile.css";

export default function Profile() {

  const auth = JSON.parse(localStorage.getItem("auth")) || {};

  const { showSuccess, showError } = useToast();

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.name || "",
    email: auth.email || "",
    phone: auth.phnumber || "",
    password: "",
    profilePhoto: auth.profilePhoto || "",
    selectedFile: null
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {

    try {

      let profilePhoto = formData.profilePhoto;

      if (formData.selectedFile) {
        profilePhoto =
          await uploadService.uploadProfilePhoto(
            formData.selectedFile
          );
      }

      const updatedAdmin =
        await adminService.updateProfile({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          profilePhoto
        });

      const updatedAuth = {
        ...auth,
        ...updatedAdmin,
        profilePhoto
      };

      localStorage.setItem(
        "auth",
        JSON.stringify(updatedAuth)
      );

      window.dispatchEvent(
        new Event("authChanged")
      );

      setFormData(prev => ({
        ...prev,
        profilePhoto
      }));

      showSuccess("Profile Updated Successfully.");

      setEditing(false);

    } catch (error) {

      console.error(error);

      showError(
        error?.response?.data?.msg ||
        "Profile update failed."
      );

    }

  };

  const handleCancel = () => {

    setEditing(false);

    setFormData({
      name: auth.name || "",
      email: auth.email || "",
      phone: auth.phnumber || "",
      password: "",
      profilePhoto: auth.profilePhoto || "",
      selectedFile: null
    });

  };

  return (

    <Layout title="Admin Profile">

      <div className="profile-container">

        <div className="profile-card">
          <div className="profile-header">

            <ImageUpload
              currentPhoto={formData.profilePhoto}
              editing={editing}
              onUpload={(file) =>
                setFormData((previous) => ({
                  ...previous,
                  selectedFile: file,
                }))
              }
              onRemove={() =>
                setFormData((previous) => ({
                  ...previous,
                  profilePhoto: "",
                  selectedFile: null,
                }))
              }
            />

            <h2>{formData.name}</h2>

            <span>Administrator</span>

          </div>

          <div className="profile-body">

            <div className="profile-item">

              <div className="profile-icon">
                <FaUserCircle />
              </div>

              <div className="profile-content">

                <label>Name</label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.name}</p>
                )}

              </div>

            </div>

            <div className="profile-item">

              <div className="profile-icon">
                <FaEnvelope />
              </div>

              <div className="profile-content">

                <label>Email</label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                />

              </div>

            </div>

            <div className="profile-item">

              <div className="profile-icon">
                <FaPhone />
              </div>

              <div className="profile-content">

                <label>Phone Number</label>

                {editing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.phone || "Not Available"}</p>
                )}

              </div>

            </div>

            {editing && (

              <div className="profile-item">

                <div className="profile-icon">
                  <FaEdit />
                </div>

                <div className="profile-content">

                  <label>New Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter New Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                </div>

              </div>

            )}

            <div className="profile-item">

              <div className="profile-icon">
                <FaUserTag />
              </div>

              <div className="profile-content">

                <label>Role</label>

                <p>ADMIN</p>

              </div>

            </div>

          </div>

          <div className="profile-footer">

            {!editing ? (
              <button
                className="edit-profile-btn"
                onClick={() => setEditing(true)}
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (

              <div className="profile-actions">

                <button
                  className="save-profile-btn"
                  onClick={handleUpdate}
                >
                  <FaSave />
                  Save Changes
                </button>

                <button
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                >
                  <FaTimes />
                  Cancel
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </Layout>

  );

}