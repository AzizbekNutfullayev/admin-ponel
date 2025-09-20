import axios from "axios";
import { useEffect, useState } from "react";

function AdminControll() {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/api/admin/admins/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("GET xatolik:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <h1>Adminlar ro‘yxati</h1>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>{admin.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminControll;
