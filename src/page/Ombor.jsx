import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Archive,
  Package,
  Box,
} from "lucide-react";
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null or warehouse object
  const [form, setForm] = useState({ name: "", location: "", capacity: 0 });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [wRes, pRes] = await Promise.all([
        axios.get("http://localhost:5000/warehouses"),
        axios.get("http://localhost:5000/products"),
      ]);
      setWarehouses(wRes.data || []);
      setProducts(pRes.data || []);
    } catch (err) {
      console.error("Omborlarni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add / Update
  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", location: "", capacity: 0 });
    setShowModal(true);
  };

  const openEdit = (w) => {
    setEditing(w);
    setForm({ name: w.name, location: w.location, capacity: w.capacity || 0 });
    setShowModal(true);
  };

  const saveWarehouse = async () => {
    try {
      if (!form.name.trim()) return alert("Nomi kiritilishi shart");
      if (editing) {
        await axios.patch(
          `http://localhost:5000/warehouses/${editing.id}`,
          form
        );
      } else {
        await axios.post("http://localhost:5000/warehouses", {
          ...form,
          status: "active",
        });
      }
      await fetchAll();
      setShowModal(false);
    } catch (err) {
      console.error("Saqlash xatosi:", err);
      alert("Xatolik yuz berdi. Konsolni tekshiring.");
    }
  };

  // Delete
  const deleteWarehouse = async (id) => {
    if (!window.confirm("O'chirmoqchimizmi?")) return;
    try {
      await axios.delete(`http://localhost:5000/warehouses/${id}`);
      await fetchAll();
    } catch (err) {
      console.error("O'chirish xatosi:", err);
    }
  };

  // Adjust stock
  const adjustStock = async (warehouseId, productId, delta) => {
    try {
      await axios.post(
        `http://localhost:5000/warehouses/${warehouseId}/adjust-stock`,
        {
          productId,
          delta,
        }
      );
      await fetchAll();
    } catch (err) {
      console.error("Stock yangilash xatosi:", err);
    }
  };

  // Derived & filtered list
  const filtered = warehouses
    .filter((w) => (filterStatus === "all" ? true : w.status === filterStatus))
    .filter((w) =>
      [w.name, w.location]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );

  // Chart data
  const barData = warehouses.map((w) => ({
    name: w.name,
    capacity: w.capacity || 0,
  }));

  const lineData = warehouses.map((w) => ({
    name: w.name,
    products: (w.products || []).length,
  }));

  return (
    <div className="ombor">
      <div className="ombor__header">
        <div>
          <h2 className="ombor__title">
            <Archive size={20} /> Omborlar boshqaruvi
          </h2>
          <p className="ombor__sub">
            Omborlar, qoldiqlar va inventar ustidan to‘liq nazorat.
          </p>
        </div>

        <div className="ombor__controls">
          <div className="search">
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
            className="select"
          >
            <option value="all">Barchasi</option>
            <option value="active">Faol</option>
            <option value="maintenance">Ta'mirlashda</option>
            <option value="inactive">Nofaol</option>
          </select>

          <button className="btn primary" onClick={openAdd}>
            <Plus size={14} /> Ombor qo'shish
          </button>
        </div>
      </div>

      {/* Statistika chartlar */}
      <div className="charts">
        <div className="chart-card">
          <h4>Ombor sig‘imlari</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="capacity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Omborlardagi mahsulotlar soni</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="products" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading ? (
        <p className="muted">⏳ Yuklanmoqda...</p>
      ) : (
        <>
          {/* Grid of warehouse cards */}
          <div className="warehouse-grid">
            {filtered.map((w) => (
              <div key={w.id} className="warehouse-card">
                <div className="wc-top">
                  <div className="wc-left">
                    <h3 className="wc-name">{w.name}</h3>
                    <p className="wc-loc">{w.location}</p>
                    <div
                      className={`wc-status wc-status--${w.status || "active"}`}
                    >
                      {w.status}
                    </div>
                  </div>
                  <div className="wc-actions">
                    <button className="icon-btn" onClick={() => openEdit(w)}>
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => deleteWarehouse(w.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="wc-body">
                  <div className="wc-capacity">
                    <Package size={18} />
                    <div>
                      <div className="muted">Sig‘im</div>
                      <strong>{w.capacity || 0}</strong>
                    </div>
                  </div>

                  <div className="wc-stock-title">
                    Mahsulotlar ({(w.products || []).length})
                  </div>

                  <div className="wc-products">
                    {(w.products || []).slice(0, 6).map((p) => (
                      <div key={p.id} className="wc-product">
                        <div className="prod-left">
                          <Box size={16} />
                          <div>
                            <div className="prod-name">{p.name}</div>
                            <div className="muted small">
                              Qoldiq: {p.stock}
                            </div>
                          </div>
                        </div>
                        <div className="prod-actions">
                          <button
                            className="tiny"
                            onClick={() => adjustStock(w.id, p.id, +1)}
                          >
                            +1
                          </button>
                          <button
                            className="tiny"
                            onClick={() => adjustStock(w.id, p.id, -1)}
                          >
                            -1
                          </button>
                        </div>
                      </div>
                    ))}

                    {(w.products || []).length === 0 && (
                      <div className="muted small">Mahsulot mavjud emas</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table view */}
          <div className="table-wrap">
            <table className="table-ombor">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ombor nomi</th>
                  <th>Manzil</th>
                  <th>Sig‘im</th>
                  <th>Mahsulotlar</th>
                  <th>Status</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w, i) => (
                  <tr key={w.id}>
                    <td>{i + 1}</td>
                    <td>{w.name}</td>
                    <td>{w.location}</td>
                    <td>{w.capacity || 0}</td>
                    <td>{(w.products || []).length}</td>
                    <td>
                      <span
                        className={`wc-badge wc-badge--${w.status || "active"}`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-ico"
                        onClick={() => openEdit(w)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-ico danger"
                        onClick={() => deleteWarehouse(w.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Hech qanday ombor topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? "Omborni tahrirlash" : "Yangi ombor qo'shish"}</h3>
            <div className="form-row">
              <label>Ismi</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label>Manzili</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label>Sig‘imi</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>
                Bekor
              </button>
              <button className="btn primary" onClick={saveWarehouse}>
                {editing ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

