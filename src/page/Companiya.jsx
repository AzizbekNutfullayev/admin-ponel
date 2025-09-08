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
    lastActive: "Hozir"
  });
  const [editingCompany, setEditingCompany] = useState(null);

  // 🔹 Barcha kompaniyalarni olish
  const fetchCompanies = () => {
    axios
      .get("http://localhost:5000/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔹 Yangi kompaniya qo‘shish
  const addCompany = () => {
    axios
      .post("http://localhost:5000/companies", newCompany)
      .then(() => {
        fetchCompanies();
        setNewCompany({ name: "", subscription: "Basic", employees: 0, status: "Faol", lastActive: "Hozir" });
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Kompaniyani yangilash
  const updateCompany = () => {
    if (!editingCompany) return;
    axios
      .put(`http://localhost:5000/companies/${editingCompany.id}`, editingCompany)
      .then(() => {
        fetchCompanies();
        setEditingCompany(null);
      })
      .catch((err) => console.error(err));
  };

  const deleteCompany = (id) => {
    if (!window.confirm("Haqiqatan o‘chirmoqchimisiz?")) return;
    axios
      .delete(`http://localhost:5000/companies/${id}`)
      .then(() => fetchCompanies())
      .catch((err) => console.error(err));
  };

  const filteredCompanies = companies.filter((company) =>
    filter === "all" ? true : company.status === filter
  );

  return (
    <div className="companies">
      <h2 className="companies__title">Kompaniyalar</h2>

      <div className="companies__filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "btn btn--active" : "btn"}>
          Barchasi
        </button>
        <button onClick={() => setFilter("Faol")} className={filter === "Faol" ? "btn btn--active" : "btn"}>
          Faol
        </button>
        <button onClick={() => setFilter("Nofaol")} className={filter === "Nofaol" ? "btn btn--active" : "btn"}>
          Nofaol
        </button>
      </div>

      <div className="form">
        <h3>Yangi kompaniya qo‘shish</h3>
        <input
          type="text"
          placeholder="Kompaniya nomi"
          value={newCompany.name}
          onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
        />
        <select
          value={newCompany.subscription}
          onChange={(e) => setNewCompany({ ...newCompany, subscription: e.target.value })}
        >
          <option value="Basic">Basic</option>
          <option value="Standart">Standart</option>
          <option value="Premium">Premium</option>
        </select>
        <input
          type="number"
          placeholder="Xodimlar soni"
          value={newCompany.employees}
          onChange={(e) => setNewCompany({ ...newCompany, employees: e.target.value })}
        />
        <button onClick={addCompany} className="btn btn--primary">Qo‘shish</button>
      </div>

      {editingCompany && (
        <div className="form edit-form">
          <h3>Tahrirlash: {editingCompany.name}</h3>
          <input
            type="text"
            value={editingCompany.name}
            onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
          />
          <select
            value={editingCompany.subscription}
            onChange={(e) => setEditingCompany({ ...editingCompany, subscription: e.target.value })}
          >
            <option value="Basic">Basic</option>
            <option value="Standart">Standart</option>
            <option value="Premium">Premium</option>
          </select>
          <input
            type="number"
            value={editingCompany.employees}
            onChange={(e) => setEditingCompany({ ...editingCompany, employees: e.target.value })}
          />
          <button onClick={updateCompany} className="btn btn--primary">Saqlash</button>
          <button onClick={() => setEditingCompany(null)} className="btn">Bekor qilish</button>
        </div>
      )}

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
                  <button className="link" onClick={() => setEditingCompany(company)}>✏️ Tahrirlash</button> |{" "}
                  <button className="link link--red" onClick={() => deleteCompany(company.id)}>🗑 O‘chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCompanies.length === 0 && <p>Hech qanday kompaniya topilmadi.</p>}
      </div>
    </div>
  );
}
