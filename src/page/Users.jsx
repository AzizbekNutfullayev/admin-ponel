import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company: "",
    role: "User",
    status: "Faol",
  });
  const [filter, setFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);

  // 🔹 GET
  const fetchUsers = () => {
    axios
      .get("/api/admin/users/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error("GET xatolik:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 POST
  const addUser = () => {
    if (!newUser.first_name.trim() || !newUser.phone_number.trim()) {
      alert("Ism va telefon raqamni kiriting!");
      return;
    }
    axios
      .post("/api/admin/users/", newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => {
        fetchUsers();
        setNewUser({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          company: "",
          role: "User",
          status: "Faol",
        });
      })
      .catch((err) => {
        console.error("POST xatolik:", err.response?.data || err.message);
        alert("Foydalanuvchi qo‘shishda xatolik!");
      });
  };

  // 🔹 PUT
  const updateUser = () => {
    if (!editUser) return;
    axios
      .put(`/api/admin/users/${editUser.id}/`, editUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => {
        fetchUsers();
        setEditUser(null);
      })
      .catch((err) => console.error("PUT xatolik:", err));
  };

  // 🔹 PATCH (status)
  const toggleStatus = (id, currentStatus) => {
    axios
      .patch(
        `/api/admin/users/${id}/`,
        { status: currentStatus === "Faol" ? "Nofaol" : "Faol" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
      )
      .then(() => fetchUsers())
      .catch((err) => console.error("PATCH xatolik:", err));
  };

  // 🔹 DELETE
  const deleteUser = (id) => {
    if (!window.confirm("Foydalanuvchini o‘chirmoqchimisiz?")) return;
    axios
      .delete(`/api/admin/users/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => fetchUsers())
      .catch((err) => console.error("DELETE xatolik:", err));
  };

  // 🔹 Filter
  const filteredUsers = users.filter((u) =>
    filter === "all" ? true : u.status === filter
  );

  return (
    <div className="users-container">
      <h2>👤 Foydalanuvchilar</h2>

      {/* 🔹 Yangi qo‘shish form */}
      <div className="user-form">
        <input
          type="text"
          placeholder="Ismi"
          value={newUser.first_name}
          onChange={(e) =>
            setNewUser({ ...newUser, first_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Familiya"
          value={newUser.last_name}
          onChange={(e) =>
            setNewUser({ ...newUser, last_name: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Telefon"
          value={newUser.phone_number}
          onChange={(e) =>
            setNewUser({ ...newUser, phone_number: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Kompaniya"
          value={newUser.company}
          onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          value={newUser.status}
          onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
        >
          <option value="Faol">Faol</option>
          <option value="Nofaol">Nofaol</option>
        </select>
        <button className="btn-user add" onClick={addUser}>
          ➕ Qo‘shish
        </button>
      </div>

      {/* 🔹 Filter */}
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

      {/* 🔹 Users ro‘yxati */}
      <div className="users-table">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div key={u.id} className="user-row">
              <div className="user-info">
                <img
                  src={`https://ui-avatars.com/api/?name=${u.first_name || "U"}+${
                    u.last_name || ""
                  }&background=random`}
                  alt="avatar"
                  className="avatar"
                />
                <div>
                  <h3>
                    {(u.first_name || "") + " " + (u.last_name || "") || "Ism yo‘q"}
                  </h3>
                  <p>{u.email || "Email kiritilmagan"}</p>
                </div>
              </div>
              <div className="user-phone">📞 {u.phone_number}</div>
              <div
                className={`user-status ${
                  u.status === "Faol"
                    ? "active-status"
                    : u.status === "Nofaol"
                    ? "inactive-status"
                    : "unknown-status"
                }`}
                onClick={() => toggleStatus(u.id, u.status)}
              >
                {u.status || "Noma'lum"}
              </div>
              <div className="user-role">{u.role || "Foydalanuvchi"}</div>
              <div className="user-date">{u.created_at?.slice(0, 10) || "—"}</div>
              <div className="user-actions">
                <button className="edit" onClick={() => setEditUser(u)}>✏️</button>
                <button className="delete" onClick={() => deleteUser(u.id)}>🗑</button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">Foydalanuvchi topilmadi</p>
        )}
      </div>

      {/* 🔹 Edit Modal */}
      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>✏️ Foydalanuvchini tahrirlash</h3>
            <input
              type="text"
              value={editUser.first_name}
              onChange={(e) =>
                setEditUser({ ...editUser, first_name: e.target.value })
              }
            />
            <input
              type="text"
              value={editUser.last_name}
              onChange={(e) =>
                setEditUser({ ...editUser, last_name: e.target.value })
              }
            />
            <input
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <input
              type="text"
              value={editUser.phone_number}
              onChange={(e) =>
                setEditUser({ ...editUser, phone_number: e.target.value })
              }
            />
            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              value={editUser.status}
              onChange={(e) =>
                setEditUser({ ...editUser, status: e.target.value })
              }
            >
              <option value="Faol">Faol</option>
              <option value="Nofaol">Nofaol</option>
            </select>
            <div className="modal-actions">
              <button onClick={updateUser} className="btn-user add">
                💾 Saqlash
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="btn-user delete"
              >
                ❌ Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  