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
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/statistics")
      .then((res) => {
        console.log("API javobi:", res.data);
        setStatistics({
          transactions: res.data.transactions || [],
          brands: res.data.brands || [],
          regions: res.data.regions || [],
          months: res.data.months || [],
          users: res.data.users || [],
          clients: res.data.clients || [],
          companies: res.data.companies || [],
          products: res.data.products || [],
        });
      })
      .catch((err) => console.error("Xatolik:", err));
  }, []);

  const COLORS = ["#6366F1", "#16A34A", "#DC2626", "#FACC15", "#0EA5E9"];

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">📊 Statistika Paneli</h2>

      {/* Grafiklar */}
      <div className="charts-grid">
        {/* Transactions */}
        <div className="card">
          <h3>Tranzaksiyalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statistics.transactions}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#6366F1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Brands */}
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

        {/* Regions */}
        <div className="card">
          <h3>Hududlar bo‘yicha faoliyat</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statistics.regions}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16A34A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Months */}
        <div className="card">
          <h3>Oylik ko‘rsatkichlar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statistics.months}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#DC2626" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jadvallar */}
      <div className="tables-grid">
        {/* Users */}
        <div className="card">
          <h3>Foydalanuvchilar</h3>
          <table>
            <thead>
              <tr>
                <th>Ism</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {statistics.users?.length > 0 ? (
                statistics.users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Ma’lumot yo‘q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Clients */}
        <div className="card">
          <h3>Mijozlar</h3>
          <table>
            <thead>
              <tr>
                <th>Ism</th>
                <th>Telefon</th>
                <th>Kompaniya</th>
              </tr>
            </thead>
            <tbody>
              {statistics.clients?.length > 0 ? (
                statistics.clients.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.companyName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Ma’lumot yo‘q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Companies */}
        <div className="card">
          <h3>Kompaniyalar</h3>
          <table>
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Holati</th>
              </tr>
            </thead>
            <tbody>
              {statistics.companies?.length > 0 ? (
                statistics.companies.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Ma’lumot yo‘q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Products */}
        <div className="card">
          <h3>Mahsulotlar</h3>
          <table>
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Narxi</th>
              </tr>
            </thead>
            <tbody>
              {statistics.products?.length > 0 ? (
                statistics.products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.price} so‘m</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Ma’lumot yo‘q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
