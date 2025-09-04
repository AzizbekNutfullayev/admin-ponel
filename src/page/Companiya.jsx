import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Companiya() {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:5000/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredCompanies = companies.filter((company) =>
    filter === "all" ? true : company.status === filter
  );

  return (
    <div className="companies">
      <h2 className="companies__title">Kompaniyalar</h2>

      {/* Filter tugmalari */}
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

      {/* Jadval */}
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
                  <button className="link">Ko‘rish</button> |{" "}
                  <button className="link">Tahrirlash</button> |{" "}
                  <button className="link link--red">O‘chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}













