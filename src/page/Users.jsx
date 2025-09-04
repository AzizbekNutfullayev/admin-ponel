import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:5000/clients")
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredClients = clients.filter((client) =>
    filter === "all" ? true : client.status === filter
  );

  return (
    <div className="clients">
      <h2 className="clients__title">Mijozlar</h2>

      {/* Filter tugmalari */}
      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          Barchasi
        </button>
        <button
          onClick={() => setFilter("Faol")}
          className={filter === "Faol" ? "active" : ""}
        >
          Faol
        </button>
        <button
          onClick={() => setFilter("Nofaol")}
          className={filter === "Nofaol" ? "active" : ""}
        >
          Nofaol
        </button>
      </div>

      <div className="clients__grid">
        {filteredClients.map((client) => (
          <div key={client.id} className="client-card">
            <img src={client.image} alt={client.name} className="client-img" />
            <div className="client-info">
              <h3>{client.name}</h3>
              <p>{client.phone}</p>
              <p className="company">
                Kompaniya:{" "}
                {client.companyName ? client.companyName : "Biriktirilmagan"}
              </p>
              <span
                className={`status ${
                  client.status === "Faol" ? "active-status" : "inactive-status"
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
