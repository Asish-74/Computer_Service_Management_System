import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DashboardCard from "../../components/DashboardCard";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/ToastProvider";

import userService from "../../services/userService";

import "../../assets/css/pages/userDashboard.css";

function getStoredAuth() {
  try {
    const parsed = JSON.parse(localStorage.getItem("auth") || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.error("Corrupted auth data in localStorage:", error);
    return null;
  }
}

export default function UserDashboard() {
  const auth = getStoredAuth();

  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const dashboardData = await userService.getDashboard();
      const requestData = await userService.getMyRequests();

      setDashboard(dashboardData || {});
      setRequests(requestData || []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      header: "Request ID",
      accessor: "requestId",
    },
    {
      header: "Brand",
      accessor: "brandName",
    },
    {
      header: "Model",
      accessor: "modelNumber",
    },
    {
      header: "Service",
      accessor: "serviceType",
    },
    {
      header: "Priority",
      accessor: "priority",
    },
    {
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  if (loading) {
    return <Loader fullScreen text="Loading Dashboard..." />;
  }

  return (
    <Layout title="User Dashboard">
      {/* Welcome */}

      <div className="welcome-card">
        <div>
          <h2>Welcome, {auth?.name || "User"} 👋</h2>

          <p>
            Manage your service requests and monitor repair progress.
          </p>
        </div>

        <Link
          to="/user/request"
          className="dashboard-action-btn"
        >
          <FaPlus />

          Create Request
        </Link>
      </div>

      {/* Dashboard Cards */}

      <div className="row g-4 mt-2">

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title="Total Requests"
            value={dashboard?.totalRequests || 0}
            icon={<FaClipboardList />}
            color="primary"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title="Pending"
            value={dashboard?.pendingRequests || 0}
            icon={<FaClock />}
            color="warning"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title="Assigned"
            value={dashboard?.assignedRequests || 0}
            icon={<FaTools />}
            color="info"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title="Completed"
            value={dashboard?.completedRequests || 0}
            icon={<FaCheckCircle />}
            color="success"
          />
        </div>

      </div>

      {/* Latest Requests */}

      <div className="table-section mt-4">

        <div className="section-header">

          <h3>Latest Service Requests</h3>

          <Link to="/user/requests">
            View All
          </Link>

        </div>

        <DataTable
          columns={columns}
          data={requests}
          loading={false}
          searchable
          searchKeys={[
            "requestId",
            "brandName",
            "modelNumber",
            "serviceType",
            "priority",
            "status",
          ]}
          pageSize={5}
          searchPlaceholder="Search by Request ID, Brand, Model, Service..."
          emptyMessage="No service requests found."
        />

      </div>
    </Layout>
  );
}