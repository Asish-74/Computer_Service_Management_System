import { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  getProfileImage,
  logout,
} from "../utils/auth";

import "../assets/css/components/navbar.css";

import SessionTimer from "./SessionTimer";
export default function Navbar({
  title = "Dashboard",
  onToggleSidebar,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [auth, setAuth] = useState(getAuth());

  useEffect(() => {
    const closeDropdown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const syncAuth = () => setAuth(getAuth());

    document.addEventListener("click", closeDropdown);
    window.addEventListener("authChanged", syncAuth);

    return () => {
      document.removeEventListener(
        "click",
        closeDropdown
      );
      window.removeEventListener(
        "authChanged",
        syncAuth
      );
    };
  }, []);

  const profilePath = {
    USER: "/user/profile",
    ADMIN: "/admin/profile",
    TECHNICIAN: "/technician/profile",
  }[auth.role];

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-btn"
          onClick={onToggleSidebar}
        >
          <FaBars />
        </button>

        <div>
          <h3>{title}</h3>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Welcome back, {auth.name}
          </p>
        </div>
      </div>

      <div className="navbar-right">

        <SessionTimer />

        <div
          className="profile-menu"
          ref={dropdownRef}
        >
          <button
            className="profile-btn"
            onClick={() =>
              setDropdownOpen((prev) => !prev)
            }
          >
            {auth.profilePhoto ? (
              <img
                src={getProfileImage(auth.profilePhoto)}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <FaUserCircle className="profile-icon" />
            )}

            <div className="profile-info">
              <span className="profile-name">
                {auth.name || "User"}
              </span>

              <span className="profile-role">
                {auth.role}
              </span>
            </div>

            <FaChevronDown />
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">

              {profilePath && (
                <Link
                  to={profilePath}
                  className="profile-dropdown-item"
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                >
                  <FaUser />
                  Profile
                </Link>
              )}

              <button
                className="profile-dropdown-item logout-btn"
                onClick={() =>
                  logout(auth.role, navigate)
                }
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}