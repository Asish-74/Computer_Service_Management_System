import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTools,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  getAuth,
  getProfileImage,
  logout,
} from "../utils/auth";

import "../assets/css/components/publicNavbar.css";

export default function PublicNavbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [auth, setAuth] = useState(getAuth());

  const dropdownRef = useRef(null);

  useEffect(() => {
    const syncAuth = () => setAuth(getAuth());

    const closeDropdown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("authChanged", syncAuth);
    document.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("authChanged", syncAuth);
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const dashboardRoute =
    {
      ADMIN: "/admin/dashboard",
      TECHNICIAN: "/technician/dashboard",
      USER: "/user/dashboard",
    }[auth.role] || "/";

  const profileRoute = {
    USER: "/user/profile",
    ADMIN: "/admin/profile",
    TECHNICIAN: "/technician/profile",
  }[auth.role];

  return (
    <header className="public-navbar">
      <div className="container-fluid">

        {/* Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="brand-icon">
            <FaTools />
          </div>

          <div className="brand-text">
            <h3>CSMS</h3>
            <span>Computer Service Management</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#workflow" onClick={closeMenu}>
            How It Works
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>

          {auth.role && (
            <NavLink
              to={dashboardRoute}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
          )}

          {/* Mobile Login Buttons */}
          {!auth.role && (
            <div className="mobile-auth-links">

              <Link
                to="/login"
                className="mobile-login-btn"
                onClick={closeMenu}
              >
                👤 User Login
              </Link>

              <Link
                to="/technician/login"
                className="mobile-login-btn"
                onClick={closeMenu}
              >
                 Technician Login
              </Link>

              <Link
                to="/admin/login"
                className="mobile-login-btn"
                onClick={closeMenu}
              >
                 Admin Login
              </Link>

              <Link
                to="/register"
                className="mobile-register-btn"
                onClick={closeMenu}
              >
                 Get Started
              </Link>

            </div>
          )}

        </nav>

        {/* Desktop Buttons */}
        {!auth.role ? (
          <div className="navbar-actions">

            <Link to="/login" className="login-btn">
              User Login
            </Link>

            <Link
              to="/technician/login"
              className="login-btn"
            >
              Technician
            </Link>

            <Link
              to="/admin/login"
              className="login-btn"
            >
              Admin
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Get Started
            </Link>

          </div>
        ) : (
          <div
            className="public-profile"
            ref={dropdownRef}
          >

            <button
              className="public-profile-btn"
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
            >
              {auth.profilePhoto ? (
                <img
                  src={getProfileImage(
                    auth.profilePhoto
                  )}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <FaUserCircle className="public-profile-icon" />
              )}

              <div>
                <strong>{auth.name}</strong>
                <small>{auth.role}</small>
              </div>

              <FaChevronDown />
            </button>

            {profileOpen && (
              <div className="public-dropdown">

                <Link
                  to={dashboardRoute}
                  onClick={() =>
                    setProfileOpen(false)
                  }
                >
                  Dashboard
                </Link>

                {profileRoute && (
                  <Link
                    to={profileRoute}
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    Profile
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() =>
                    logout(auth.role, navigate)
                  }
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>

              </div>
            )}

          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>
    </header>
  );
}