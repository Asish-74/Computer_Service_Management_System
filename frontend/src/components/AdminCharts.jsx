import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "../assets/css/components/adminCharts.css";

export default function AdminCharts({ dashboard }) {

  const barData = [
    {
      name: "Pending",
      value: dashboard?.pendingRequests || 0,
    },
    {
      name: "Assigned",
      value: dashboard?.assignedRequests || 0,
    },
    {
      name: "Completed",
      value: dashboard?.completedRequests || 0,
    },
  ];

  const pieData = [
    {
      name: "Pending",
      value: dashboard?.pendingRequests || 0,
    },
    {
      name: "Assigned",
      value: dashboard?.assignedRequests || 0,
    },
    {
      name: "Completed",
      value: dashboard?.completedRequests || 0,
    },
  ];

  const COLORS = [
    "#f59e0b",
    "#2563eb",
    "#16a34a",
  ];

  return (

    <div className="charts-section">

      <div className="row g-4">

        <div className="col-lg-7">

          <div className="chart-card">

            <h4>Service Requests Overview</h4>

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart data={barData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="col-lg-5">

          <div className="chart-card">

            <h4>Request Distribution</h4>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}