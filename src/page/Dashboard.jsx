import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";


export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [regions, setRegions] = useState([]);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/transactions").then(res => setTransactions(res.data));
    axios.get("http://localhost:5000/brands").then(res => setBrands(res.data));
    axios.get("http://localhost:5000/regions").then(res => setRegions(res.data));
    axios.get("http://localhost:5000/months").then(res => setMonths(res.data));
  }, []);

  return (
    <div className="dashboard-grid">
      {/* Line Chart */}
      <div className="card">
        <h3>Kunlik/Oylik tranzaksiyalar</h3>
        <p>Oxirgi 30 kun <span className="green">+15%</span></p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={transactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Brands */}
      <div className="card">
        <h3>Brendlar bo‘yicha taqsimot</h3>
        <p>Joriy yil <span className="red">-5%</span></p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={brands}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regions */}
      <div className="card">
        <h3>TOP mahsulotlar</h3>
        <p>Joriy oy <span className="green">+10%</span></p>
        {regions.map((r, i) => (
          <div key={i} className="progress-row">
            <span>{r.name}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${r.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Months */}
      <div className="card">
        <h3>Hududlar bo‘yicha sotuvlar</h3>
        <p>Joriy yil <span className="green">+20%</span></p>
        {months.map((m, i) => (
          <div key={i} className="progress-row">
            <span>{m.name}</span>
            <div className="progress-bar">
              <div className="progress-fill green-bg" style={{ width: `${m.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
