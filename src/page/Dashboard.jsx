import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Users, UserCheck, Package } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [topSales, setTopSales] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 🔹 Statistics
    axios
      .get("/api/admin/statistics/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        console.log("Statistics:", res.data);

        setTransactions([
          { day: "Kunlik", value: res.data.transactions?.daily_transactions || 0 },
          { day: "Oylik", value: res.data.transactions?.monthly_top_products || 0 },
        ]);

        setUsers([
          { name: "Faol foydalanuvchilar", value: res.data.users?.active || 0 },
        ]);

        setCompanies([
          { name: "Jami kompaniyalar", value: res.data.companies?.total || 0 },
          { name: "Tez orada tugaydigan", value: res.data.companies?.expiring_soon || 0 },
        ]);
      })
      .catch((err) =>
        console.error("Statistics GET xatolik:", err.response?.data || err.message)
      );

    // 🔹 Top Sales
    axios
      .get("/api/admin/statistics/top-sales/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        console.log("Top Sales:", res.data);
        // Masalan, [{product: 1, quantity: 2}, ...] keladi → chart uchun {name, value} qilamiz
        const formatted = res.data.map((item) => ({
          name: `Mahsulot ${item.product}`,
          value: item.quantity,
        }));
        setTopSales(formatted);
      })
      .catch((err) =>
        console.error("Top Sales GET xatolik:", err.response?.data || err.message)
      );

    // 🔹 Products
    axios
      .get("/api/admin/products/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        console.log("Products:", res.data);
        const formatted = res.data.map((p) => ({
          name: p.name,
          value: p.quantity || 1, // agar quantity yo‘q bo‘lsa default 1
        }));
        setProducts(formatted);
      })
      .catch((err) =>
        console.error("Products GET xatolik:", err.response?.data || err.message)
      );
  }, []);

  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p className="stat-title">Kompaniyalar</p>
            <h2 className="stat-value">{companies.reduce((a, b) => a + b.value, 0)}</h2>
          </div>
          <Building2 className="stat-icon text-indigo-600" />
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-title">Foydalanuvchilar</p>
            <h2 className="stat-value">{users.reduce((a, b) => a + b.value, 0)}</h2>
          </div>
          <Users className="stat-icon text-green-600" />
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-title">Mahsulotlar</p>
            <h2 className="stat-value">{products.length || 0}</h2>
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
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Sales Bar */}
        <div className="chart-card">
          <h3 className="chart-title">Eng ko‘p sotilgan mahsulotlar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22C55E" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Companies Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Kompaniyalar taqsimoti</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={companies} dataKey="value" nameKey="name" outerRadius={100} label>
                {companies.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Products Pie */}
        <div className="chart-card">
          <h3 className="chart-title">Mahsulotlar taqsimoti</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={products} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label>
                {products.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
}
