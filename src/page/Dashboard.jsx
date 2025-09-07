import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Users, UserCheck, Package } from "lucide-react"; // iconlar

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [regions, setRegions] = useState([]);
  const [months, setMonths] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/transactions").then(res => setTransactions(res.data));
    axios.get("http://localhost:5000/brands").then(res => setBrands(res.data));
    axios.get("http://localhost:5000/regions").then(res => setRegions(res.data));
    axios.get("http://localhost:5000/months").then(res => setMonths(res.data));
    axios.get("http://localhost:5000/users").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/clients").then(res => setClients(res.data));
    axios.get("http://localhost:5000/companies").then(res => setCompanies(res.data));
    axios.get("http://localhost:5000/products").then(res => setProducts(res.data));
  }, []);

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA"];

  return (
    <div className="dashboard-grid">
      {/* Asosiy raqamlar */}
      <div className="card stats-card">
        <h3>Umumiy ko‘rsatkichlar</h3>
        <div className="stats-grid">
          <div className="stat-box stat-blue">
            <div className="icon"><Building2 size={28} /></div>
            <div>
              <span>Kompaniyalar</span>
              <strong>{companies.length}</strong>
            </div>
          </div>
          <div className="stat-box stat-green">
            <div className="icon"><Users size={28} /></div>
            <div>
              <span>Foydalanuvchilar</span>
              <strong>{users.length}</strong>
            </div>
          </div>
          <div className="stat-box stat-orange">
            <div className="icon"><UserCheck size={28} /></div>
            <div>
              <span>Mijozlar</span>
              <strong>{clients.length}</strong>
            </div>
          </div>
          <div className="stat-box stat-purple">
            <div className="icon"><Package size={28} /></div>
            <div>
              <span>Mahsulotlar</span>
              <strong>{products.length}</strong>
            </div>
          </div>
        </div>
      </div>


      {/* Transactions - Line Chart */}
      <div className="card">
        <h3>Tranzaksiyalar oqimi</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={transactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Brands - Bar Chart */}
      <div className="card">
        <h3>Mahsulotlar bo‘yicha ulush</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={brands}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regions - Pie Chart */}
      <div className="card">
        <h3>Hududlar bo‘yicha mijozlar</h3>
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

      {/* Months - Line Chart */}
      <div className="card">
        <h3>Oylar kesimidagi sotuvlar</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={months}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
