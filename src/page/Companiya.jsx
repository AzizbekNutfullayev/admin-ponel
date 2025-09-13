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

  const fetchCompanies = () => {
    axios
      .get("  ") 
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Xatolik:", err));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔹 Yangi kompaniya qo‘shish
  const addCompany = () => {
    axios
      .post("https://your-api.com/admin/companies/", newCompany) // ✅ POST API
      .then(() => {
        fetchCompanies();
        setNewCompany({
          name: "",
          subscription: "Basic",
          employees: 0,
          status: "Faol",
          lastActive: "Hozir",
        });
      })
      .catch((err) => console.error("Qo‘shishda xatolik:", err));
  };

  // 🔹 Kompaniyani yangilash
  const updateCompany = () => {
    if (!editingCompany) return;
    axios
      .put(
        `https://your-api.com/admin/companies/${editingCompany.id}/`,
        editingCompany
      ) // ✅ PUT API
      .then(() => {
        fetchCompanies();
        setEditingCompany(null);
      })
      .catch((err) => console.error("Yangilashda xatolik:", err));
  };

  // 🔹 Kompaniyani o‘chirish
  const deleteCompany = (id) => {
    if (!window.confirm("Haqiqatan o‘chirmoqchimisiz?")) return;
    axios
      .delete(`https://your-api.com/admin/companies/${id}/`) // ✅ DELETE API
      .then(() => fetchCompanies())
      .catch((err) => console.error("O‘chirishda xatolik:", err));
  };

  const filteredCompanies = companies.filter((company) =>
    filter === "all" ? true : company.status === filter
  );

  return (
    <div className="companies">
      <h2 className="companies__title">🏢 Kompaniyalar</h2>

      {/* 🔹 Filter tugmalari */}
      <div className="companies__filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "btn btn--active" : "btn"}
        >
          Barchasi
        </button>
        <button
          onClick={() => setFilter("Faol")}
          className={filter === "Faol" ? "btn btn--active" : "btn"}
        >
          Faol
        </button>
        <button
          onClick={() => setFilter("Nofaol")}
          className={filter === "Nofaol" ? "btn btn--active" : "btn"}
        >
          Nofaol
        </button>
      </div>

      {/* 🔹 Yangi kompaniya qo‘shish formasi */}
      <div className="form">
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
            setNewCompany({ ...newCompany, employees: e.target.value })
          }
        />
        <button onClick={addCompany} className="btn btn--primary">
          Qo‘shish
        </button>
      </div>

      {/* 🔹 Tahrirlash formasi */}
      {editingCompany && (
        <div className="form edit-form">
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
                employees: e.target.value,
              })
            }
          />
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
      )}

      {/* 🔹 Jadval */}
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
                <td>{company.status}</td>
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
    </div>
  );
}
