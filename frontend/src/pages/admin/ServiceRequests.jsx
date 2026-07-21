import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import ExportButtons from "../../components/ExportButtons";
import { useToast } from "../../components/ToastProvider";

import adminService from "../../services/adminService";
import invoiceService from "../../services/invoiceService";

import "../../assets/css/pages/serviceRequests.css";

export default function ServiceRequests() {

  const location = useLocation();

  const defaultStatus =
    location.state?.status || "ALL";

  const {
    showSuccess,
    showError
  } = useToast();

  const [loading, setLoading] =
    useState(true);

  const [requests, setRequests] =
    useState([]);

  const [technicians, setTechnicians] =
    useState([]);

  const [
    selectedTechnician,
    setSelectedTechnician
  ] = useState({});

  const [assigningId, setAssigningId] =
    useState(null);

  const [statusFilter, setStatusFilter] =
    useState(defaultStatus);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {

    setStatusFilter(
      location.state?.status || "ALL"
    );

  }, [location.state]);

  const loadData = async () => {

    try {

      setLoading(true);

      const requestData =
        await adminService.getAllRequests();

      const technicianData =
        await adminService.getTechnicians();

      setRequests(requestData || []);

      setTechnicians(

        (technicianData || []).filter(
          tech => tech.available === true
        )

      );

    } catch (error) {

      console.error(error);

      showError(
        "Unable to load requests."
      );

    } finally {

      setLoading(false);

    }

  };

  const filteredRequests =
    statusFilter === "ALL"
      ? requests
      : requests.filter(
          request =>
            request.status === statusFilter
        );

  const handleTechnicianChange = (
    requestId,
    value
  ) => {

    setSelectedTechnician(prev => ({

      ...prev,

      [requestId]: value,

    }));

  };

  const formatDateTime = (
    dateTime
  ) => {

    if (!dateTime) {

      return "-";

    }

    return new Date(dateTime)
      .toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",

      });

  };

  const downloadInvoice = async (
    requestId
  ) => {

    try {

      const blob =
        await invoiceService.downloadInvoice(
          requestId
        );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Invoice-${requestId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

      showError(
        "Unable to download invoice."
      );

    }

  };
  /* ==========================
      Export Data
========================== */

const excelData = filteredRequests.map(
  (request) => ({

    RequestID: request.requestId,

    Brand: request.brandName,

    Model: request.modelNumber,

    Service: request.serviceType,

    Priority: request.priority,

    Status: request.status,

    Technician: request.technician
      ? request.technician.name
      : "Not Assigned",

    AssignedAt: formatDateTime(
      request.assignedAt
    ),

    CompletedAt: formatDateTime(
      request.completedAt
    ),

  })
);

const pdfColumns = [

  "Request ID",
  "Brand",
  "Model",
  "Service",
  "Priority",
  "Status",
  "Technician",
  "Assigned At",
  "Completed At",

];

const pdfRows = filteredRequests.map(
  (request) => [

    request.requestId,
    request.brandName,
    request.modelNumber,
    request.serviceType,
    request.priority,
    request.status,

    request.technician
      ? request.technician.name
      : "Not Assigned",

    formatDateTime(
      request.assignedAt
    ),

    formatDateTime(
      request.completedAt
    ),

  ]
);

/* ==========================
    Assign Technician
========================== */

const assignTechnician = async (
  requestId
) => {

  if (assigningId !== null) {

    return;

  }

  const technicianId =
    selectedTechnician[requestId];

  if (!technicianId) {

    showError(
      "Please select a technician."
    );

    return;

  }

  try {

    setAssigningId(requestId);

    await adminService.assignTechnician({

      requestId,

      technicianId:
        Number(technicianId),

    });

    showSuccess(
      "Technician Assigned Successfully."
    );

    await loadData();

  } catch (error) {

    console.error(error);

    showError(

      error?.response?.data?.msg ||

      "Assignment Failed."

    );

  } finally {

    setAssigningId(null);

  }

};

const columns = [

  {
    header: "SL NO",
    render: (row, index) => index + 1,
  },

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
      <StatusBadge
        status={row.status}
      />
    ),

    searchValue: (row) =>
      row.status,

  },

  {
    header: "Technician",

    render: (row) =>
      row.technician
        ? row.technician.name
        : "Not Assigned",

    searchValue: (row) =>
      row.technician
        ? row.technician.name
        : "Not Assigned",

  },

  {
    header: "Assigned At",

    render: (row) =>
      formatDateTime(
        row.assignedAt
      ),

  },

  {
    header: "Completed At",

    render: (row) =>
      formatDateTime(
        row.completedAt
      ),

  },

  {
    header: "Action",

    render: (row) => {

      if (row.status === "PENDING") {

        return (

          <div className="assign-box">

            <select
              className="assign-select"
              value={
                selectedTechnician[row.requestId] || ""
              }
              disabled={
                assigningId === row.requestId
              }
              onChange={(e) =>
                handleTechnicianChange(
                  row.requestId,
                  e.target.value
                )
              }
            >

              <option value="">
                Select Technician
              </option>

              {technicians.map((tech) => (

                <option
                  key={tech.id}
                  value={tech.id}
                >
                  {tech.name}
                </option>

              ))}

            </select>

            <button
              className="assign-btn"
              disabled={
                assigningId === row.requestId
              }
              onClick={() =>
                assignTechnician(
                  row.requestId
                )
              }
            >

              {assigningId === row.requestId
                ? "Assigning..."
                : "Assign"}

            </button>

          </div>

        );

      }

      if (row.status === "ASSIGNED") {

        return (

          <span className="status-label assigned-label">

            Assigned

          </span>

        );

      }

      if (row.status === "COMPLETED") {

        return (

          <button
            className="btn btn-danger btn-sm"
            onClick={() =>
              downloadInvoice(
                row.requestId
              )
            }
          >

            <FaFilePdf />

            &nbsp;Invoice

          </button>

        );

      }

      return "-";

    },

  },

];
if (loading) {

  return (

    <Loader
      fullScreen
      text="Loading Requests..."
    />

  );

}

return (

  <Layout title="Service Requests">

    <div className="service-request-page">

      <div className="page-header">

        <div>

          <h2>
            Service Requests
          </h2>

          <p>
            Assign technicians, monitor repair requests and
            track request progress.
          </p>

        </div>

      </div>

      <div className="status-filter">

        <label>Status :</label>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="ALL">
            All Requests
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="ASSIGNED">
            Assigned
          </option>

          <option value="COMPLETED">
            Completed
          </option>

        </select>

      </div>

      <ExportButtons
        data={filteredRequests}
        excelData={excelData}
        pdfColumns={pdfColumns}
        pdfRows={pdfRows}
        title={
          statusFilter === "ALL"
            ? "Service Requests Report"
            : `${statusFilter} Service Requests Report`
        }
        fileName={
          statusFilter === "ALL"
            ? "Service_Requests_Report"
            : `${statusFilter}_Service_Requests`
        }
      />

      <DataTable
        columns={columns}
        data={filteredRequests}
        searchable
        searchKeys={[
          "requestId",
          "brandName",
          "modelNumber",
          "serviceType",
          "priority",
          "status",
        ]}
        searchPlaceholder="Search Request ID, Brand, Model, Service..."
        pageSize={10}
        emptyMessage={`No ${
          statusFilter === "ALL"
            ? ""
            : statusFilter.toLowerCase() + " "
        }requests found.`}
      />

    </div>

  </Layout>

);

}