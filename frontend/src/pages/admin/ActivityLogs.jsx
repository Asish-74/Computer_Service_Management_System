import { useEffect, useState } from "react";
import {
  FaHistory,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";

import activityLogService from "../../services/activityLogService";

import {
  exportToExcel,
  exportToPDF,
} from "../../utils/exportUtils";

import "../../assets/css/pages/activityLogs.css";

export default function ActivityLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);

      const data =
        await activityLogService.getAllActivities();

      setActivities(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Export Excel
  // ==========================

  const exportExcel = () => {
    const excelData = activities.map(
      (item, index) => ({
        "Sl No": index + 1,
        Role: item.role,
        User: item.userName,
        Email: item.userEmail,
        Action: item.action,
        Details: item.details,
        "Date & Time": item.activityTime
          ? new Date(
              item.activityTime
            ).toLocaleString("en-IN")
          : "-",
      })
    );

    exportToExcel(
      excelData,
      "Activity_Logs"
    );
  };

  // ==========================
  // Export PDF
  // ==========================

  const exportPdf = () => {
    const columns = [
      "Sl No",
      "Role",
      "User",
      "Email",
      "Action",
      "Details",
      "Date & Time",
    ];

    const rows = activities.map(
      (item, index) => [
        index + 1,
        item.role,
        item.userName,
        item.userEmail,
        item.action,
        item.details,
        item.activityTime
          ? new Date(
              item.activityTime
            ).toLocaleString("en-IN")
          : "-",
      ]
    );

    exportToPDF(
      columns,
      rows,
      "Activity Logs",
      "Activity_Logs"
    );
  };

  const columns = [
    {
      header: "Sl No",

      render: (row, index) => index + 1,
    },

    {
      header: "Role",

      render: (row) => {
        const roleClass = {
          USER: "role-user",
          ADMIN: "role-admin",
          TECHNICIAN: "role-technician",
          SYSTEM: "role-system",
        };

        return (
          <span
            className={`role-badge ${
              roleClass[row.role] ||
              "role-system"
            }`}
          >
            {row.role}
          </span>
        );
      },
    },

    {
      header: "User",

      accessor: "userName",
    },

    {
      header: "Email",

      accessor: "userEmail",
    },

    {
      header: "Action",

      render: (row) => (
        <span className="action-badge">
          {row.action}
        </span>
      ),
    },

    {
      header: "Details",

      accessor: "details",
    },

    {
      header: "Date & Time",

      render: (row) => {
        if (!row.activityTime) {
          return "-";
        }

        const date = new Date(
          row.activityTime
        );

        return (
          <div className="activity-date">
            <div className="activity-day">
              {date.toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                }
              )}
            </div>

            <div className="activity-full-date">
              {date.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </div>

            <div className="activity-time">
              {date.toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }
              )}
            </div>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Activity Logs..."
      />
    );
  }

  return (
    <Layout title="Activity Logs">
      <div className="activity-page">

        {/* Header */}

        <div className="activity-header">

          <div>

            <h2>
              <FaHistory />
              Activity Logs
            </h2>

            <p>
              View all important
              activities performed by
              users, administrators and
              technicians.
            </p>

          </div>

          <div className="activity-actions">

            <button
              className="excel-btn"
              onClick={exportExcel}
            >
              <FaFileExcel />
              Export Excel
            </button>

            <button
              className="pdf-btn"
              onClick={exportPdf}
            >
              <FaFilePdf />
              Export PDF
            </button>

          </div>

        </div>

        {/* Table */}

        <DataTable
          columns={columns}
          data={activities}
          searchable
          searchKeys={[
            "userName",
            "userEmail",
            "action",
            "details",
            "role",
          ]}
          searchPlaceholder="Search by Email, User, Action..."
          pageSize={10}
          emptyMessage="No Activity Logs Found."
        />

      </div>
    </Layout>
  );
}