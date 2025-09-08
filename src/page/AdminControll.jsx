
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Trash2, Lock, Unlock, Plus } from "lucide-react";

export default function AdminControll() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admins");
      setAdmins(res.data || []);
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Admin qo‘shish
  const addAdmin = async () => {
    try {
      const newAdmin = {
        name: "Yangi Admin",
        email: "newadmin@example.com",
        role: "Admin",
        status: "Active",
      };
      await axios.post("http://localhost:5000/admins", newAdmin);
      fetchAdmins();
    } catch (err) {
      console.error("Qo‘shishda xatolik:", err);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/admins/${id}`, {
        status: status === "Active" ? "Blocked" : "Active",
      });
      fetchAdmins();
    } catch (err) {
      console.error("Status yangilashda xatolik:", err);
    }
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <h2 className="admin__title">👑 Admin boshqaruvi</h2>
        <button className="btn-add" onClick={addAdmin}>
          <Plus size={16} /> Yangi Admin
        </button>
      </div>

      {loading ? (
        <p>⏳ Yuklanmoqda...</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ism</th>
                <th>Email</th>
                <th>Roli</th>
                <th>Status</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <tr key={admin.id}>
                    <td>{index + 1}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>
                      <span
                        className={
                          admin.role === "Super Admin"
                            ? "badge badge--super"
                            : admin.role === "Admin"
                            ? "badge badge--admin"
                            : "badge badge--moderator"
                        }
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          admin.status === "Active"
                            ? "status status--active"
                            : "status status--blocked"
                        }
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn-icon edit">
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => deleteAdmin(admin.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                      {admin.status === "Active" ? (
                        <button
                          className="btn-icon block"
                          onClick={() => toggleStatus(admin.id, admin.status)}
                        >
                          <Lock size={16} />
                        </button>
                      ) : (
                        <button
                          className="btn-icon unblock"
                          onClick={() => toggleStatus(admin.id, admin.status)}
                        >
                          <Unlock size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Ma’lumot yo‘q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

