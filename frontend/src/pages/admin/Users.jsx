import { useEffect, useState } from "react";
import {
  FaUsers,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import ExportButtons from "../../components/ExportButtons";

import adminService from "../../services/adminService";

import "../../assets/css/pages/users.css";

export default function Users() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response =
        await adminService.getUsers();

      setUsers(
        (response || []).map((user) => ({
          ...user,
          search:
            `${user.name} ${user.email} ${user.phnumber}`
              .toLowerCase(),
        }))
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

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

      render: (row) => (

        <span>

          <FaEnvelope
            style={{
              marginRight: "8px",
              color: "#2563eb",
            }}
          />

          {row.email}

        </span>

      ),

    },

    {
      header: "Phone",

      render: (row) => (

        <span>

          <FaPhone
            style={{
              marginRight: "8px",
              color: "#16a34a",
            }}
          />

          {row.phnumber}

        </span>

      ),

    },

    {
      header: "Role",
      accessor: "role",
    },

  ];

  const excelData = users.map((user) => ({
    ID: user.id,
    Name: user.name,
    Email: user.email,
    Phone: user.phnumber,
    Role: user.role,
  }));

  const pdfColumns = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Role",
  ];

  const pdfRows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.phnumber,
    user.role,
  ]);

  if (loading) {

    return (
      <Loader
        fullScreen
        text="Loading Users..."
      />
    );

  }

  return (

    <Layout title="Registered Users">

      <div className="users-page">

        <div className="users-header">

          <div>

            <h2>

              <FaUsers />

              Registered Users

            </h2>

            <p>

              View all registered users in the
              Computer Service Management System.

            </p>

          </div>

        </div>

        <ExportButtons
          data={users}
          excelData={excelData}
          pdfColumns={pdfColumns}
          pdfRows={pdfRows}
          title="Registered Users"
          fileName="Registered_Users"
        />

        <DataTable
          columns={columns}
          data={users}
          searchable
          searchKey="search"
          searchPlaceholder="Search by Name, Email or Phone..."
          pageSize={10}
          emptyMessage="No Users Found."
        />

      </div>

    </Layout>

  );

}