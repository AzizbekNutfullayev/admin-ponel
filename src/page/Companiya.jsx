import React, { useEffect, useState } from "react";
import axios from "axios";

const Companiya = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({ name: "", owner: 1 });
  const [editCompany, setEditCompany] = useState(null);

  // 🔹 GET
  const fetchCompanies = () => {
    axios
      .get("/api/admin/companies/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        setCompanies(res.data);
      })
      .catch((err) => console.error("GET xatolik:", err));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔹 POST
  const addCompany = () => {
    if (!newCompany.name.trim()) {
      alert("Kompaniya nomini kiriting!");
      return;
    }
    axios
      .post("/api/admin/companies/", newCompany, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => {
        fetchCompanies();
        setNewCompany({ name: "", owner: 1 });
      })
      .catch((err) => {
        console.error("POST xatolik:", err.response?.data || err.message);
        alert("Kompaniya qo‘shishda xatolik!");
      });
  };

  // 🔹 PUT (to‘liq update)
  const updateCompany = () => {
    if (!editCompany) return;
    axios
      .put(`/api/admin/companies/${editCompany.id}/`, editCompany, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => {
        fetchCompanies();
        setEditCompany(null);
      })
      .catch((err) => console.error("PUT xatolik:", err));
  };

  // 🔹 PATCH (qisman update)
  const patchCompanyName = (id, newName) => {
    axios
      .patch(
        `/api/admin/companies/${id}/`,
        { name: newName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
      )
      .then(() => fetchCompanies())
      .catch((err) => console.error("PATCH xatolik:", err));
  };

  // 🔹 DELETE
  const deleteCompany = (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirishni xohlaysizmi?")) return;
    axios
      .delete(`/api/admin/companies/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => fetchCompanies())
      .catch((err) => console.error("DELETE xatolik:", err));
  };

  return (
    <div className="company-container">
      <h2>🏢 Kompaniyalar</h2>

      {/* 🔹 Qo‘shish form */}
      <div className="company-form">
        <input
          type="text"
          placeholder="Kompaniya nomi"
          value={newCompany.name}
          onChange={(e) =>
            setNewCompany({ ...newCompany, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Owner ID"
          value={newCompany.owner}
          onChange={(e) =>
            setNewCompany({ ...newCompany, owner: e.target.value })
          }
        />
        <button className="btn-company add" onClick={addCompany}>
          ➕ Qo‘shish
        </button>
      </div>

      {/* 🔹 Jadval */}
      <div className="company-table">
        {companies.length > 0 ? (
          companies.map((c) => (
            <div key={c.id} className="company-row">
              <div>
                <h3>{c.name}</h3>
                <p>ID: {c.id} | Owner: {c.owner}</p>
              </div>
              <div className="company-actions">
                <button
                  className="edit"
                  onClick={() => setEditCompany(c)}
                >
                  ✏️
                </button>
                <button
                  className="patch"
                  onClick={() => {
                    const newName = prompt("Yangi nomni kiriting:", c.name);
                    if (newName) patchCompanyName(c.id, newName);
                  }}
                >
                  🔄
                </button>
                <button
                  className="delete"
                  onClick={() => deleteCompany(c.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">Hali kompaniya yo‘q</p>
        )}
      </div>

      {editCompany && (
        <div className="modal">
          <div className="modal-content">
            <h3>✏️ Kompaniyani tahrirlash</h3>
            <input
              type="text"
              value={editCompany.name}
              onChange={(e) =>
                setEditCompany({ ...editCompany, name: e.target.value })
              }
            />
            <input
              type="number"
              value={editCompany.owner}
              onChange={(e) =>
                setEditCompany({ ...editCompany, owner: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={updateCompany} className="btn-company add">
                💾 Saqlash
              </button>
              <button
                onClick={() => setEditCompany(null)}
                className="btn-company delete"
              >
                ❌ Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companiya;
