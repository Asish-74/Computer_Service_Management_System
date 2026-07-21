import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCog,
  FaClipboardList,
  FaCheckCircle,
  FaPlus,
  FaTools,
  FaHistory,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DashboardCard from "../../components/DashboardCard";
import AdminCharts from "../../components/AdminCharts";

import adminService from "../../services/adminService";

import "../../assets/css/pages/adminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await adminService.getDashboard();

      setDashboard(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const auth = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("auth")) || {};
    } catch {
      return {};
    }
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Admin Dashboard..."
      />
    );
  }

  return (
    <Layout title="Admin Dashboard">

      {/* ================= Welcome ================= */}

      <div className="admin-welcome-card">

        <div className="welcome-left">

          <span className="welcome-badge">
            Administrator Panel
          </span>

          <h2>
            Welcome back,
            <span className="welcome-name">
              {" "}
              {auth?.name || "Administrator"} 👋
            </span>
          </h2>

          <p>
            Manage users, technicians, service requests and
            monitor your entire Computer Service Management
            System from one place.
          </p>

        </div>

        <div className="welcome-right">

          <div className="date-box">

            <FaCalendarAlt />

            <span>{today}</span>

          </div>

        </div>

      </div>

      {/* ================= Statistics ================= */}

      <div className="row g-4 mb-4">

        <div
          className="col-xl-3 col-md-6"
          onClick={() => navigate("/admin/users")}
        >
          <div className="dashboard-link-card">

            <DashboardCard
              title="Total Users"
              value={dashboard?.totalUsers || 0}
              icon={<FaUsers />}
              color="primary"
            />

          </div>
        </div>

        <div
          className="col-xl-3 col-md-6"
          onClick={() =>
            navigate("/admin/technicians")
          }
        >
          <div className="dashboard-link-card">

            <DashboardCard
              title="Technicians"
              value={dashboard?.totalTechnicians || 0}
              icon={<FaUserCog />}
              color="info"
            />

          </div>
        </div>

        <div
          className="col-xl-3 col-md-6"
          onClick={() =>
            navigate("/admin/requests", {
              state: {
                status: "PENDING",
              },
            })
          }
        >
          <div className="dashboard-link-card">

            <DashboardCard
              title="Pending Requests"
              value={dashboard?.pendingRequests || 0}
              icon={<FaClipboardList />}
              color="warning"
            />

          </div>
        </div>

        <div
          className="col-xl-3 col-md-6"
          onClick={() =>
            navigate("/admin/requests", {
              state: {
                status: "COMPLETED",
              },
            })
          }
        >
          <div className="dashboard-link-card">

            <DashboardCard
              title="Completed Requests"
              value={dashboard?.completedRequests || 0}
              icon={<FaCheckCircle />}
              color="success"
            />

          </div>
        </div>

      </div>

      {/* ================= Charts ================= */}

      <AdminCharts dashboard={dashboard} />

      {/* ================= Quick Actions ================= */}

      <div className="quick-actions">

        <div className="section-title">

          <h3>Quick Actions</h3>

          <span>
            Frequently used administrator operations
          </span>

        </div>

        <div className="row g-4">

          <div className="col-lg-3 col-md-6">

            <Link
              to="/admin/technician/add"
              className="quick-card"
            >

              <div className="quick-icon">
                <FaPlus />
              </div>

              <h4>Add Technician</h4>

              <p>
                Register a new technician in the system.
              </p>

              <span className="quick-link">

                Open

                <FaArrowRight />

              </span>

            </Link>

          </div>

          <div className="col-lg-3 col-md-6">

            <Link
              to="/admin/technicians"
              className="quick-card"
            >

              <div className="quick-icon">
                <FaUserCog />
              </div>

              <h4>Manage Technicians</h4>

              <p>
                Edit, update or remove technician records.
              </p>

              <span className="quick-link">

                Open

                <FaArrowRight />

              </span>

            </Link>

          </div>

          <div className="col-lg-3 col-md-6">

            <Link
              to="/admin/requests"
              className="quick-card"
            >

              <div className="quick-icon">
                <FaTools />
              </div>

              <h4>Service Requests</h4>

              <p>
                Assign technicians and manage requests.
              </p>

              <span className="quick-link">

                Open

                <FaArrowRight />

              </span>

            </Link>

          </div>

          <div className="col-lg-3 col-md-6">

            <Link
              to="/admin/activity-logs"
              className="quick-card"
            >

              <div className="quick-icon">
                <FaHistory />
              </div>

              <h4>Activity Logs</h4>

              <p>
                View complete system activity history.
              </p>

              <span className="quick-link">

                Open

                <FaArrowRight />

              </span>

            </Link>

          </div>

        </div>

      </div>

    </Layout>
  );
}