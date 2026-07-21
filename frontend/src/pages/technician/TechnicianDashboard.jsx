import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaUserCog,
  FaArrowRight,
} from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DashboardCard from "../../components/DashboardCard";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";

import technicianService from "../../services/technicianService";

import "../../assets/css/pages/technicianDashboard.css";

export default function TechnicianDashboard() {
  const navigate = useNavigate();

  const auth =
    JSON.parse(localStorage.getItem("auth")) || {};

  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const dashboardData =
        await technicianService.getDashboard();

      const requestData =
        await technicianService.getAssignedRequests();

      setDashboard(dashboardData);

      setRequests(requestData || []);
    } catch (error) {
      console.error(error);
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
    return (
      <Loader
        fullScreen
        text="Loading Dashboard..."
      />
    );
  }

  return (
    <Layout title="Technician Dashboard">
      {/* Welcome */}

      <div className="tech-welcome-card">
        <div>
          <h2>
            Welcome, {auth?.name} 👋
          </h2>

          <p>
            Manage your assigned repair requests and
            update their status.
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}

      <div className="row g-4 mt-2">
        <div
          className="col-lg-4 col-md-6"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("/technician/requests", {
              state: {
                status: "ASSIGNED",
              },
            })
          }
        >
          <DashboardCard
            title="Assigned Requests"
            value={dashboard?.assignedRequests || 0}
            icon={<FaClipboardList />}
            color="primary"
          />
        </div>

        <div
          className="col-lg-4 col-md-6"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("/technician/requests", {
              state: {
                status: "COMPLETED",
              },
            })
          }
        >
          <DashboardCard
            title="Completed Requests"
            value={dashboard?.completedRequests || 0}
            icon={<FaCheckCircle />}
            color="success"
          />
        </div>

        <div className="col-lg-4 col-md-6">
          <DashboardCard
            title="Availability"
            value="Available"
            icon={<FaUserCog />}
            color="info"
          />
        </div>
      </div>

      {/* Recent Requests */}

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Assigned Requests</h3>

          <Link to="/technician/requests">
            View All
            <FaArrowRight />
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={requests}
          searchable
          searchKey="requestId"
          searchPlaceholder="Search by Request ID..."
          pageSize={5}
          emptyMessage="No Assigned Requests."
        />
      </div>
    </Layout>
  );
}