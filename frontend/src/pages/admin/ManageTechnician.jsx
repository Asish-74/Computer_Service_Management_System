import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import StatusBadge from "../../components/StatusBadge";
import ExportButtons from "../../components/ExportButtons";
import { useToast } from "../../components/ToastProvider";

import adminService from "../../services/adminService";

import "../../assets/css/pages/manageTechnician.css";

export default function ManageTechnician() {

  const { showSuccess, showError } = useToast();

  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {

    try {

      setLoading(true);

      const data =
        await adminService.getTechnicians();

      setTechnicians(
        (data || []).map((tech) => ({
          ...tech,
          search: `${tech.id} ${tech.name} ${tech.email} ${tech.phnumber} ${tech.spec} ${tech.expe} ${tech.available ? "available" : "unavailable"}`
            .toLowerCase(),
        }))
      );

    } catch (error) {

      console.error(error);

      showError("Unable to load technicians.");

    } finally {

      setLoading(false);

    }

  };

  const deleteTechnician = async () => {

    try {

      await adminService.deleteTechnician(selectedId);

      showSuccess(
        "Technician deleted successfully."
      );

      setShowDialog(false);

      loadTechnicians();

    } catch (error) {

      showError("Unable to delete technician.");

    }

  };

  const columns = [

    {
      header: "ID",
      accessor: "id",
    },

    {
      header: "Name",
      accessor: "name",
    },

    {
      header: "Email",
      accessor: "email",
    },

    {
      header: "Phone",
      accessor: "phnumber",
    },

    {
      header: "Specialization",
      accessor: "spec",
    },

    {
      header: "Experience",

      render: (row) =>
        `${row.expe} Years`,
    },

    {
      header: "Availability",

      render: (row) => (

        <StatusBadge
          status={
            row.available
              ? "AVAILABLE"
              : "UNAVAILABLE"
          }
        />

      ),

    },

    {
      header: "Actions",

      render: (row) => (

        <div className="action-buttons">

          <Link
            to={`/admin/technician/edit/${row.id}`}
            className="edit-btn"
          >
            <FaEdit />
          </Link>

          <button
            className="delete-btn"
            onClick={() => {

              setSelectedId(row.id);

              setShowDialog(true);

            }}
          >
            <FaTrash />
          </button>

        </div>

      ),

    },

  ];

  const excelData = technicians.map((tech) => ({
    ID: tech.id,
    Name: tech.name,
    Email: tech.email,
    Phone: tech.phnumber,
    Specialization: tech.spec,
    Experience: `${tech.expe} Years`,
    Availability: tech.available
      ? "Available"
      : "Unavailable",
  }));

  const pdfColumns = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Specialization",
    "Experience",
    "Availability",
  ];

  const pdfRows = technicians.map((tech) => [
    tech.id,
    tech.name,
    tech.email,
    tech.phnumber,
    tech.spec,
    `${tech.expe} Years`,
    tech.available
      ? "Available"
      : "Unavailable",
  ]);

  if (loading) {

    return (

      <Loader
        fullScreen
        text="Loading Technicians..."
      />

    );

  }

  return (

    <Layout title="Manage Technicians">

      <div className="technician-header">

        <div>

          <h2>Manage Technicians</h2>

          <p>

            Add, edit and manage technicians.

          </p>

        </div>

        <Link
          to="/admin/technician/add"
          className="add-technician-btn"
        >

          <FaPlus />

          Add Technician

        </Link>

      </div>

      <ExportButtons
        data={technicians}
        excelData={excelData}
        pdfColumns={pdfColumns}
        pdfRows={pdfRows}
        title="Technicians Report"
        fileName="Technicians_Report"
      />

      <DataTable
        columns={columns}
        data={technicians}
        searchable
        searchKey="search"
        searchPlaceholder="Search by ID, Name, Email, Phone, Specialization, Experience or Availability..."
        pageSize={10}
        emptyMessage="No Technicians Found."
      />

      <ConfirmDialog
        show={showDialog}
        title="Delete Technician"
        message="Are you sure you want to delete this technician?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={deleteTechnician}
        onCancel={() =>
          setShowDialog(false)
        }
      />

    </Layout>

  );

}