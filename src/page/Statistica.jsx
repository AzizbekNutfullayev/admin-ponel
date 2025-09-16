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

export default function Statistica() {
  const [statistics, setStatistics] = useState({
    transactions: [],
    brands: [],
    regions: [],
    months: [],
    users: [],
    clients: [],
    companies: [],
    products: [],
    revenue: [],
    activeUsers: [],
    subscriptions: [],
    securityLogs: [],
  });

  useEffect(() => {
    axios
      .get("/api/admin/statistics/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        console.log("API javobi:", res.data);
  
        const transactions = [
          { name: "Kunlik", value: res.data.transactions.daily_transactions || 0 },
          { name: "Top mahsulotlar", value: res.data.transactions.monthly_top_products || 0 },
        ];
  
        const users = [
          { name: "Faol foydalanuvchilar", value: res.data.users.active || 0 },
        ];
  
        const companies = [
          { name: "Jami kompaniyalar", value: res.data.companies.total || 0 },
          { name: "Tez orada tugaydigan", value: res.data.companies.expiring_soon || 0 },
        ];
  
        setStatistics({
          transactions,
          users,
          companies,
        });
      })
      .catch((err) =>
        console.error("Xatolik:", err.response?.data || err.message)
      );
  }, []);
    

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">📊 Statistika Paneli</h2>

      {/* Grafiklar */}
      <div className="charts-grid">
        {/* Transactions → Line */}
        <div className="card">
          <h3>Tranzaksiyalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statistics.transactions}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Brands → Pie */}
        <div className="card">
          <h3>Mahsulotlar ulushi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statistics.brands}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statistics.brands?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Regions → Bar */}
        <div className="card">
          <h3>Hududlar bo‘yicha faoliyat</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statistics.regions}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#16A34A" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Months → Line */}
        <div className="card">
          <h3>Oylik ko‘rsatkichlar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statistics.months}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue → Bar */}
        <div className="card">
          <h3>Daromad (Revenue)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statistics.revenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#FACC15" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Users → Line */}
        <div className="card">
          <h3>Faol foydalanuvchilar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statistics.activeUsers}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#0EA5E9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jadvallar qismi siz yozgandek qoladi */}
      <div className="tables-grid">
        {/* Users, Clients, Companies, Products, Subscriptions, SecurityLogs */}
      </div>
    </div>
  );
}
