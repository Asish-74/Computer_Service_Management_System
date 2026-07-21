import { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import Layout from "../../components/Layout";
import ImageUpload from "../../components/ImageUpload";

import userService from "../../services/userService";
import uploadService from "../../services/uploadService";

import { useToast } from "../../components/ToastProvider";

import "../../assets/css/pages/profile.css";

export default function Profile() {

  const auth =
    JSON.parse(localStorage.getItem("auth")) || {};

  const { showSuccess, showError } =
    useToast();

  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: auth.name || "",

      email: auth.email || "",

      phone: auth.phnumber || "",

      address: auth.addr || "",

      password: "",

      profilePhoto:
        auth.profilePhoto || "",

      selectedFile: null,

    });

  const handleChange = (event) => {

    setFormData((previous) => ({

      ...previous,

      [event.target.name]:
        event.target.value,

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

      const updatedUser =
        await userService.updateProfile({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
          profilePhoto,
        });

      const updatedAuth = {

        ...auth,

        name: updatedUser.name,

        email: updatedUser.email,

        phnumber: updatedUser.phnumber,

        addr: updatedUser.addr,

        role: updatedUser.role || "USER",

        profilePhoto,

      };

      localStorage.setItem(
        "auth",
        JSON.stringify(updatedAuth)
      );
      window.dispatchEvent(
        new Event("authChanged")
      );

      setFormData((previous) => ({

        ...previous,

        profilePhoto,

        selectedFile: null,

        password: "",

      }));

      showSuccess(
        "Profile Updated Successfully."
      );

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

    const latestAuth =
      JSON.parse(localStorage.getItem("auth")) || {};

    setEditing(false);

    setFormData({

      name: latestAuth.name || "",

      email: latestAuth.email || "",

      phone: latestAuth.phnumber || "",

      address: latestAuth.addr || "",

      password: "",

      profilePhoto:
        latestAuth.profilePhoto || "",

      selectedFile: null,

    });

  };
  return (

    <Layout title="My Profile">

      <div className="profile-container">

        <div className="profile-card">

          {/* ===============================
              Profile Header
          =============================== */}

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

            <span>{auth.role}</span>

          </div>

          {/* ===============================
              Profile Body
          =============================== */}

          <div className="profile-body">

            {/* Name */}

            <div className="profile-item">

              <div className="profile-icon">

                <FaUserCircle />

              </div>

              <div className="profile-content">

                <label>Name</label>

                {

                  editing ?

                    (

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                    )

                    :

                    (

                      <p>{formData.name}</p>

                    )

                }

              </div>

            </div>

            {/* Email */}

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

            {/* Phone */}

            <div className="profile-item">

              <div className="profile-icon">

                <FaPhone />

              </div>

              <div className="profile-content">

                <label>Phone Number</label>

                {

                  editing ?

                    (

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />

                    )

                    :

                    (

                      <p>

                        {formData.phone ||

                          "Not Available"}

                      </p>

                    )

                }

              </div>

            </div>

            {/* Password */}

            {

              editing && (

                <div className="profile-item">

                  <div className="profile-icon">

                    <FaEdit />

                  </div>

                  <div className="profile-content">

                    <label>New Password</label>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter New Password"
                    />

                  </div>

                </div>

              )

            }

            {/* Address */}

            <div className="profile-item">

              <div className="profile-icon">

                <FaMapMarkerAlt />

              </div>

              <div className="profile-content">

                <label>Address</label>

                {

                  editing ?

                    (

                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />

                    )

                    :

                    (

                      <p>

                        {formData.address ||

                          "Not Available"}

                      </p>

                    )

                }

              </div>

            </div>

            {/* Role */}

            <div className="profile-item">

              <div className="profile-icon">

                <FaUserTag />

              </div>

              <div className="profile-content">

                <label>Role</label>

                <p>{auth.role}</p>

              </div>

            </div>

          </div>

          {/* ===============================
              Footer
          =============================== */}

          <div className="profile-footer">

            {

              !editing ?

                (

                  <button
                    className="edit-profile-btn"
                    onClick={() =>
                      setEditing(true)
                    }
                  >

                    <FaEdit />

                    Edit Profile

                  </button>

                )
                :
                (
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
                )
            }
          </div>
        </div>
      </div>
    </Layout>
  );
}