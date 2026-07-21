import "../assets/css/components/statusBadge.css";

const STATUS_CLASSES = {
  PENDING: "status-pending",
  ASSIGNED: "status-assigned",
  COMPLETED: "status-completed",
  CANCELLED: "status-cancelled",
  IN_PROGRESS: "status-progress",
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status
    ? status.toUpperCase().replace(/\s+/g, "_")
    : "PENDING";

  const badgeClass =
    STATUS_CLASSES[normalizedStatus] || "status-default";

  const label = status
    ? status.replace(/_/g, " ")
    : "Pending";

  return (
    <span className={`status-badge ${badgeClass}`}>
      {label}
    </span>
  );
}