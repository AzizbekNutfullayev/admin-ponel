import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Search, Archive } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Ombor() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    capacity: 0,
    status: "active",
    user: 1,
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/warehouses/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setWarehouses(res.data || []);
    } catch (err) {
      console.error("Omborlarni olishda xatolik:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", location: "", capacity: 0, status: "active", user: 1 });
    setShowModal(true);
  };

  const openEdit = (w) => {
    setEditing(w);
    setForm({
      title: w.title,
      location: w.location,
      capacity: w.capacity || 0,
      status: w.status || "active",
      user: w.user || 1,
    });
    setShowModal(true);
  };

  const saveWarehouse = async () => {
    try {
      if (!form.title.trim()) return alert("Ombor nomi kiritilishi shart!");

      if (editing) {
        await axios.patch(`/api/admin/warehouses/${editing.id}/`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        });
      } else {
        await axios.post("/api/admin/warehouses/", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        });
      }

      await fetchWarehouses();
      setShowModal(false);
    } catch (err) {
      console.error("Saqlash xatosi:", err.response?.data || err.message);
      alert("Xatolik yuz berdi. Konsolni tekshiring.");
    }
  };

  const deleteWarehouse = async (id) => {
    if (!window.confirm("O‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`/api/admin/warehouses/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      await fetchWarehouses();
    } catch (err) {
      console.error("O‘chirish xatosi:", err);
    }
  };

  const filtered = warehouses
    .filter((w) => (filterStatus === "all" ? true : w.status === filterStatus))
    .filter((w) =>
      [w.title, w.location].join(" ").toLowerCase().includes(query.trim().toLowerCase())
    );

  const barData = warehouses.map((w) => ({
    name: w.title,
    capacity: w.capacity || 0,
  }));

  const lineData = warehouses.map((w) => ({
    name: w.title,
    products: (w.products || []).length,
  }));

  return (
    <div className="ombor-wrapper">
      <div className="ombor-header">
        <div>
          <h2 className="ombor-title">
            <Archive size={20} /> Omborlar boshqaruvi
          </h2>
          <p className="ombor-sub">Omborlar va inventar ustidan nazorat.</p>
        </div>

        <div className="ombor-controls">
          <div className="search-ombor">
            <Search size={16} />
            <input
              placeholder="Qidirish: nom, manzil..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select-ombor"
          >
            <option value="all">Barchasi</option>
            <option value="active">Faol</option>
            <option value="maintenance">Ta’mirda</option>
            <option value="inactive">Nofaol</option>
          </select>

          <button className="btn-ombor primary-ombor" onClick={openAdd}>
            <Plus size={14} /> Ombor qo‘shish
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-ombor">
        <div className="chart-card-ombor">
          <h4>Ombor sig‘imlari</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="capacity" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card-ombor">
          <h4>Mahsulotlar soni</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="products" stroke="#22C55E" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading ? (
        <p className="muted-ombor">⏳ Yuklanmoqda...</p>
      ) : (
        <div className="warehouse-grid-ombor">
          {filtered.map((w) => (
            <div key={w.id} className="warehouse-card-ombor">
              <div className="wc-top-ombor">
                <h3 className="wc-name-ombor">{w.title}</h3>
                <span className={`wc-status-ombor wc-status--${w.status}-ombor`}>
                  {w.status}
                </span>
              </div>
              <p className="wc-loc-ombor">{w.location}</p>
              <p className="wc-capacity-ombor">Sig‘im: {w.capacity}</p>
              <div className="wc-actions-ombor">
                <button className="btn-ico-ombor" onClick={() => openEdit(w)}>
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-ico-ombor danger-ombor"
                  onClick={() => deleteWarehouse(w.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop-ombor" onClick={() => setShowModal(false)}>
          <div className="modal-ombor" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? "Omborni tahrirlash" : "Yangi ombor qo‘shish"}</h3>
            <div className="form-row-ombor">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-row-ombor">
              <label>Manzil</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="form-row-ombor">
              <label>Sig‘im</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              />
            </div>
            <div className="form-row-ombor">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Faol</option>
                <option value="maintenance">Ta’mirda</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>

            <div className="modal-actions-ombor">
              <button className="btn-ombor" onClick={() => setShowModal(false)}>
                Bekor
              </button>
              <button className="btn-ombor primary-ombor" onClick={saveWarehouse}>
                {editing ? "Saqlash" : "Qo‘shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
