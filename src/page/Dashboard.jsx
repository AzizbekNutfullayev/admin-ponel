import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [monitoring, setMonitoring] = useState({});
  const [support, setSupport] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/transactions").then(res => setTransactions(res.data));
    axios.get("http://localhost:5000/statistics").then(res => setStatistics(res.data));
    axios.get("http://localhost:5000/subscriptions").then(res => setSubscriptions(res.data));
    axios.get("http://localhost:5000/monitoring").then(res => setMonitoring(res.data));
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/support").then(res => {
      if (Array.isArray(res.data)) {
        setSupport(res.data); // to‘g‘ridan-to‘g‘ri massiv
      } else if (Array.isArray(res.data.tickets)) {
        setSupport(res.data.tickets); // tickets ichida massiv bo‘lsa
      } else {
        setSupport([]); // boshqa holat bo‘lsa bo‘sh massiv
      }
    }).catch(() => setSupport([]));
  }, []);


  return (
    <div className="dashboard-grid">
      {/* Dashboard umumiy ko‘rsatkichlari */}
      <div className="card stats-card">
        <h3>Asosiy ko‘rsatkichlar</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span>Kompaniyalar</span>
            <strong>{statistics.totalCompanies || 0}</strong>
          </div>
          <div className="stat-box">
            <span>Foydalanuvchilar</span>
            <strong>{statistics.activeUsers || 0}</strong>
          </div>
          <div className="stat-box">
            <span>Tranzaksiyalar</span>
            <strong>{statistics.totalTransactions || 0}</strong>
          </div>
          <div className="stat-box">
            <span>Sotuv hajmi</span>
            <strong>${statistics.salesVolume || 0}</strong>
          </div>
          <div className="stat-box">
            <span>Obunalar</span>
            <strong>{statistics.activeSubscriptions || 0}</strong>
          </div>
        </div>
      </div>

      {/* Transactions - Line Chart */}
      <div className="card">
        <h3>Tranzaksiyalar oqimi</h3>
        <p>Oxirgi 30 kun</p>
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

      {/* Subscriptions - Bar Chart */}
      <div className="card">
        <h3>Obunalar turlari</h3>
        <p>Joriy yil</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={subscriptions}>
            <CartesianGrid
              strokeDasharray="3 3" />
            <XAxis dataKey="plan" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monitoring */}
      <div className="card">
        <h3>Monitoring</h3>
        <ul className="monitor-list">
          <li>Onlayn foydalanuvchilar: <strong>{monitoring.onlineUsers || 0}</strong></li>
          <li>Tranzaksiya tezligi: <strong>{monitoring.tps || 0} / sec</strong></li>
          <li>Server yuklanishi: <strong>{monitoring.serverLoad || "N/A"}%</strong></li>
          <li>Shubhali harakatlar: <strong>{monitoring.suspicious || 0}</strong></li>
        </ul>
      </div>

      {/* Support */}
      <div className="card">
        <h3>Qo‘llab-quvvatlash (so‘nggi ticketlar)</h3>
        <ul className="support-list">
          {Array.isArray(support) && support.length > 0 ? (
            support.slice(0, 5).map((ticket) => (
              <li key={ticket.id}>
                <span>{ticket.companyName}</span> – {ticket.issue}
                <span className={`status ${ticket.status?.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </li>
            ))
          ) : (
            <li>Hozircha ticketlar yo‘q</li>
          )}
        </ul>
      </div>
    </div>
  );
}
