import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaClipboardList,
  FaUser,
  FaUsers,
  FaTools,
  FaUserCog,
  FaTasks,
  FaChartPie,
  FaLaptopMedical,
  FaSignOutAlt,
  FaStar,
  FaHistory,
  FaListAlt,
} from "react-icons/fa";

import { getAuth, logout } from "../utils/auth";
import "../assets/css/components/sidebar.css";

const USER_MENUS = [
  { title: "Dashboard", icon: <FaChartPie />, path: "/user/dashboard" },
  { title: "Create Request", icon: <FaLaptopMedical />, path: "/user/request" },
  { title: "My Requests", icon: <FaClipboardList />, path: "/user/requests" },
  { title: "Profile", icon: <FaUser />, path: "/user/profile" },
];

const ADMIN_MENUS = [
  { title: "Dashboard", icon: <FaChartPie />, path: "/admin/dashboard" },
  { title: "Users", icon: <FaUsers />, path: "/admin/users" },
  { title: "Technicians", icon: <FaUserCog />, path: "/admin/technicians" },
  { title: "Add Technician", icon: <FaTools />, path: "/admin/technician/add" },
  { title: "Service Requests", icon: <FaClipboardList />, path: "/admin/requests" },
  { title: "Service Catalog", icon: <FaListAlt />, path: "/admin/services" },
  { title: "Activity Logs", icon: <FaHistory />, path: "/admin/activity-logs" },
  { title: "Reviews", icon: <FaStar />, path: "/admin/reviews" },
];

const TECHNICIAN_MENUS = [
  { title: "Dashboard", icon: <FaChartPie />, path: "/technician/dashboard" },
  { title: "Assigned Requests", icon: <FaTasks />, path: "/technician/requests" },
];

export default function Sidebar({
  isMobile,
  isOpen,
  collapsed,
  onClose,
}) {
  const navigate = useNavigate();
  const auth = getAuth();

  const menus =
    auth.role === "ADMIN"
      ? ADMIN_MENUS
      : auth.role === "TECHNICIAN"
      ? TECHNICIAN_MENUS
      : USER_MENUS;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar
        ${isMobile ? (isOpen ? "open" : "") : ""}
        ${collapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <div className="logo-area">
            <div className="logo-circle">
              <FaTools />
            </div>

            {!collapsed && (
              <div>
                <h4>CSMS</h4>
                <span>Service Portal</span>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              className="close-btn"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="sidebar-menu">
          {menus.map(({ title, icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <span className="sidebar-icon">
                {icon}
              </span>

              {!collapsed && <span>{title}</span>}
            </NavLink>
          ))}

          <button
            className="sidebar-link logout-link"
            onClick={() =>
              logout(auth.role, navigate)
            }
          >
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>

            {!collapsed && <span>Logout</span>}
          </button>
        </nav>

        <Link
          to="/"
          className="sidebar-footer"
        >
          <FaHome />

          {!collapsed && (
            <span>
              Computer Service Management System
            </span>
          )}
        </Link>
      </aside>
    </>
  );
}