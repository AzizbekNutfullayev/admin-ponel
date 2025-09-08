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
    axios.get("http://localhost:5000/dashboard").then(res => console.log(res.data));
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

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA"];

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
        <div className="chart-card">
          <h3 className="chart-title">Tranzaksiyalar oqimi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Mahsulotlar bo‘yicha ulush</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={brands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Hududlar bo‘yicha mijozlar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={regions} dataKey="value" nameKey="name" outerRadius={80} label>
                {regions.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Oylar kesimidagi sotuvlar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
