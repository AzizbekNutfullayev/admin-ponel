import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Companiya() {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newCompany, setNewCompany] = useState({
    name: "",
    subscription: "Basic",
    employees: 0,
    status: "Faol",
    lastActive: "Hozir",
  });
  const [editingCompany, setEditingCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCompanies = () => {
    axios
      .get("/api/admin/companies/")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("GET xatolik:", err));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = () => {
    axios
      .post("/api/admin/companies/", newCompany)
      .then(() => {
        fetchCompanies();
        setNewCompany({
          name: "",
          subscription: "Basic",
          employees: 0,
          status: "Faol",
          lastActive: "Hozir",
        });
        setShowModal(false);
      })
      .catch((err) => console.error("POST xatolik:", err));
  };

  const updateCompany = () => {
    if (!editingCompany) return;
    axios
      .put(`/api/admin/companies/${editingCompany.id}/`, editingCompany)
      .then(() => {
        fetchCompanies();
        setEditingCompany(null);
      })
      .catch((err) => console.error("PUT xatolik:", err));
  };

  const deleteCompany = (id) => {
    if (!window.confirm("Haqiqatan o‘chirmoqchimisiz?")) return;
    axios
      .delete(`/api/admin/companies/${id}/`)
      .then(() => fetchCompanies())
      .catch((err) => console.error("DELETE xatolik:", err));
  };

  const filteredCompanies = companies.filter((company) =>
    filter === "all" ? true : company.status === filter
  );

  return (
    <div className="companies">
      <div className="companies__header">
        <h2>🏢 Kompaniyalar</h2>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          ➕ Kompaniya qo‘shish
        </button>
      </div>

      <div className="companies__filters">
        {["all", "Faol", "Nofaol"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "btn btn--active" : "btn"}
          >
            {f === "all" ? "Barchasi" : f}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Kompaniya nomi</th>
              <th>Obuna turi</th>
              <th>Xodimlar soni</th>
              <th>Holati</th>
              <th>Oxirgi faollik</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.subscription}</td>
                <td>{company.employees}</td>
                <td>
                  <span
                    className={
                      company.status === "Faol"
                        ? "badge badge--green"
                        : "badge badge--red"
                    }
                  >
                    {company.status}
                  </span>
                </td>
                <td>{company.lastActive}</td>
                <td>
                  <button
                    className="link"
                    onClick={() => setEditingCompany(company)}
                  >
                    ✏️ Tahrirlash
                  </button>{" "}
                  |{" "}
                  <button
                    className="link link--red"
                    onClick={() => deleteCompany(company.id)}
                  >
                    🗑 O‘chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCompanies.length === 0 && (
          <p>Hech qanday kompaniya topilmadi.</p>
        )}
      </div>

      {/* 🔹 Yangi kompaniya qo‘shish Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal__content">
            <h3>➕ Yangi kompaniya qo‘shish</h3>
            <input
              type="text"
              placeholder="Kompaniya nomi"
              value={newCompany.name}
              onChange={(e) =>
                setNewCompany({ ...newCompany, name: e.target.value })
              }
            />
            <select
              value={newCompany.subscription}
              onChange={(e) =>
                setNewCompany({ ...newCompany, subscription: e.target.value })
              }
            >
              <option value="Basic">Basic</option>
              <option value="Standart">Standart</option>
              <option value="Premium">Premium</option>
            </select>
            <input
              type="number"
              placeholder="Xodimlar soni"
              value={newCompany.employees}
              onChange={(e) =>
                setNewCompany({
                  ...newCompany,
                  employees: Number(e.target.value),
                })
              }
            />
            <div className="modal__actions">
              <button onClick={addCompany} className="btn btn--primary">
                Qo‘shish
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn--secondary"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Tahrirlash formasi */}
      {editingCompany && (
        <div className="modal">
          <div className="modal__content">
            <h3>✏️ Tahrirlash: {editingCompany.name}</h3>
            <input
              type="text"
              value={editingCompany.name}
              onChange={(e) =>
                setEditingCompany({ ...editingCompany, name: e.target.value })
              }
            />
            <select
              value={editingCompany.subscription}
              onChange={(e) =>
                setEditingCompany({
                  ...editingCompany,
                  subscription: e.target.value,
                })
              }
            >
              <option value="Basic">Basic</option>
              <option value="Standart">Standart</option>
              <option value="Premium">Premium</option>
            </select>
            <input
              type="number"
              value={editingCompany.employees}
              onChange={(e) =>
                setEditingCompany({
                  ...editingCompany,
                  employees: Number(e.target.value),
                })
              }
            />
            <div className="modal__actions">
              <button onClick={updateCompany} className="btn btn--primary">
                Saqlash
              </button>
              <button
                onClick={() => setEditingCompany(null)}
                className="btn btn--secondary"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
