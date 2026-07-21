import "../assets/css/components/dashboardCard.css";

export default function DashboardCard({
  title,
  value,
  icon,
  color = "primary",
}) {
  return (
    <div className={`dashboard-card ${color}`}>
      <div className="dashboard-card-content">
        <div>
          <p className="dashboard-title">{title}</p>
          <h2 className="dashboard-value">{value}</h2>
        </div>

        <div className="dashboard-icon">
          {icon}
        </div>
      </div>
    </div>
  );
}