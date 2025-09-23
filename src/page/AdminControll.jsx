import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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
  ResponsiveContainer,
} from "recharts";

const AdminController = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const token = localStorage.getItem("access");

  const api = axios.create({
    baseURL: "/api/admin",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companyRes, productRes, warehouseRes] = await Promise.all([
          api.get("/active-users/"),
          api.get("/companies/"),
          api.get("/products/"),
          api.get("/warehouses/"),
        ]);
        setUsers(userRes.data);
        setCompanies(companyRes.data);
        setProducts(productRes.data);
        setWarehouses(warehouseRes.data);
      } catch (err) {
        console.error("❌ API error:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  // Ranglar
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  return (
    <div className="admin-container">
      <h1 className="title">📊 Admin Controller Dashboard</h1>

      <div className="grid-container">
        {/* Users Pie Chart */}
        <div className="card_con chart-card">
          <h2>👤 Active Users</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Users", value: users.length },
                  { name: "Companies", value: companies.length },
                  { name: "Products", value: products.length },
                  { name: "Warehouses", value: warehouses.length },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {users.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Companies Bar Chart */}
        <div className="card_con chart-card">
          <h2>🏢 Companies</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="id" fill="#4F46E5" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products Bar Chart */}
        <div className="card_con chart-card">
          <h2>📦 Products (Selling Price)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="selling_price" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Warehouses Pie Chart */}
        <div className="card_con chart-card">
          <h2>🏬 Warehouses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={warehouses.map((w) => ({
                  name: w.title,
                  value: w.company,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {warehouses.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminController;
