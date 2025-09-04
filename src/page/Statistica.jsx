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
  const [transactions, setTransactions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [regions, setRegions] = useState([]);
  const [months, setMonths] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/transactions").then((res) => setTransactions(res.data));
    axios.get("http://localhost:5000/brands").then((res) => setBrands(res.data));
    axios.get("http://localhost:5000/regions").then((res) => setRegions(res.data));
    axios.get("http://localhost:5000/months").then((res) => setMonths(res.data));
    axios.get("http://localhost:5000/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:5000/clients").then((res) => setClients(res.data));
    axios.get("http://localhost:5000/companies").then((res) => setCompanies(res.data));
    axios.get("http://localhost:5000/products").then((res) => setProducts(res.data));
  }, []);

  const COLORS = ["#6366F1", "#16A34A", "#DC2626", "#FACC15", "#0EA5E9"];

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Statistika Paneli</h2>

      {/* Charts qismi */}
      <div className="charts-grid">
        {/* Transactions */}
        <div className="card">
          <h3>Tranzaksiyalar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={transactions}>
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
                data={brands}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {brands.map((_, i) => (
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
            <BarChart data={regions}>
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
            <LineChart data={months}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#DC2626" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jadval qismi */}
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
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
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.companyName}</td>
                </tr>
              ))}
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
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
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
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price} so‘m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}











