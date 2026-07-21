import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/ToastProvider";

import technicianService from "../../services/technicianService";

import "../../assets/css/pages/assignedRequests.css";

export default function AssignedRequests() {
  const auth =
    JSON.parse(localStorage.getItem("auth")) || {};

  const location = useLocation();

  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const filterStatus = location.state?.status || "";

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data =
        await technicianService.getAssignedRequests();

      setRequests(
        (data || []).map((request) => ({
          ...request,
          search: `${request.requestId} ${request.status}`.toLowerCase(),
        }))
      );
    } catch (error) {
      console.error(error);
      showError("Unable to load assigned requests.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId) => {
    try {
      await technicianService.updateStatus({
        requestId,
        status: "COMPLETED",
      });

      showSuccess("Request marked as completed.");

      loadRequests();
    } catch (error) {
      showError(
        error?.response?.data?.msg ||
        "Unable to update request."
      );
    }
  };

  const filteredRequests = useMemo(() => {
    if (!filterStatus) {
      return requests;
    }

    return requests.filter(
      (request) => request.status === filterStatus
    );
  }, [requests, filterStatus]);

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
      header: "Problem",
      accessor: "problemDescription",
    },
    {
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Action",
      render: (row) => {
        if (row.status === "COMPLETED") {
          return (
            <span className="completed-label">
              Completed
            </span>
          );
        }

        return (
          <button
            className="complete-btn"
            onClick={() =>
              updateStatus(row.requestId)
            }
          >
            <FaCheckCircle />
            Complete
          </button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Assigned Requests..."
      />
    );
  }

  return (
    <Layout title="Assigned Requests">
      <div className="assigned-page">
        <div className="assigned-header">
          <h2>Assigned Service Requests</h2>

          <p>
            View all assigned requests and update
            their repair status.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={filteredRequests}
          searchable
          searchKey="search"
          searchPlaceholder="Search by Request ID or Status..."
          pageSize={10}
          emptyMessage="No Assigned Requests Found."
        />
      </div>
    </Layout>
  );
}