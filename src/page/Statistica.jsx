import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

export default function Statistica() {
  const [statistics, setStatistics] = useState({
    transactions: [],
    companies: [],
    users: [],
    topSales: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("access");

    // Umumiy statistika
    axios
      .get("/api/admin/statistics/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("General Statistics:", res.data);

        const transactions = [
          { name: "Kunlik tranzaksiya", value: res.data.transactions?.daily_transactions || 0 },
          { name: "Oylik tranzaksiya", value: res.data.transactions?.monthly_top_products || 0 },
        ];

        const users = [
          { name: "Faol foydalanuvchilar", value: res.data.users?.active || 0 },
        ];

        const companies = [
          { name: "Jami kompaniyalar", value: res.data.companies?.total || 0 },
          { name: "Tez orada tugaydigan", value: res.data.companies?.expiring_soon || 0 },
        ];

        setStatistics((prev) => ({
          ...prev,
          transactions,
          users,
          companies,
        }));
      })
      .catch((err) => console.error("General statistics error:", err));

    // Top Sales
    axios
      .get("/api/admin/statistics/top-sales/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Top Sales:", res.data);
        setStatistics((prev) => ({
          ...prev,
          topSales: res.data || [],
        }));
      })
      .catch((err) => console.error("Top sales error:", err));
  }, []);

  return (
    <div className="dashboard_sta">
      <h2 className="dashboard__title_sta">📊 Statistika Paneli</h2>

      <div className="charts-grid">
        {/* Transactions → Line */}
        <div className="card_line">
          <h3>Tranzaksiyalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statistics.transactions}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Sales → Pie */}
        <div className="card_sals">
          <h3>Top Mahsulotlar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statistics.topSales}
                dataKey="sales"
                nameKey="product"
                outerRadius={100}
                label
              >
                {statistics.topSales.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Companies → Bar */}
        <div className="card_bar">
          <h3>Kompaniyalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statistics.companies}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#16A34A" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Users → Bar */}
        <div className="card_bar">
          <h3>Foydalanuvchilar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statistics.users}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0EA5E9" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
