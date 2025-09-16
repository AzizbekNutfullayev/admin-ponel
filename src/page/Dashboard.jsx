import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Users, UserCheck, Package } from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [regions, setRegions] = useState([]);
  const [months, setMonths] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/transactions").then(res => setTransactions(res.data));
    axios.get("http://localhost:5000/statistics").then(res => {
      setBrands(res.data.brands || []);
      setRegions(res.data.regions || []);
      setMonths(res.data.months || []);
    });
    axios.get("http://localhost:5000/companies").then(res => setCompanies(res.data));
    axios.get("http://localhost:5000/users").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/clients").then(res => setClients(res.data));
    axios.get("http://localhost:5000/products").then(res => setProducts(res.data));
  }, []);


  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p className="stat-title">Kompaniyalar</p>
            <h2 className="stat-value">{companies.length}</h2>
          </div>
          <Building2 className="stat-icon text-indigo-600" />
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-title">Foydalanuvchilar</p>
            <h2 className="stat-value">{users.length}</h2>
          </div>
          <Users className="stat-icon text-green-600" />
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-title">Mijozlar</p>
            <h2 className="stat-value">{clients.length}</h2>
          </div>
          <UserCheck className="stat-icon text-orange-500" />
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-title">Mahsulotlar</p>
            <h2 className="stat-value">{products.length}</h2>
          </div>
          <Package className="stat-icon text-purple-600" />
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Transactions Line */}
        <div className="chart-card">
          <h3 className="chart-title">Tranzaksiyalar oqimi</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fill: "#374151" }} />
              <YAxis tick={{ fill: "#374151" }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products Bar */}
        <div className="chart-card">
          <h3 className="chart-title">Mahsulotlar bo‘yicha ulush</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={brands}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#374151" }} />
              <YAxis tick={{ fill: "#374151" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#22C55E" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regions Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Hududlar bo‘yicha mijozlar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={regions} dataKey="value" nameKey="name" outerRadius={100} label>
                {regions.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Months */}
        <div className="chart-card">
          <h3 className="chart-title">Oylar kesimidagi sotuvlar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#374151" }} />
              <YAxis tick={{ fill: "#374151" }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
