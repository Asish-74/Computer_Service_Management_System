import { useEffect, useState } from "react";
import { FaTrash, FaStar, FaFilePdf } from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import ReviewModal from "./ReviewModal";

import { useToast } from "../../components/ToastProvider";

import userService from "../../services/userService";
import invoiceService from "../../services/invoiceService";

import "../../assets/css/pages/myRequests.css";

function getStoredAuth() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem("auth") || "null"
    );

    return parsed &&
      typeof parsed === "object"
      ? parsed
      : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function MyRequests() {

  const auth = getStoredAuth();

  const {
    showSuccess,
    showError
  } = useToast();

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);

  const [reviewOpen, setReviewOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {

    try {

      setLoading(true);

      const data =
        await userService.getMyRequests();

      setRequests(data || []);

    } catch (error) {

      console.error(error);

      showError(
        "Unable to load requests."
      );

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async () => {

    try {

      await userService.deleteRequest(deleteId);

      setRequests(previous =>
        previous.filter(
          request =>
            request.requestId !== deleteId
        )
      );

      setDeleteId(null);

      showSuccess(
        "Request deleted successfully."
      );

    } catch (error) {

      showError(
        error?.response?.data?.msg ||
        "Delete failed."
      );

    }

  };

  const openReviewModal = (request) => {

    setSelectedRequest(request);

    setReviewOpen(true);

  };

  const downloadInvoice = async (requestId) => {

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

      link.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

      showError(
        "Unable to download invoice."
      );

    }

  };
  const columns = [

    {
      header: "Request ID",
      accessor: "requestId",
    },

    {
      header: "Service",
      accessor: "serviceType",
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
      header: "Priority",
      accessor: "priority",
    },

    {
      header: "Price",
      render: (row) =>
        row.basePrice
          ? `₹${row.basePrice}`
          : "-",
      searchValue: (row) =>
        row.basePrice,
    },

    {
      header: "GST",
      render: (row) =>
        row.gstAmount
          ? `₹${row.gstAmount}`
          : "-",
      searchValue: (row) =>
        row.gstAmount,
    },

    {
      header: "Total",
      render: (row) =>
        row.totalAmount
          ? `₹${row.totalAmount}`
          : "-",
      searchValue: (row) =>
        row.totalAmount,
    },

    {
      header: "Days",
      render: (row) =>
        row.estimatedDays
          ? `${row.estimatedDays} Days`
          : "-",
      searchValue: (row) =>
        row.estimatedDays,
    },

    {
      header: "Request Date",
      accessor: "requestDate",
    },

    {
      header: "Technician",
      render: (row) =>
        row.technicianName || "Not Assigned",
      searchValue: (row) =>
        row.technicianName || "",
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
      header: "Action",

      render: (row) => {

        if (row.status === "PENDING") {

          return (
            <button
              className="delete-btn"
              onClick={() =>
                setDeleteId(
                  row.requestId
                )
              }
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          );

        }

        if (row.status === "COMPLETED") {

          return (

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >

              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  downloadInvoice(
                    row.requestId
                  )
                }
              >
                <FaFilePdf />
                Download
              </button>

              {
                row.reviewed
                  ?

                  <span className="review-completed">
                    <FaStar />
                    Reviewed
                  </span>

                  :

                  <button
                    className="review-btn"
                    onClick={() =>
                      openReviewModal(
                        row
                      )
                    }
                  >
                    <FaStar />
                    Give Review
                  </button>

              }

            </div>

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
        text="Loading Service Requests..."
      />
    );

  }

  return (

    <Layout title="My Service Requests">

      <div className="requests-page">

        <div className="requests-header">

          <h2>
            My Service Requests
          </h2>

          <p>
            View all your submitted requests and track their status.
          </p>

        </div>

        <DataTable
          columns={columns}
          data={requests}
          loading={false}
          searchable
          searchKeys={[
            "requestId",
            "serviceType",
            "brandName",
            "modelNumber",
            "priority",
            "status",
            "technicianName",
            "basePrice",
            "gstAmount",
            "totalAmount",
            "estimatedDays"
          ]}
          pageSize={5}
          searchPlaceholder="Search requests..."
          emptyMessage="No service requests found."
        />

      </div>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete Service Request"
        message="Only pending requests can be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <ReviewModal
        open={reviewOpen}
        request={selectedRequest}
        onClose={() => {

          setReviewOpen(false);

          setSelectedRequest(null);

        }}
        onSuccess={() => {

          loadRequests();

        }}
      />

    </Layout>

  );

}